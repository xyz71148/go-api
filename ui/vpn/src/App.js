import React, {Component} from 'react';
import axios from 'axios'
import {connect} from "react-redux";
import {ActionSheet, HalfScreenDialog, Toast} from './lib/react-weui/index'
import {getZoneTree,get_access_token} from "./lib/utils"
import './App.css';
import Home from './view/Home'

class App extends Component {
    state = {
        loading:true
    }
    componentDidMount() {
        const access_token = get_access_token();
        if(access_token){
            this.props.dispatch({
                type:"app/logged",
                payload:{
                    access_token
                }
            })
        }
        const loading = window.weui.loading("加载中...")
        axios.get("/constant").then(({data})=>{
            loading.hide()
            const {default_zone,zones,zone_names} = data;
            window.globalObject.constant = {
                zones:getZoneTree(zones,zone_names),
                default_zone,
                zone_names
            }
            this.setState({
                loading:false
            })

        }).catch(()=>{
            loading.hide()
            window.weui.toast("获取配置失败")
        })
    }

    render() {
        const {toastState, loading,actionSheetState, halfScreenDialogState} = this.props;
        if(this.state.loading) return null;
        return (
            <div className="App">
                <Home/>
                <ActionSheet
                    {...actionSheetState}
                    onClose={e => {
                        this.props.dispatch({
                            type: "app/setState",
                            payload: {
                                actionSheetState: {
                                    show: false
                                }
                            }
                        })
                    }}
                />
                <HalfScreenDialog  {...halfScreenDialogState} />
            </div>
        );
    }
}

export default connect(({app}) => ({
    toastState: app.toastState,
    actionSheetState: app.actionSheetState,
    halfScreenDialogState: app.halfScreenDialogState,
    loading: app.loading
}))(App);
