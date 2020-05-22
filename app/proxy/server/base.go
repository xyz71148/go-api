package server

import (
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

type Server struct {
	Router *mux.Router
}

func (server *Server) Initialize() {
	server.Router = mux.NewRouter()
	server.initializeRoutes()
}

func (server *Server) Run(addr string) {
	log.Printf("Listening: http://%s\n", addr)

	log.Fatal(http.ListenAndServe(addr, handlers.CORS(
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "DELETE", "OPTIONS"}),
		handlers.AllowedOrigins([]string{fmt.Sprintf("http://%s",addr)}),
		)(server.Router)))
}
