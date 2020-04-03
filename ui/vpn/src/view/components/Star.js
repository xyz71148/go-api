import React, {Component} from 'react';
import axios from "axios";
import {Toast, Toptips} from "react-weui";
window.connect_status = "disconnected";

class Star extends Component {
    state = {
        showToast: false,
        tips: {
            visible: false,
            msg: "",
            type: "warn"
        },
        star_css: "star_off",
        tipTxt: null

    };

    showTips(msg, type = "warn") {
        const {tips} = this.state;
        tips.msg = msg;
        tips.type = type;
        tips.visible = true;
        this.setState({tips})
        setTimeout(() => {
            tips.visible = false;
            this.setState({tips})
        }, 1400)
    }

    componentDidMount() {
        console.log("checkShadowSocksStatus")
        this.checkShadowSocksStatus()
    }

    componentWillUnmount() {
        window.connecting_time_id && clearInterval(window.connecting_time_id)
    }

    checkShadowSocksStatus() {
        const access_token = localStorage.getItem("access_token");
        if (!access_token) return;
        const {ss_base_host} = window.globalObject;
        //console.log("checkShadowSocksStatus")
        axios.get(`http://${ss_base_host}/shadowsocks`).then(({data}) => {
            const {error, body, msg} = data;
            console.log(error,msg)
            if (error === 0) {
                console.log("get shadowsocks setting", body)
                this.onOpenConn()
            } else {
                this.showTips(msg)
                console.log("get shadowsocks error", msg)
            }
        })
    }

    getInstance() {
        window.globalObject.instance = undefined;
        this.setState({
            showToast: true
        })
        console.log("getInstance from list")
        axios.get(`/compute/list`).then(({data}) => {
            const {body} = data;
            window.globalObject.instances = body;
            body.map((instance, i) => {
                console.log(instance)
                if (instance.server_type === "ss") {
                    window.globalObject.instance = instance;
                }
                return instance
            });
            if (window.globalObject.instance) {
                this.setState({
                    showToast: false
                })
                const {instance} = window.globalObject
                console.log(`list is find onOpenConn`,instance.ip,instance.port,instance.qr_code)
                setTimeout(()=>{
                    this.onOpenConn()
                },1000)
            } else {
                console.log("createInstance because list is empty")
                this.createInstance()
            }
        })
    }

    createInstance(server_type = "ss") {
        const zone = window.globalObject.constant.default_zone;
        axios.post(`/compute/create/${zone}/${server_type}`).then(({data}) => {
            const {body} = data;
            window.globalObject.instance = body;
            this.checkInstance(body.id)
        })
    }

    checkInstance(instance_id) {
        axios.get(`/compute/${instance_id}`).then(({data}) => {
            const {body} = data;
            window.globalObject.instance = body;
            if (body.port_status === "UP") {
                this.setState({
                    showToast: false
                })
                this.onOpenConn()
            } else {
                setTimeout(()=>{
                    this.checkInstance(body.id)
                },1000)
            }
        })
    }

    onOpenConn() {
        console.log("onOpenConn")
        const access_token = localStorage.getItem("access_token");
        if (!access_token) {
            return this.props.toggle("showLogin")
        }
        const {instance} = window.globalObject;
        if (!instance || !instance.qr_code) {
            console.log("qr_code is null")
            return this.getInstance()
        }
        //const qr_code = "ss://aes-256-cfb:2584d3@35.241.81.143:8108";
        const qr_code = instance.qr_code;
        this.props.setQrCodeButton(qr_code)
        window.connect_status = "connecting";
        this.setState({
            star_css: "star_on_1",
            tipTxt:"Connecting"
        })
        this.timeout = 1400;
        this.connecting();
        this.openConn(qr_code)
    }

    timeout = 1400

    pingGoogle() {
        if( window.stop_ping_google) return;
        const {ss_base_host} = window.globalObject;
        axios.get(`http://${ss_base_host}/check-port?Ip=www.google.com&Port=443`).then(({data}) => {
            console.log("check-port", this.timeout, data)
            if (window.connect_status === "disconnected") return

            const {body} = data;
            if (body.check_result) {
                console.log("delay", body.delay)
                this.setState({
                    star_css: "star_on_2",
                    tipTxt:`${body.delay} ms`
                })
                window.connect_status = "connected"
                clearInterval(window.connecting_time_id)
            } else {
                console.log("check_result", body.check_result)
                window.connect_status = "connecting";
                this.connecting()
            }
            if (this.timeout > 20000) this.timeout = 1400
            this.timeout += 1000
            setTimeout(() => {
                if (window.connect_status !== "disconnected") this.pingGoogle()
            }, this.timeout)
        })
    }

    connecting() {
        let i = 0;
        this.setState({
            star_css: "star_on_0",
            checked: true
        });

        let timeout = 1400
        window.connecting_time_id && clearInterval(window.connecting_time_id)
        window.connecting_time_id = setInterval(() => {
            i++;
            const j = ((i) % 3);
            var rep;
            switch (j) {
                case 0:
                    rep = "..";
                    break;
                case 1:
                    rep = "...";
                    break;
                case 2:
                    rep = ".";
                    break;
                default:
                    break;
            }
            console.log(rep)
            this.setState({
                star_css: "star_on_" + j,
                tipTxt: "Connecting" + rep
            })
            if (window.connect_status === "disconnected") {
                this.setState({
                    star_css: "star_off"
                })
            }
        }, timeout)
    }

    onCloseConn() {
        window.connect_status = "disconnected"
        window.connecting_time_id && clearInterval(window.connecting_time_id)
        this.setState({
            star_css: "star_off",
            tipTxt:"Disconnected"
        })
        this.props.delQrCodeButton();
        const {instance} = window.globalObject;
        if (!instance || !instance.qr_code) {
            return
        }
        this.closeConn(instance.qr_code)
    }

    openConn(qr_code) {
        const {ss_base_host} = window.globalObject;
        axios.post(
            `http://${ss_base_host}/shadowsocks?clean=1&ss=` + encodeURIComponent(qr_code),
            null
        ).then(({data}) => {
            const {error, msg} = data;
            if (error === 0) {
                console.log("onOpenConn shadowsocks setting", data.body)
                window.stop_ping_google = false
                this.pingGoogle();
            } else {
                this.showTips(msg)
                console.log("onOpenConn shadowsocks error", msg)
            }
        })
    }

    closeConn(qr_code) {
        const {ss_base_host} = window.globalObject;
        window.stop_ping_google = true
        axios.delete(
            `http://${ss_base_host}/shadowsocks?ss=` + encodeURIComponent(qr_code),
            null
        ).then(({data}) => {
            const {error, msg} = data;
            if (error === 0) {
                console.log("onCloseConn shadowsocks setting", data.body)
            } else {
                this.showTips(msg)
                console.log("onCloseConn shadowsocks error", msg)
            }
        })
    }

    render() {
        const {star_css} = this.state;
        return (
            <div className={"star_wrap"}>
                <div className="starStatusTxtWrap">
                    {
                        this.state.tipTxt &&  <div className="starStatusTxt">{this.state.tipTxt}</div>
                    }

                </div>
                <div onClick={() => {
                    const {connect_status} = window;
                    if (connect_status === 'disconnected') {
                        this.onOpenConn()
                    } else {
                        this.onCloseConn()
                    }

                }} className={"star " + star_css}/>
                <Toast icon="loading" show={this.state.showToast}>Loading</Toast>
                <Toptips type={this.state.tips.type} show={this.state.tips.visible}>{this.state.tips.msg} </Toptips>
            </div>
        )
    }
}

export default Star;
