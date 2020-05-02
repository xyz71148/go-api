package websock

import (
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