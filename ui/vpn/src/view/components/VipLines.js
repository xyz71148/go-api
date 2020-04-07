import React, {Component} from 'react';
import "./Logs.css"
import {Picker, Button, Cell, CellBody, CellFooter, CellHeader,} from 'react-weui';
import {connect} from "react-redux";
import {createInstance,fetchInstances,removeInstance} from "../../store/instanceActions"

class VipLines extends Component {

    componentDidMount() {
        this.props.dispatch(fetchInstances())
    }

    onSelectCell(instance_id,zone,qr_code) {
        const menus = [
            {
                label: '重启(更换IP)',
                onClick: () => {
                    this.props.dispatch(removeInstance(instance_id,()=>{
                        document.querySelector('.weui-toast__content').innerText = "创建中...";
                        this.props.dispatch(createInstance(zone,()=>{
                            this.props.dispatch({type: "app/hideActionSheet"})
                            document.querySelector('.weui-toast__content').innerText = "加载中...";
                            this.props.dispatch(fetchInstances())
                        }))
                    }))
                }
            }
        ]
        if(qr_code){
            console.log(qr_code)
        }


        this.props.dispatch({
            type: "app/showActionSheet",
            payload: {
                onClose:()=> {
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
                            this.props.dispatch(removeInstance(instance_id,()=>{
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
    onCreateLine(){
        window.weui.picker(window.globalObject.constant.zones, {
            className: 'weui-custom',
            container: 'body',
            title:"选择区域",
            defaultValue: window.globalObject.constant.default_zone,
            onChange: (result)=> {
                console.log(result)
            },
            onConfirm: (result) =>{
                const zone = `${result['0']['value']}-${result['1']['value']}-${result['2']['value']}`;
                this.props.dispatch(createInstance(zone,()=>{
                    document.querySelector('.weui-toast__content').innerText = "加载中...";
                    this.props.dispatch(fetchInstances())
                }))
            }
        });
    }
    render() {
        const {items,selectedVipType} = this.props;
        console.log(items)
        return (
            <div className={"VipLines"} style={{height: '90vh', backgroundColor: "white", overflow: 'scroll'}}>
                <div style={{marginTop: 16}}>
                    {items.map(({ip,qr_code, port, id, name, zone, status, port_status}, i) => {
                        const zone_t = zone.split("-")
                        const {zone_names} = window.globalObject.constant;

                        const zone_name = zone_names[zone_t[0]+"-"+zone_t[1]] + "-"+zone_t[2];
                        return (
                            <Cell key={id} onClick={this.onSelectCell.bind(this, id,zone,qr_code)} access>
                                <CellHeader>
                                    <span>{zone_name}</span>
                                    {
                                        port_status === "UP" ?
                                            <span className="weui-badge weui-badge-green" style={{display:"inline-block",marginLeft: 12}}>Up</span>:
                                            <span className="weui-badge" style={{display:"inline-block",marginLeft: 12}}>Down</span>
                                    }
                                </CellHeader>
                                <CellBody>

                                </CellBody>
                                <CellFooter> {ip} {port}</CellFooter>
                            </Cell>
                        )
                    })}
                </div>
                {
                    selectedVipType === "vip" &&
                    <div style={{margin: 16}}>
                        <Button onClick={this.onCreateLine.bind(this)}>创建线路</Button>
                    </div>
                }
            </div>
        )
    }
}

export default connect(({instance}) => ({
    selectedVipType: instance.selectedVipType,
    items: instance.items,
    showVipLinesActionSheet: instance.showVipLinesActionSheet,
}))(VipLines);