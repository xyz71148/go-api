import React, {Component} from 'react';
import axios from 'axios'
import "./Login.css"
import {
    Button,
    PopupHeader,
    CellHeader,
    CellBody,
    CellFooter,
    Form,
    FormCell,
    Input,
    Label,
    Toptips,
    Toast
} from 'react-weui';

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
class Login extends Component {
    state = {
        email: '',
        code:"",
        showCaptchaInput:false,
        showToast: false,
        tips:{
            visible:false,
            msg:"",
            type:"warn"
        },
        sendTxt:"Send",
        sendBtnDisabled:false
    };
    showTips(msg,type ="warn"){
        const {tips} = this.state;
        tips.msg = msg;
        tips.type = type;
        tips.visible = true;
        this.setState({tips})
        setTimeout(()=>{
            tips.visible = false;
            this.setState({tips})
        },1400)
    }
    onSendCapthca(){
        if (!validateEmail(this.state.email)) {
            return this.showTips("invalid email")
        }
        this.setState({
            showToast:true
        },()=>{
            axios.post("/auth/email/captcha", {
                email: this.state.email
            }).then(({data}) => {
                const {code, msg} = data
                if (code === 200) {
                    this.setState({
                        sendBtnDisabled:true,
                        showCaptchaInput:true,
                        sendTxt:"60"
                    })
                    setInterval(()=>{
                        let {sendTxt} = this.state;
                        sendTxt = parseInt(sendTxt) -1;
                        if(sendTxt <= 0){
                            this.setState({
                                sendTxt:"Send",
                                sendBtnDisabled:false
                            })
                        }else{
                            this.setState({
                                sendTxt
                            })
                        }

                    },1000)
                } else {
                    this.showTips(msg)
                }

                this.setState({showToast:false})
            })
        })
    }
    onChangeInput(key,{target}){
        const state = {};
        state[key] = target.value;
        this.setState({...state})
    }
    onLogin(){
        if(this.state.code.length === 0){
            return this.showTips("请先发送验证码")
        }

        this.setState({showToast: true})
        axios.post("/auth/email/captcha/verify", {
            email: this.state.email,
            code: this.state.code,
        }).then(({data}) => {
            const {code, body, msg} = data
            if (code === 200) {
                console.log(body)
                const {access_token} = body
                this.setState({showToast: false},()=>{
                    this.props.loginOk(access_token)
                    window.location.reload()
                })
            } else {
                this.showTips(msg)

                this.setState({showToast: false})
            }
        })
    }
    componentDidMount() {

    }

    render() {
        return(
            <div className={"Login"} style={{height: '100vh', overflow: 'scroll'}}>
                <PopupHeader left={"Close"} leftOnClick={this.props.toggle.bind(this,"showLogin")}/>
                <Form>
                    <FormCell vcode>
                        <CellHeader >
                            <Label style={{with:20}}>Email:</Label>
                        </CellHeader>
                        <CellBody>
                            <Input onChange={this.onChangeInput.bind(this,"email")} value={this.state.email} type="tel" placeholder="Enter your Email #"/>
                        </CellBody>
                        <CellFooter>
                            {
                                this.state.sendBtnDisabled ?
                                    <Button type={"default"} disabled>{this.state.sendTxt}</Button>:
                                    <Button onClick={this.onSendCapthca.bind(this)} type="vcode">{this.state.sendTxt}</Button>
                            }
                        </CellFooter>
                    </FormCell>
                    {
                        this.state.showCaptchaInput &&
                        <FormCell>
                            <CellHeader >
                                <Label style={{with:20}}>Code:</Label>
                            </CellHeader>
                            <CellBody>
                                <Input onChange={this.onChangeInput.bind(this,"code")} value={this.state.code} type="email"/>
                            </CellBody>
                        </FormCell>
                    }
                </Form>
                <div style={{padding:8,marginTop:16}}>
                    <Button onClick={this.onLogin.bind(this)}>Login</Button>
                </div>
                <Toast icon="loading" show={this.state.showToast}>Loading</Toast>
                <Toptips type={this.state.tips.type} show={this.state.tips.visible}>{this.state.tips.msg} </Toptips>
            </div>
        )
    }
}

export default Login;
