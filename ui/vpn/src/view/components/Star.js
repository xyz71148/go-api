import React, {Component} from 'react';
import {Cell, CellBody, CellFooter, CellHeader, Cells} from "react-weui";
import {connect} from "react-redux";
import VipLines from './VipLines'
import Login from './Login'
import {go_login, is_logged} from "../../lib/utils";

class Star extends Component {
    state = {};
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
                    height:"95vh",
                    children:(
                        <VipLines />
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
        const {halfScreenDialogState} = this.props
        return (
            <div className={""}>
                <div className="star_wrap">
                    <div onClick={() => {}} className={"star star_off"}>
                    </div>
                </div>

                <div>
                    <Cells>
                        {[
                            {name: "Vip独享线路", key: "vip"},
                            {name: "免费线路", key: "free"}
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