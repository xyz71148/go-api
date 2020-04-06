import React, {Component} from 'react';
import './Home.css';
import {ActionSheet, Dialog, Popup, Toast} from 'react-weui';

import {FaBars} from 'react-icons/fa';
import Login from './components/Login';
import Star from './components/Star';
import Logs from './components/Logs';
import VipLines from './components/VipLines';
import Setting from './components/Setting';
import axios from "axios";
import {base64encode} from "nodejs-base64";
import {connect} from "react-redux";

class Home extends Component {
    state = {
        access_token: null,
        showLogoutConfirm: false,
        showSetting: false,
        showLogs: false,
        showLogin: false,
        showQrCode: false,
        showActionSheet: false,
        bottom_show: false,
        showToast: false,
        star_css: "star_on_0",
        show: false,
        qr_code_encode: "",
        menus_1: [
            {
                label: 'Setting',
                onClick: this.showSetting.bind(this)
            }, {
                label: 'Logs',
                onClick: this.showLogs.bind(this)
            },
        ],
        menus: [],
        actions: []
    };

    componentDidMount() {
        const access_token = localStorage.getItem("access_token");
        this.setState({
            access_token,
            //showLogin: !access_token
        })
        if (access_token) {
            axios.defaults.headers.common.Authorization = access_token;
            this.setState({
                menus: this.state.menus_1,
                actions: [
                    {
                        label: 'Logout',
                        onClick: this.logout.bind(this)
                    }
                ]
            })
        } else {
            this.setState({
                menus: [],
                actions: [
                    {
                        label: 'Login',
                        onClick: () => {
                            this.toggle("showActionSheet")
                            this.toggle("showLogin")
                        }
                    }
                ]
            })
        }
    }

    showQrCode() {
        //const qr_code = "ss://aes-256-cfb:2584d3@35.241.81.143:8108";
        const qr_code = this.state.qr_code;
        const qr_code_encode = "ss://" + base64encode(qr_code.replace("ss://", ""))
        this.setState({qr_code_encode})
        this.toggle("showActionSheet")
        this.toggle("showQrCode")
    }

    showSetting() {
        this.toggle("showActionSheet")
        this.toggle("showSetting")
    }

    showLogs() {
        this.toggle("showActionSheet")
        this.toggle("showLogs")
    }

    logout() {
        localStorage.removeItem("access_token");
        this.setState({
            showActionSheet: false,
            access_token: null,
            showLogin: true,
            showLogoutConfirm: false
        }, () => {
            window.location.reload()
        })
    }

    delQrCodeButton() {
        this.setState({
            menus: this.state.menus_1,
            qr_code: null
        })
    }

    setQrCodeButton(qr_code) {
        this.setState({
            menus: [
                {
                    label: 'QrCode',
                    onClick: this.showQrCode.bind(this)
                },
                ...this.state.menus_1
            ],
            qr_code
        })
    }

    toggle(key) {
        const state = {};
        state[key] = !this.state[key];
        this.setState({
            ...state
        })
    }
    toggleShow(key) {
        const payload = {}
        payload[key] = !this.props[key];
        this.props.dispatch({
            type: "setState",
            payload: payload
        });
    }

    loginOk(access_token) {
        this.setState({
            access_token
        }, () => {
            localStorage.setItem("access_token", access_token)
            this.toggle("showLogin")
        })
    }

    render() {
        const {showVipLines} = this.props;
        return (
            <div className="Home">
                <div className={"setting"} onClick={this.toggle.bind(this, "showActionSheet")}>
                    <FaBars size={"1.5em"} color={"white"}/>
                </div>

                <Dialog type="ios" title={""}
                        buttons={[{
                            label: 'Ok',
                            onClick: this.toggle.bind(this, "showQrCode")
                        }]} show={this.state.showQrCode}>
                    <div style={{height: 154}}>
                        {
                            this.state.showQrCode && <img
                                src={"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + this.state.qr_code_encode}
                                alt=""/>
                        }
                    </div>
                </Dialog>
                <Popup show={this.state.showLogs}
                       onRequestClose={e => this.toggle("showLogs")}>
                    <Logs toggle={this.toggle.bind(this)}/>
                </Popup>

                <Popup show={showVipLines}
                       onRequestClose={e => this.toggleShow("showVipLines")}>
                    <VipLines toggleShow={this.toggleShow.bind(this)}/>
                </Popup>

                <Popup show={this.state.showSetting}
                       onRequestClose={e => this.toggle("showSetting")}>
                    <Setting visible={this.state.showSetting} toggle={this.toggle.bind(this)}/>
                </Popup>
                {/*<Popup show={this.state.showLogin}*/}
                {/*       onRequestClose={e => this.toggle("showLogin")}>*/}
                {/*    <Login loginOk={this.loginOk.bind(this)} toggle={this.toggle.bind(this)}/>*/}
                {/*</Popup>*/}
                <ActionSheet
                    menus={this.state.menus}
                    actions={this.state.actions}
                    show={this.state.showActionSheet}
                    onRequestClose={e => this.setState({showActionSheet: !this.state.showActionSheet})}
                />
                <Toast icon="loading" show={this.state.showToast}>Loading</Toast>
                <Star
                    delQrCodeButton={this.delQrCodeButton.bind(this)}
                    setQrCodeButton={this.setQrCodeButton.bind(this)}
                    toggle={this.toggle.bind(this)}/>
            </div>
        );
    }
}

export default connect(({instance}) => ({
    showVipLines: instance.showVipLines,
    showVipLinesActionSheet:instance.showVipLinesActionSheet,
}))(Home);