package server

import (
	"fmt"
	"github.com/joho/godotenv"
	"github.com/xyz71148/go-api/api/utils"
	"log"
	"os"
	"path/filepath"
	"strconv"
)

var server = Server{}

func init() {
	if err := godotenv.Load(); err != nil {
		log.Print("sad .env file found")
	}
}

var proxyAddr string


func Run(hostIp string,hostPort int,proxyAddr_ string) {
	proxyAddr = proxyAddr_
	dir, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	if utils.IsPathExist(fmt.Sprintf("%s/.env",dir)){
		var err error
		err = godotenv.Load()
		if err != nil {
			log.Printf("Error getting env, %v", err)
		} else {
			log.Println("We are getting the env values")
		}
	}else{
		log.Println(".env not exists")
	}
	server.Initialize()
	addr := hostIp + ":" + strconv.Itoa(hostPort)
	server.Run(addr)
}
