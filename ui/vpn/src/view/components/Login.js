import React, {Component} from 'react';
import axios from 'axios'
import "./Login.css"
import {connect} from "react-redux";
import {set_access_token} from "../../lib/utils"

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

class Login extends Component {
    state = {
        email: 'xyz71148@gmail.com',
        code:"",
        sendTxt:"获取验证码",
        sendBtnDisabled:false,
        agree:false,
        pass:false
    };
    onSendCapthca(){
        if (!validateEmail(this.state.email)) {
            return window.weui.topTips('请输入正确的Email地址');
        }
        const loading = window.weui.loading("获取中...")
        axios.post("/auth/email/captcha", {
            email: this.state.email
        }).then(({data}) => {
            const {code, msg} = data;
            loading.hide()
            window.weui.topTips(msg)
            if (code === 200) {
                this.setState({
                    sendBtnDisabled:true,
                    sendTxt:"60"
                })
                window.___t_id = setInterval(()=>{
                    let {sendTxt} = this.state;
                    sendTxt = parseInt(sendTxt) - 1;
                    if(sendTxt <= 0){
                        this.setState({
                            sendTxt:"获取验证码",
                            sendBtnDisabled:false
                        })
                        clearInterval(window.___t_id)
                    }else{
                        this.setState({
                            sendTxt
                        })
                    }

                },1000)
            }
        }).catch(()=>loading.hide())

    }
    onChangeInput(key,{target}){
        const state = {};
        state[key] = target.value;
        this.setState({...state},()=>{
            this.onCheckInput()
        })
    }
    onLogin(){
        this.onCheckInput();
        const loading = window.weui.loading("登录中...");
        axios.post("/auth/email/captcha/verify", {
            email: this.state.email,
            code: this.state.code,
        }).then(({data}) => {
            const {code, body, msg} = data;
            loading.hide();
            if (code === 200) {
                window.weui.toast(msg);
                const {access_token} = body;
                set_access_token(access_token);
                this.props.dispatch({
                    type:"app/logged",
                    payload:{
                        access_token
                    }
                })
            }else{

                window.weui.topTips(msg)
            }
        }).catch(()=>loading.hide())
    }
    onCheckInput(){
        const {email,code,agree} = this.state;
        if(agree && validateEmail(email) && code.length ===4 ){
            this.setState({pass:true})
        }else{
            this.setState({pass:false})
        }
    }
    onChangeAgree({target}) {
        this.setState({agree: target.checked},()=>{
            this.onCheckInput()
        })
    }

    render() {
        return(
            <div className={"Login"}>
                <div className="weui-form">
                    <div className="weui-form__text-area">
                        <h2 className="weui-form__title">验证码</h2>
                        <div className="weui-form__desc" />
                    </div>
                    <div className="weui-form__control-area">
                        <div className="weui-cells__group weui-cells__group_form">
                            <div className="weui-cells weui-cells_form">
                                <div className="weui-cell weui-cell_active">
                                    <div className="weui-cell__hd"><label className="weui-label">Email</label></div>
                                    <div className="weui-cell__bd">
                                        <input className="weui-input" type="text"
                                               onChange={this.onChangeInput.bind(this,"email")}
                                               placeholder="请输入Email" value={this.state.email} />
                                    </div>
                                    <div className="weui-cell__ft">
                                        <a className="weui-btn_reset weui-btn_icon">
                                            <i id="showIOSDialog1" className="weui-icon-info-circle" />
                                        </a>
                                    </div>
                                </div>
                                <div className="weui-cell weui-cell_active weui-cell_vcode">
                                    <div className="weui-cell__hd"><label className="weui-label">验证码</label></div>
                                    <div className="weui-cell__bd">
                                        <input onChange={this.onChangeInput.bind(this,"code")} autoFocus="" value={this.state.code} className="weui-input" type="number" pattern="[0-9]*"
                                               placeholder="输入验证码" maxLength="6" />
                                    </div>
                                    <div className="weui-cell__ft">
                                        <button disabled={this.state.sendBtnDisabled} onClick={this.onSendCapthca.bind(this)} className="weui-btn weui-btn_default weui-vcode-btn">{this.state.sendTxt}</button>
                                    </div>
                                </div>
                            </div>
                            {/*<div className="weui-cells__tips"><a className="weui-link" href="javascript:">收不到验证码</a>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div className="weui-form__tips-area">
                        <label id="weuiAgree" htmlFor="weuiAgreeCheckbox" className="weui-agree">
                            <input id="weuiAgreeCheckbox" type="checkbox" onChange={this.onChangeAgree.bind(this)} className="weui-agree__checkbox" />
                                <span className="weui-agree__text">
                                    阅读并同意
                                    <a href="#">《相关条款》</a>
                                </span>
                        </label>
                    </div>
                    <div className="weui-form__opr-area">
                        <button disabled={!this.state.pass} onClick={this.onLogin.bind(this)} className={this.state.pass ? "weui-btn weui-btn_primary" : "weui-btn weui-btn_primary weui-btn_disabled"}  >确定</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps)(Login);