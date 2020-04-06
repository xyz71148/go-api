package yh_server

import (
	"fmt"
	"github.com/gorilla/handlers"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type Server struct {
	Router *mux.Router
}

func (server *Server) Initialize() {
	server.Router = mux.NewRouter()
	server.initializeRoutes()
}

func (server *Server) Run(addr string) {
	fmt.Println("Listening to port ",addr)
	log.Fatal(http.ListenAndServe(addr, handlers.CORS(
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "DELETE", "OPTIONS"}),
		handlers.AllowedOrigins([]string{"*"}),
		)(server.Router)))
}
