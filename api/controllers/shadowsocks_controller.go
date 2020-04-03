package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/xyz71148/go-api/api/responses"
	"github.com/xyz71148/go-api/api/service/shadowsocks"
	"github.com/xyz71148/go-api/assets"
	"log"
	"net/http"
	"net/url"
	"runtime"
	"strings"
	"time"
)

func (server *Server) getPac(w http.ResponseWriter, r *http.Request) {
	// swagger:route GET /pac ShadowSocks
	// getPac
	//
	// getPac
	//
	// Responses:
	//	default: BaseResponse
	// 	200: BaseResponse
	//	500: GenericError
	bt := assets.GetRes("assets/res/pac.tpl")
	var proxy string
	if runtime.GOOS == "windows" {
		proxy = fmt.Sprintf("PROXY %s; DIRECT;", shadowsocks.GetHttpProxy())
	} else {
		proxy = fmt.Sprintf("SOCKS5 %s; SOCKS %s; DIRECT;", shadowsocks.GetSocksProxy(), shadowsocks.GetSocksProxy())
	}
	config, _ := shadowsocks.LoadConfig()
	dds := config.Get("diy_domains")
	dms := []string{}
	if len(dds) > 0 {
		dms = strings.Split(dds, ",")
	}
	dmsJson, _ := json.Marshal(dms)

	s := strings.Replace(string(bt), "__PROXY__", proxy, -1)
	s = strings.Replace(s, "__DOMAINS__", string(dmsJson), -1)
	isGs := "false"

	global := config.Get("is_global") == "on"
	if global {
		isGs = "true"
	}
	s = strings.Replace(s, "__IS_GLOBAL__", isGs, -1)
	fmt.Fprintf(w, s)
}


func (server *Server)  checkPort(w http.ResponseWriter, r *http.Request) {
	// swagger:route GET /check-port ShadowsocksCheckPort ShadowsocksCheckPortRequestParams
	// checkPort
	//
	// checkPort
	//
	// Responses:
	//	default: BaseResponse
	// 	200: BaseResponse
	//	500: GenericError
	ip := r.URL.Query().Get("Ip")
	port := r.URL.Query().Get("Port")

	proxyString := "http://127.0.0.1:2272"
	proxyURL, _ := url.Parse(proxyString)

	transport := &http.Transport{Proxy: http.ProxyURL(proxyURL)}
	client := &http.Client{Transport: transport,Timeout: 3 * time.Second}
	start_time := time.Now().UnixNano()
	request, _ := http.NewRequest("GET", fmt.Sprintf("https://%s:%s",ip,port), nil)
	var CheckResult = false
	response, err := client.Do(request)
	Delay := (time.Now().UnixNano() - start_time)  / 1e6
	if err == nil{
		CheckResult = response.StatusCode == 200
	}else{
		CheckResult = false
	}

	bt, _ := json.Marshal(&shadowsocks.CheckResultStuct{
		Delay:Delay,
		CheckResult:CheckResult,
	})
	//go shadowsocks.LogMsg(string(bt))

	data := (*json.RawMessage)(&bt)

	responses.JSON(
		w, http.StatusOK,
		&shadowsocks.JsonResponse{Error: 0, Body: data, Msg: ""})

}

func (server *Server) setSetting(w http.ResponseWriter, r *http.Request) {
	name := r.FormValue("name")
	value := r.FormValue("value")
	if err := shadowsocks.EffectSetting(name, value); err != nil {
		responses.JSON(
			w, http.StatusOK,
			&shadowsocks.JsonResponse{Error: 1, Body: nil, Msg: "设置文件有问题"})
		return
	}
	settings(w, r)
}

func settings(w http.ResponseWriter, r *http.Request) {
	config, _ := shadowsocks.LoadConfig()
	bt, _ := json.Marshal(config.Config)
	data := (*json.RawMessage)(&bt)
	responses.JSON(
		w, http.StatusOK,
		&shadowsocks.JsonResponse{Error: 1, Body: data, Msg: "设置文件有问题"})
}


func (server *Server) shadowsocks(w http.ResponseWriter, r *http.Request) {
	// swagger:route GET /shadowsocks ShadowSocks1
	// shadowsocks
	//
	// shadowsocks
	//
	// Responses:
	//	default: BaseResponse
	// 	200: BaseResponse
	//	500: GenericError
	config, err := shadowsocks.LoadConfig()
	if err != nil {
	}
	switch r.Method {
	case "POST":
		ss := r.URL.Query().Get("ss")
		clean := r.URL.Query().Get("clean")
		log.Printf("Post ss with value: %s", ss)
		if clean == "1"{
			config.CleanTunnel()
		}
		go shadowsocks.LogMsg(ss)
		err = config.AddTunnel(ss)
	case "DELETE":
		ss := r.URL.Query().Get("ss")
		log.Printf("Delete ss: %s", ss)
		err = config.DeleteTunnel(ss)
	case "PUT":
		ss := r.FormValue("ss")
		old := r.URL.Query().Get("ss")
		err = config.UpdateTunnel(old, ss)
	}
	log.Printf("ss tunnels count is %d now", len(config.GetSSTunnels()))
	shadowsocks.SetTunnels(config.GetSSTunnels())
	if len(config.GetSSTunnels()) == 0 {
		shadowsocks.UnsetPac()
	}
	if r.Method == "POST" && len(config.GetSSTunnels()) == 1 {
		shadowsocks.SetPac()
	}
	bt, _ := json.Marshal(config.SSTunnels)
	data := (*json.RawMessage)(&bt)
	if err == nil {
		responses.JSON(
			w, http.StatusOK,
			&shadowsocks.JsonResponse{Error: 0, Body: data, Msg: ""})
	} else {
		responses.JSON(
			w, http.StatusOK,
			&shadowsocks.JsonResponse{Error: 1, Body: data, Msg: err.Error()})
	}
}

func (server *Server) wsHandler(w http.ResponseWriter, r *http.Request) {
	shadowsocks.WsHandler(w,r)
}
