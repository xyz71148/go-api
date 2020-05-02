package gae

import (
	"encoding/json"
	"github.com/xyz71148/go-api/api/responses"
	"github.com/xyz71148/go-api/api/service/websock"
	"log"
	"net/http"
)

func (server *Server) Home(w http.ResponseWriter, r *http.Request) {
	responses.JSON(w, http.StatusOK, "welcome")
}

func (server *Server) wsHandler(w http.ResponseWriter, r *http.Request) {
	websock.WsHandler(w,r)
}

func (server *Server) logHandler(w http.ResponseWriter, r *http.Request) {
	// curl -H "Accept: application/json" -XPOST -d '{"message": "test"}' localhost:8080/log
	var logMessage websock.LogStruct
	if err := json.NewDecoder(r.Body).Decode(&logMessage); err != nil {
		log.Printf("ERROR: %s", err)
		http.Error(w, "Bad request", http.StatusTeapot)
		return
	}
	log.Println(logMessage)
	defer r.Body.Close()
	go websock.LogMsg(logMessage.Message)
}