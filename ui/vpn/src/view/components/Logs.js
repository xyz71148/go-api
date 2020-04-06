import React, {Component} from 'react';
import "./Logs.css"
import {
    PopupHeader,
} from 'react-weui';


class Logs extends Component {
    state = {
        logs:[]
    };
    componentDidMount() {
        // const {ss_base_host} = window.globalObject;
        // window.web_sock = new WebSocket(`ws://${ss_base_host}/ws`);
        //
        // var update = () => {
        //     window.web_sock.onmessage = (event) =>{
        //         //console.log(event.data)
        //         this.setState({
        //             logs:[event.data,...this.state.logs]
        //         })
        //     }
        // };
        // window.setTimeout(update);
    }

    componentWillUnmount() {
        // window.web_sock && window.web_sock.close();
        // window.web_sock = undefined
    }

    render() {
        return(
            <div className={"Logs"} style={{height: '90vh', overflow: 'scroll'}}>
                <PopupHeader right={"Close"} rightOnClick={this.props.toggle.bind(this,"showLogs")}/>
                <ul>
                    {
                        this.state.logs.map((log,i)=>{
                            return(
                                <li key={i}>{log}</li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default Logs;
