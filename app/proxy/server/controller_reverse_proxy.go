package server

import (
	"net/http"
	"net/http/httputil"
	"net/url"
)

func (server *Server) ReverseProxy(res http.ResponseWriter, req *http.Request) {
	urlObj, _ := url.Parse(proxyAddr)
	proxy := httputil.NewSingleHostReverseProxy(urlObj)
	req.URL.Host = urlObj.Host
	req.URL.Scheme = urlObj.Scheme
	req.Header.Set("X-Forwarded-Host", req.Host)
	req.Host = urlObj.Host
	proxy.ServeHTTP(res, req)
}
