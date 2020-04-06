package api

import (
	"fmt"
	"github.com/xyz71148/go-api/api/controllers"
	revers_proxy "github.com/xyz71148/go-api/api/service/revers-proxy"
	"github.com/xyz71148/go-api/api/service/shadowsocks"
	"github.com/xyz71148/go-api/api/utils"
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

var server = controllers.Server{}

func init() {
	if err := godotenv.Load(); err != nil {
		log.Print("sad .env file found")
	}
}

func RunReversProxy() {

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
	server.Initialize(
		utils.GetEnv("DB_DRIVER","sqlite3"),
		utils.GetEnv("DB_USER",""),
		utils.GetEnv("DB_PASSWORD",""),
		utils.GetEnv("DB_PORT",""),
		utils.GetEnv("DB_HOST",""),
		utils.GetEnv("DB_NAME","db.sqlite") )

	//seed.Load(server.DB)

	go server.Run(":"+utils.GetEnv("httpManagePort",shadowsocks.GetConfig("httpManagePort")))

	revers_proxy.Run("0.0.0.0","8088","http://vpn.jie8.cc:8080")

}
