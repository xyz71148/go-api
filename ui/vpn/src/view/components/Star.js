import React, {Component} from 'react';
import {Cell, CellBody, CellFooter, CellHeader, Cells} from "react-weui";
import {connect} from "react-redux";
import {HalfScreenDialog} from '../../lib/react-weui/index'

window.connect_status = "disconnected";

class Star extends Component {
    state = {};


    onSelectCell(selectedVipType) {
        this.props.dispatch({
            type: "app/setState",
            payload: {
                halfScreenDialogState: {
                    show: true,
                    onRequestClose:()=>{
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
                    <div onClick={() => {

                    }} className={"star star_off"}>
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
                <HalfScreenDialog {...halfScreenDialogState}>
                    <div style={{height:"100vh"}}>ww</div>
                </HalfScreenDialog>
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