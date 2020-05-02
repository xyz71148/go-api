package gae

import (
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)
var server = Server{}

type Server struct {
	Router *mux.Router
}

func (s *Server) initializeRoutes() {
	s.Router.PathPrefix("/ws").HandlerFunc(s.wsHandler)
	s.Router.PathPrefix("/log").HandlerFunc(s.logHandler)
	s.Router.PathPrefix("/").HandlerFunc(s.Home)
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

func Run() {
	server.Initialize()
	server.Run("127.0.0.1:8080")
}
