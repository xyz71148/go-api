package yh_server

import (
	"fmt"
	"github.com/xyz71148/go-api/assets"
	"net/http"
	"strings"
)

func (server *Server) StaticRes(w http.ResponseWriter, r *http.Request) {
	p := r.URL.Path
	if p == "/index" || p == "/" || p == "/index.html" {
		p = "/index.html"
	}
	if p == "/swagger" || p == "/swagger/" || p == "/swagger/index.html" {
		p = "/swagger/index.html"
	}
	f := "assets/res/ui" + p
	fmt.Println(f)
	arr := strings.Split(f, ".")
	switch arr[len(arr)-1] {
	case "css":
		w.Header().Set("Content-Type", "text/css; charset=utf-8")
	case "html":
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
	case "js":
		w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
	}
	_, _ = w.Write(assets.GetRes(f))
}

//func (server *Server) Home(w http.ResponseWriter, r *http.Request) {
//	responses.JSON(w, http.StatusOK, "Welcome To This API")
//}
