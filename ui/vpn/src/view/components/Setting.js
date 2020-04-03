import React, {Component} from 'react';
import "./Setting.css"
import {ActionSheet, Cell, CellBody, CellFooter, Cells, PopupHeader, Toast} from 'react-weui';
import axios from "axios";


class Setting extends Component {
    state = {
        instances: [],
        showToast: false,
        showActionSheet: false,
        currentId: null,
        menus: [
            {
                label: 'Change IP',
                onClick: this.changeIp.bind(this)
            },
            // {
            //     label: 'Change Zone',
            //     onClick: ()=>{}
            // }
        ]
    };

    changeIp() {
        window.stop_ping_google = true;
        this.setState({
            showToast: true,
            showActionSheet: false
        })
        this.removeInstance(this.state.currentId)
    }

    removeInstance(instance_id) {

        const {ss_base_host, instance} = window.globalObject;
        window.connecting_time_id && clearInterval(window.connecting_time_id)
        window.connect_status = "disconnected"
        window.stop_ping_google = true;
        window.globalObject.instance = undefined;

        axios.delete(
            `http://${ss_base_host}/shadowsocks?ss=` + encodeURIComponent(instance.qr_code),
            null
        ).then(({data}) => {
            const {error} = data;
            console.log(data)
            if (error === 0) {

                axios.delete(`/compute/remove/${instance_id}`).then(({data}) => {
                    console.log("removed", instance_id)
                    this.createInstance()
                })
            }
        })


    }

    createInstance(server_type = "ss") {
        const zone = window.globalObject.constant.default_zone;
        axios.post(`/compute/create/${zone}/${server_type}`).then(({data}) => {
            const {body} = data;
            window.globalObject.instance = body;
            window.globalObject.instances = [body];
            this.setState({
                instances: [body]
            })
            console.log("createInstance", body)
            this.checkInstance(body.id)
        })
    }

    checkInstance(instance_id) {
        axios.get(`/compute/${instance_id}`).then(({data}) => {
            const {body} = data;
            window.globalObject.instance = body;
            window.globalObject.instances = [body];
            this.setState({
                instances: [body]
            })
            if (body.ip) {
                console.log("get ip", body.ip)
                return window.location.reload();
            }
            if (body.port_status === "UP") {
                this.setState({
                    showToast: false
                })
                console.log("up", body)
            } else {
                setTimeout(() => {
                    this.checkInstance(body.id)
                }, 1000)
            }
        })
    }

    componentDidMount() {
        const access_token = localStorage.getItem("access_token");
        if (access_token) {
            if (!window.globalObject.instances) {
                axios.get(`/compute/list`).then(({data}) => {
                    const {body} = data;
                    window.globalObject.instances = body;
                    this.setState({
                        instances: body
                    })
                })
            } else {
                this.setState({
                    instances: window.globalObject.instances
                })
            }
        }

    }

    componentWillUnmount() {

    }

    render() {
        const {instances} = this.state;
        return (
            <div className={"Setting"} style={{height: '100vh', overflow: 'scroll'}}>
                <PopupHeader right={"Close"} rightOnClick={this.props.toggle.bind(this, "showSetting")}/>
                <div>
                    <Cells>
                        {instances.map(({ip, id, port, zone, status, port_status}, i) => {
                            return (
                                <Cell onClick={() => {

                                    this.setState({
                                        showActionSheet: true,
                                        currentId: id
                                    })

                                }}  key={i} access>
                                    <CellBody>
                                        {ip} : {port}
                                    </CellBody>
                                    <CellFooter>
                                        {zone}
                                    </CellFooter>
                                </Cell>
                            )
                        })}
                    </Cells>
                </div>
                <ActionSheet
                    menus={this.state.menus}
                    actions={[]}
                    show={this.state.showActionSheet}
                    onRequestClose={e => this.setState({showActionSheet: !this.state.showActionSheet})}
                />
                <Toast icon="loading" show={this.state.showToast}>Loading</Toast>
            </div>
        )
    }
}

export default Setting;
