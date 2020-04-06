import React, {Component} from 'react';
import "./Logs.css"
import {Cell, CellBody, CellFooter, Button, CellHeader, PopupHeader, ActionSheet,} from 'react-weui';
import {connect} from "react-redux";


class VipLines extends Component {
    componentDidMount() {

    }

    componentWillUnmount() {

    }
    onSelectCell(id){
        //alert(id)
        this.props.toggleShow("showVipLinesActionSheet")
    }
    render() {
        const {selectedVipType} = this.props;
        return (
            <div className={"VipLines"} style={{height: '90vh', backgroundColor:"white", overflow: 'scroll'}}>
                <PopupHeader right={"Close"} rightOnClick={this.props.toggleShow.bind(this, "showVipLines")}/>

                <div style={{marginTop:16}}>
                    {[
                        {
                            ip:"127.0.0..1",
                            port:"9000",
                            id:"12",
                            name:"name",
                            zone:"zone",
                            status:"RUNNING",
                            port_status:"UP"
                        },
                        {
                            ip:"127.0.0..1",
                            port:"9000",
                            id:"11",
                            name:"name",
                            zone:"zone",
                            status:"RUNNING",
                            port_status:"UP"
                        }
                    ].map(({ip,port,id,name,zone,status,port_status}, i) => {
                        return (
                            <Cell key={id} onClick={this.onSelectCell.bind(this,id)} access>
                                <CellHeader>
                                    {ip} {port}
                                </CellHeader>
                                <CellBody/>
                                <CellFooter/>
                            </Cell>
                        )
                    })}
                </div>
                <div style={{margin:16}}>
                    <Button>创建</Button>
                </div>
                <ActionSheet
                    menus={[
                        {
                            label: '重启(更换IP)',
                            onClick: () => {}
                        }
                    ]}
                    actions={[
                        {
                            label: '删除此线路',
                            onClick: () => {}
                        }
                    ]}
                    show={this.props.showVipLinesActionSheet}
                    onRequestClose={()=>{
                        this.props.toggleShow("showVipLinesActionSheet")
                    }}
                />
            </div>
        )
    }
}

export default connect(({instance}) => ({
    selectedVipType: instance.selectedVipType,
    showVipLinesActionSheet:instance.showVipLinesActionSheet,
}))(VipLines);