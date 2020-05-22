package main

import (
	"flag"
	"github.com/xyz71148/go-api/app/proxy/server"
	"log"
)

var hostIp = flag.String("ip", "127.0.0.1", "The TCP host ip that the server listens on")
var hostPort = flag.Int("port", 8080, "The TCP port that the server listens on")
var proxyAddr = flag.String("proxy", "http://35.221.244.162", "the proxy addr that server proxy")

func main() {
	flag.Parse()
	log.Printf("Starting: port = %d, ip=%s, porxy: %s", *hostPort, *hostIp, *proxyAddr)
	server.Run(*hostIp, *hostPort, *proxyAddr)
}
