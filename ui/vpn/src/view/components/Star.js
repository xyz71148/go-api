import React, {Component} from 'react';
import {Cell, CellBody, CellFooter, CellHeader, Cells} from "react-weui";
import {connect} from "react-redux";
import VipLines from './VipLines'
import Login from './Login'
import {go_login, is_logged} from "../../lib/utils";
import { TiPlus } from "react-icons/ti";
import {createInstance, fetchInstances} from "../../store/instanceActions";

class Star extends Component {
    state = {};
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
    onSelectCell(selectedVipType) {
        if(selectedVipType === 'vip' && !is_logged()){
            return window.weui.alert("请先登陆",()=>{
                go_login(this,{
                    children: (<Login/>)
                })
            })
        }
        this.props.dispatch({
            type:"instance/setState",
            payload:{
                selectedVipType
            }
        });
        this.props.dispatch({
            type: "app/setState",
            payload: {
                halfScreenDialogState: {
                    show: true,
                    height:"80vh",
                    children:(
                        <VipLines />
                    ),
                    right:(
                        selectedVipType === 'vip' ?
                        <TiPlus onClick={this.onCreateLine.bind(this)} />:null
                    ),
                    onClose:()=>{
                        this.props.dispatch({
                            type: "app/setState",
                            payload: {
                                halfScreenDialogState: {
                                    show: false,
                                }
                            }
                        })
                    }
                }
            }
        })
    }

    render() {
        return (
            <div className={""}>
                <div className="star_wrap">
                    <div onClick={() => {
                        this.onSelectCell("vip")
                    }} className={"star star_on_2"}>
                    </div>
                </div>

                <div>
                    <Cells>
                        {[
                            {name: "我的线路", key: "vip"}
                        ].map(({name, key}, i) => {
                            return (
                                <Cell key={key} onClick={this.onSelectCell.bind(this, key)} access>
                                    <CellHeader>
                                        {name}
                                    </CellHeader>
                                    <CellBody>

                                    </CellBody>
                                    <CellFooter>

                                    </CellFooter>
                                </Cell>
                            )
                        })}
                    </Cells>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    instances: state.instance.items,
    loading: state.instance.loading,
    error: state.instance.error,

    halfScreenDialogState: state.app.halfScreenDialogState
});

export default connect(mapStateToProps)(Star);