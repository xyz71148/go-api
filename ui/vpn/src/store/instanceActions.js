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
        clear_time_id()
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
    console.log("getInstance", instance_id)
    return dispatch => {
        const loading = window.weui.loading("加载中...")
        return axios.get(`/compute/instance/${instance_id}`, {
            timeout: 25000
        })
            .then(({data}) => {

                dispatch({
                    type: namespace + "/setState",
                    payload: {
                        item: data.body
                    }
                })

                console.log("res", instance_id, data.body.ip, data.body.port_status)
                if (data.body.ip) {
                    loading.hide()
                    dispatch(fetchInstances())
                } else {
                    setTimeout(() => {
                        dispatch(getInstance(instance_id))
                    }, 1400)
                }
            })
            .catch(error => {
                setTimeout(() => {
                    dispatch(getInstance(instance_id))
                }, 1400)
            });
    };
}

export function clear_time_id() {
    window.__time_id_fetch_instance && clearInterval(window.__time_id_fetch_instance)
}
window.globalObject.delays = {}
export function fetchInstancePortStatus(dispatch,instances) {
    instances.map(({ip,id}) => {
        if (ip) {
            const start_time = +(new Date())
            axios.get(`http://${ip}`, {timeout: 1000}).then(({data}) => {
                const delay1 =  data[0] * 1000 - start_time
                window.globalObject.delays[id] = delay1
                dispatch({
                    type:"instance/setState",
                    payload:{
                        timestamp:new Date()
                    }
                })
            }).catch((error) => {
                dispatch({
                    type:"instance/setState",
                    payload:{
                        timestamp:new Date()
                    }
                })
                console.log(error)
                window.globalObject.delays[id] = 0
            })
        }
        return id
    })
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
                clear_time_id()
                fetchInstancePortStatus(dispatch,data.body)
                window.__time_id_fetch_instance = setInterval(() => {
                    fetchInstancePortStatus(dispatch,data.body);
                }, 3000)
                loading.hide()
            })
            .catch(error => {
                loading.hide()
            });
    };
}
