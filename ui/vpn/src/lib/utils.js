import axios from "axios";

export function get_access_token() {
    const access_token = localStorage.getItem("access_token");
    axios.defaults.headers.common.Authorization = access_token ? access_token : undefined;
    return access_token
}
export function is_logged() {
    return !!get_access_token()
}
export function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
export function set_access_token(access_token) {
    localStorage.setItem("access_token",access_token);
    axios.defaults.headers.common.Authorization = access_token;
}
export function del_access_token() {
    localStorage.removeItem("access_token");
    axios.defaults.headers.common.Authorization = null;
}
export function go_login(obj,payload) {
    obj.props.dispatch({
        type:"app/showHalfScreenDialog",
        payload:{
            title:"",
            height:"95vh",
            onClose:()=>{
                obj.props.dispatch({
                    type:"app/hideHalfScreenDialog"
                })
            },
            ...payload
        }
    })
}

export function getZoneTree(zones, names) {
    const res = []
    const state = {}
    for (let i in zones) {
        const zone = zones[i]
        const t = zone.split("-");

        const n = `${t[0]}-${t[1]}`
        if (!state[t[0]]) {
            state[t[0]] = {}
        }
        if (!state[t[0]][t[1]] && names[n]) {
            state[t[0]][t[1]] = []
        }
        if (names[n]) {
            state[t[0]][t[1]].push(t[2])
        }

    }

    for (let i in Object.keys(state)) {
        const key = Object.keys(state)[i]
        const row = {}
        const children = []
        for (let j in Object.keys(state[key])) {
            const key1 = Object.keys(state[key])[j]
            const row1 = {}
            row1.value = key1;
            const n = `${key}-${key1}`
            if (!names[n]) continue
            row1.label = names[n]
            row1.children = state[key][key1].map(k => {
                return {
                    value: k,
                    label: k
                }
            })
            children.push(row1)
        }
        if (children.length > 0) {
            row.value = key;
            row.label = names[key]
            row.children = children
            res.push(row)
        }

    }
    return res;
}
