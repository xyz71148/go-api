package controllers

import (
	"github.com/xyz71148/go-api/api/responses"
	"net/http"

)

func (server *Server) Home(w http.ResponseWriter, r *http.Request) {
	responses.JSON(w, http.StatusOK, "Welcome To This Awesome API")

}
