package yh_server

func (s *Server) initializeRoutes() {

	s.Router.HandleFunc("/swagger", s.ReverseProxy).Methods("GET")
	s.Router.PathPrefix("/api").HandlerFunc(s.ReverseProxy)
	s.Router.PathPrefix("/").HandlerFunc(s.StaticRes)

}
