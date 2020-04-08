
package yh_server

import (
	"fmt"
	"github.com/xyz71148/go-api/api/utils"
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

var server = Server{}

func init() {
	if err := godotenv.Load(); err != nil {
		log.Print("sad .env file found")
	}
}

func Run() {
	dir, _ := filepath.Abs(filepath.Dir(os.Args[0]))  //返回绝对路径  filepath.Dir(os.Args[0])去除最后一个元素的路径

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

	server.Run(":"+utils.GetEnv("httpManagePort","8080"))
}
