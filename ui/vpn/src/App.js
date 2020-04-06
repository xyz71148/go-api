import React, {Component} from 'react';
import './App.css';
import axios from 'axios'
import Home from './view/Home'
import {Toast,ActionSheet} from './lib/react-weui/index'
import {connect} from "react-redux";

class App extends Component {
    state = {
        logging:false,
    }

    componentDidMount() {
        const access_token = localStorage.getItem("access_token");
        if (access_token) {
            axios.defaults.headers.common.Authorization = access_token;
        }
        // axios.get("/constant").then(({data})=>{
        //     window.globalObject.constant = data
        //     this.setState({
        //         logging:false
        //     })
        // })

    }

    render() {
        const {toastState,actionSheetState} = this.props
        return (
            <div className="App">
                <Home />
                <Toast {...toastState} />
                <ActionSheet
                    {...actionSheetState}
                    onRequestClose={e => {
                        this.props.dispatch({
                            type:"app/setState",
                            payload:{
                                actionSheetState:{
                                    show:false
                                }
                            }
                        })
                    }}
                />
            </div>
        );
    }
}

export default connect(({app}) => ({
    toastState: app.toastState,
    actionSheetState:app.actionSheetState
}))(App);
