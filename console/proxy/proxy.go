package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"time"
)

func serveReverseProxy(res http.ResponseWriter, req *http.Request) {
	urlObj, _ := url.Parse(target_url)
	proxy := httputil.NewSingleHostReverseProxy(urlObj)

	log.Printf("%s %s",req.Method,req.URL.Path)
	req.URL.Host = urlObj.Host
	req.URL.Scheme = urlObj.Scheme
	req.Header.Set("X-Forwarded-Host", req.Host)
	req.Host = urlObj.Host
	proxy.ServeHTTP(res, req)
}

func proxy()  {
	log.Printf("http://%s => %s",src,target_url)
	http.HandleFunc("/", serveReverseProxy)
	if err := http.ListenAndServe(src, nil); err != nil {
		panic(err)
	}
}

func serveHandler(res http.ResponseWriter, req *http.Request) {
	res.WriteHeader(200)
	msec := time.Now().UnixNano() / 1000000
	err := json.NewEncoder(res).Encode(msec)
	if err != nil {
		fmt.Fprintf(res, "%s", err.Error())
	}
}
var src string
var target_url string;
var ping_server string;


type Server struct {
	Router *mux.Router
}
func server()  {
	log.Printf("server => http://%s/ping",ping_server)
	var server = Server{}
	server.Router = mux.NewRouter()
	server.Router.HandleFunc("/ping", serveHandler).Methods("GET")
	if err := http.ListenAndServe(ping_server, handlers.CORS(
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "DELETE", "OPTIONS"}),
		handlers.AllowedOrigins([]string{"*"}),
	)(server.Router)); err != nil {
		panic(err)
	}
}
func main() {
	argsWithoutProg := os.Args[1:]
	ping_server = argsWithoutProg[0]
	src = argsWithoutProg[1]
	target_url = argsWithoutProg[2]
	go proxy()
	server()
}
