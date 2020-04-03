import React, {Component} from 'react';
import './App.css';
import axios from 'axios'
import Home from './view/Home'
import {Toast} from 'react-weui';

class App extends Component {
    state = {
        logging:true
    }

    componentDidMount() {
        const access_token = localStorage.getItem("access_token");
        if (access_token) {
            axios.defaults.headers.common.Authorization = access_token;
        }
        axios.get("/constant").then(({data})=>{
            window.globalObject.constant = data
            this.setState({
                logging:false
            })
        })

    }

    render() {
        //console.log(this.state.logging,window.globalObject.constant)
        return (
            <div className="App">
                {
                    !this.state.logging && <Home />
                }
                <Toast icon="loading" show={this.state.logging}>Loading</Toast>
            </div>
        );
    }
}

export default App;
