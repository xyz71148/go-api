package shadowsocks

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type LogStruct struct {
	Message string `json:"message"`
}

var clients = make(map[*websocket.Conn]bool)

var broadcast = make(chan *LogStruct)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}


func LogMsg(message string) {
	log.Println(message)
	var logMessage LogStruct
	logMessage.Message = message
	broadcast <- &logMessage
}

// curl -H "Accept: application/json" -XPOST -d '{"message": "test111"}' localhost:1270/log
func logHandler(w http.ResponseWriter, r *http.Request) {
	var logMessage LogStruct
	if err := json.NewDecoder(r.Body).Decode(&logMessage); err != nil {
		log.Printf("ERROR: %s", err)
		http.Error(w, "Bad request", http.StatusTeapot)
		return
	}
	log.Println(logMessage)
	defer r.Body.Close()
	go LogMsg(logMessage.Message)
}

func WsHandler(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	clients[ws] = true
}

func BroadcastClients() {
	for {
		logMessage := <-broadcast
		message := fmt.Sprintf("%s", logMessage.Message)
		log.Println(message)
		// send to every client that is currently connected
		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, []byte(message))
			if err != nil {
				log.Printf("Websocket error: %s", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}