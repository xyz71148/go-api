import React, {Component} from 'react';
import "./Logs.css"
import {Cell, CellBody, CellFooter, CellHeader,} from 'react-weui';
import {connect} from "react-redux";
import {clear_time_id, createInstance, fetchInstances, removeInstance} from "../../store/instanceActions"
import {base64encode} from "nodejs-base64";

class VipLines extends Component {

    componentDidMount() {
        this.props.dispatch(fetchInstances())
    }

    componentWillUnmount() {
        clear_time_id()
    }

    onSelectCell({id, zone, qr_code, ip, port}) {
        const menus = [
            {
                label: '重启(更换IP)',
                onClick: () => {
                    this.props.dispatch(removeInstance(id, () => {
                        document.querySelector('.weui-toast__content').innerText = "创建中...";
                        this.props.dispatch(createInstance(zone, () => {
                            this.props.dispatch({type: "app/hideActionSheet"})
                            document.querySelector('.weui-toast__content').innerText = "加载中...";
                            this.props.dispatch(fetchInstances())
                        }))
                    }))
                }
            }
        ]
        if (qr_code) {
            menus.push({
                label: '二维码',
                onClick: () => {
                    this.props.dispatch({
                        type: "app/hideActionSheet",
                    })
                    const qr_code_encode = "ss://" + base64encode(qr_code.replace("ss://", ""))
                    window.weui.alert("<div style='flex-direction:column;margin-bottom:16px;display: flex;justify-content: center;align-items: center'>" +
                        `<h3 style='margin-bottom: 12px'>${ip} : ${port}</h3>` +
                        "<img style='height: 150px;width: 150px' src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(qr_code_encode) + "' />" +
                        "</div>")
                }
            })
        }


        this.props.dispatch({
            type: "app/showActionSheet",
            payload: {
                onClose: () => {
                    this.props.dispatch({
                        type: "app/hideActionSheet",
                    })
                },
                show: true,
                menus,
                actions: [
                    {
                        label: '删除',
                        onClick: () => {
                            this.props.dispatch(removeInstance(id, () => {
                                this.props.dispatch({type: "app/hideActionSheet"})
                                document.querySelector('.weui-toast__content').innerText = "加载中...";
                                this.props.dispatch(fetchInstances())
                            }))

                        }
                    }
                ]
            }
        })
    }

    render() {
        const {items, timestamp} = this.props;
        return (
            <div className={"VipLines"} style={{height: '90vh', backgroundColor: "white", overflow: 'scroll'}}>

                <div style={{marginTop: 0}}>
                    {items.map((item, i) => {
                        const {delays} = window.globalObject;
                        const {ip, port, id, zone} = item;
                        const delay = delays[id] ? delays[id].toFixed(1) : null;
                        const zone_t = zone.split("-");
                        const {zone_names} = window.globalObject.constant;
                        console.log(timestamp, delay);
                        const zone_name = zone_names[zone_t[0] + "-" + zone_t[1]] + "-" + zone_t[2];
                        return (
                            <Cell key={id} onClick={this.onSelectCell.bind(this, item)} access>
                                <CellHeader>
                                    <span>{zone_name}</span>
                                    {
                                        ip && (
                                            delay ?
                                                <span className="weui-badge weui-badge-green" style={{
                                                    display: "inline-block",
                                                    marginLeft: 12
                                                }}>{delay} ms</span> :
                                                <span className="weui-badge"
                                                      style={{display: "inline-block", marginLeft: 12}}>
                                                    超时
                                                </span>
                                        )
                                    }
                                </CellHeader>
                                <CellBody>

                                </CellBody>
                                <CellFooter> {ip} : {port}</CellFooter>
                            </Cell>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default connect(({instance}) => ({
    selectedVipType: instance.selectedVipType,
    items: instance.items,
    timestamp: instance.timestamp,
    showVipLinesActionSheet: instance.showVipLinesActionSheet,
}))(VipLines);