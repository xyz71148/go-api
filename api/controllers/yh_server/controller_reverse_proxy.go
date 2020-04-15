package yh_server

import (
	"github.com/xyz71148/go-api/api/utils"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func (server *Server) ReverseProxy(res http.ResponseWriter, req *http.Request) {
	TargetUrl := utils.GetEnv("ReversProxyTargetUrl","http://127.0.0.1:8080/")
	urlObj, _ := url.Parse(TargetUrl)
	proxy := httputil.NewSingleHostReverseProxy(urlObj)
	req.URL.Host = urlObj.Host
	req.URL.Scheme = urlObj.Scheme
	req.Header.Set("X-Forwarded-Host", req.Host)
	req.Host = urlObj.Host
	proxy.ServeHTTP(res, req)
}
