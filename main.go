package main

import (
	revers_proxy "github.com/xyz71148/api/go-api/api/service/revers-proxy"
	"github.com/xyz71148/go-api/api"
)

func main() {
	revers_proxy.Run("0.0.0.0","8088","http://vpn.jie8.cc:8080")
	api.Run()
}
