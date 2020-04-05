package shadowsocks

import (
	"encoding/json"
	"fmt"
	"github.com/getlantern/systray"
	"github.com/skratchdot/open-golang/open"
	"github.com/xyz71148/go-api/assets"
	"log"
	"net"
	"os"
	"time"
)


func getConfigFunc(name string) func(string, string) {
	if name == "is_global" {
		return func(name, value string) {
			refreshGlobalToggle(value == "on")
			SetPac()
		}
	}
	if name == "child_lock" {
		return func(name, value string) {
			SetPac()
		}
	}
	return func(s, v string) {}
}

func EffectSetting(name, value string) error {
	log.Printf("Get command to set %s to %s", name, value)
	config, err := LoadConfig()
	if err != nil {
		return err
	}
	config.Set(name, value)
	f := getConfigFunc(name)
	f(name, value)
	return nil
}

type CheckResultStuct struct {
	CheckResult    bool  `json:"check_result"`
	Delay   int64  `json:"delay"`
}

type JsonResponse struct {
	Error int             `json:"error"`
	Body    *json.RawMessage `json:"body"`
	Msg string           `json:"msg"`
}

func RawConnect(host string, port string) (bool){
	timeout := time.Second
	conn, err := net.DialTimeout("tcp", net.JoinHostPort(host, port), timeout)
	if err != nil {
		fmt.Println("Connecting error:", err)
		return false
	}
	if conn != nil {
		defer conn.Close()
		fmt.Println("Opened", net.JoinHostPort(host, port))
	}
	return true
}





func onTrayReady() {
	// iconBytes should be the []byte content of .ico for windows and .ico/.jpg/.png
	// for other platforms.

	setrlimit()

	systray.SetIcon(assets.GetRes("assets/res/icon22x22.ico"))
	systray.SetTitle("")
	systray.SetTooltip("yh")

	go StartSS()
	go StartHttpProxy()

	config, _ := LoadConfig()
	SetTunnels(config.GetSSTunnels())
	SetPac()
	go traceTray()
}

var mToggleGlobal *systray.MenuItem

func refreshGlobalToggle(global bool) {
	if global {
		mToggleGlobal.SetTitle("关闭全局模式")
	} else {
		mToggleGlobal.SetTitle("开启全局模式")
	}
}

func traceTray() {

	mConfig := systray.AddMenuItem("账号与设置", "账号与设置")
	mToggleGlobal = systray.AddMenuItem("开启全局模式", "全局模式开关")
	mQuit := systray.AddMenuItem("退出", "退出铜蛇")

	murl := fmt.Sprintf("http://%s", GetManagementAddr())
	open.Run(murl)

	config, _ := LoadConfig()

	var global bool = config.Get("is_global") == "on"
	refreshGlobalToggle(global)

	for {
		select {
		case <-mConfig.ClickedCh:
			open.Run(murl)
		case <-mQuit.ClickedCh:
			log.Println("clear pac settings...")
			UnsetPac()
			log.Println("sync rest traffic ...")
			TrafficCounter.Sync()
			log.Println("shut tray...")
			systray.Quit()
			log.Println("Quit...")
			os.Exit(0)
			return
		case <-mToggleGlobal.ClickedCh:
			config, _ := LoadConfig()
			global := !(config.Get("is_global") == "on")
			if global {
				EffectSetting("is_global", "on")
			} else {
				EffectSetting("is_global", "off")
			}
			refreshGlobalToggle(global)
			log.Printf("global mode is %v ", global)
		}
	}
}

func BootSysTray() {
	systray.Run(onTrayReady,nil)
}
