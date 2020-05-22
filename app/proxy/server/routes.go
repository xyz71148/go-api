package server

func (s *Server) initializeRoutes() {
	s.Router.PathPrefix("/").HandlerFunc(s.ReverseProxy)
}
