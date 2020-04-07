import axios from "axios";
import {namespace} from "./instanceReducer"

export function createInstance(zone, callBack) {
    return dispatch => {
        const server_type = "ss";
        const loading = window.weui.loading("创建中...")
        return axios.post(`/compute/instance/${zone}/${server_type}`, null)
            .then(({data}) => {
                dispatch({
                    type: namespace + "/setState",
                    payload: {
                        item: data.body
                    }
                })
                dispatch(getInstance(data.body.id))
                callBack && callBack()
            })
            .catch(error => {
                loading.hide()
                callBack && callBack()
            });
    };
}

export function removeInstance(instance_id, callback) {
    return dispatch => {
        const loading = window.weui.loading("删除中...")
        return axios.delete(`/compute/instance/${instance_id}`, null)
            .then(({data}) => {
                dispatch({
                    type: namespace + "/setState",
                    payload: {
                        item: null
                    }
                })
                callback && callback()
            })
            .catch(error => {
                loading.hide()
                callback && callback()
            });
    };
}


export function getInstance(instance_id) {
    return dispatch => {
        const loading = window.weui.loading("加载中...")
        return axios.get(`/compute/instance/${instance_id}`, {
            timeout:25000
        })
            .then(({data}) => {

                dispatch({
                    type: namespace + "/setState",
                    payload: {
                        item: data.body
                    }
                })
                if(data.body.ip){
                    loading.hide()
                }else{
                    setTimeout(()=>{{
                        dispatch(getInstance(instance_id))
                    }},1400)
                }
            })
            .catch(error => {
                setTimeout(()=>{{
                    dispatch(getInstance(instance_id))
                }},1400)
            });
    };
}

export function fetchInstances() {
    return dispatch => {
        const loading = window.weui.loading("加载中...")
        return axios.get("/compute/instances")
            .then(({data}) => {
                dispatch({
                    type: namespace + "/setState",
                    payload: {
                        items: data.body
                    }
                });
                loading.hide()
            })
            .catch(error => {
                loading.hide()
            });
    };
}
