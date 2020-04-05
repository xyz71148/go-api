import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from "axios";
import 'weui';
import 'react-weui/build/packages/react-weui.css';


axios.interceptors.request.use(request => {
    const {url} = request;
    //window.base_api_url = "http://localhost:8080/api";
    const {base_api_url} = window.globalObject;
    if ( url && url.indexOf("http") === -1) {
        request["url"] = `${base_api_url}${url}`
    }
    return request
}, error => {
    console.error("request",error);
    return Promise.reject(error);
})

axios.interceptors.response.use((response) => {
    //console.log(response)
    return response;
}, error => {
    console.error("response",error.message);
    if(error.message.indexOf("401") > 0){
        localStorage.removeItem("access_token")
        window.location.reload()
    }else{
        return Promise.reject(error);
    }
});
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
