package revers_proxy

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
)
var targetUrl string

func serveReverseProxy(res http.ResponseWriter, req *http.Request) {
	urlObj, _ := url.Parse(targetUrl)
	proxy := httputil.NewSingleHostReverseProxy(urlObj)
	req.URL.Host = urlObj.Host
	req.URL.Scheme = urlObj.Scheme
	req.Header.Set("X-Forwarded-Host", req.Host)
	req.Host = urlObj.Host
	proxy.ServeHTTP(res, req)
}



func Run(host string,port string,targetUrl string) {
	targetUrl = targetUrl
	addr := fmt.Sprintf("%s:%s",host,port)
	fmt.Println("run reverse proxy at : %s",addr)
	http.HandleFunc("/api", serveReverseProxy)
	if err := http.ListenAndServe(addr, nil); err != nil {
		panic(err)
	}
}
