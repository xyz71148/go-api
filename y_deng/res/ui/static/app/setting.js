window.globalObject = {
    constant: {},
    base_api_url: "https://vpn.japp.cc/api"
};

if(!window.localStorage.getItem("base_api_url")){
    window.localStorage.setItem("base_api_url",window.globalObject.base_api_url)
}else{
    window.globalObject.base_api_url = window.localStorage.getItem("base_api_url")
}
