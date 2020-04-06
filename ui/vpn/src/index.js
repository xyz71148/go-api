import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from "axios";
import './lib/weui/weui.css';
import {applyMiddleware, createStore} from "redux";
import rootReducer from "./store/rootReducer";
import thunk from "redux-thunk";
import {Provider} from "react-redux";

axios.interceptors.request.use(request => {
    const {url} = request;
    const base_api_url = "/api";
    if ( url && url.indexOf("shadowsocks") > 0) {
         request["url"] = `${url}`
    }else{
        request["url"] = `${base_api_url}${url}`
    }
    if(axios.defaults.headers.common.Authorization){
        request.headers.common["Authorization"] = axios.defaults.headers.common.Authorization
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
    if(error.message.indexOf("401") > 0 || (error.response && error.response.status === 401)){
        localStorage.removeItem("access_token");
        window.location.reload()
        return Promise.reject(error);
    }else{
        return Promise.reject(error);
    }
});
const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
