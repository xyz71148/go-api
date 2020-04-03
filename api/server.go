// Package classification 云控
//
// 云控
//
//      Version: 1.0.1
//      Host: 127.0.0.1:10081
//
// swagger:meta
package api

import (
	"fmt"
	"github.com/xyz71148/go-api/api/controllers"
	"github.com/xyz71148/go-api/api/service/shadowsocks"
	"log"
	"os"

	"github.com/joho/godotenv"
)

var server = controllers.Server{}

func init() {
	if err := godotenv.Load(); err != nil {
		log.Print("sad .env file found")
	}
}

func Run() {

	var err error
	err = godotenv.Load()
	if err != nil {
		log.Fatalf("Error getting env, %v", err)
	} else {
		fmt.Println("We are getting the env values")
	}

	server.Initialize(os.Getenv("DB_DRIVER"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_PORT"), os.Getenv("DB_HOST"), os.Getenv("DB_NAME"))

	//seed.Load(server.DB)

	go server.Run(":"+os.Getenv("httpManagePort"))
	shadowsocks.BootSysTray()

}
