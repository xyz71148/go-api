package featuretests

import (
	revers_proxy "github.com/xyz71148/go-api/api/service/revers-proxy"
	"testing"
)


func TestM(t *testing.T) {
	revers_proxy.Run("0.0.0.0","8081","http://vpn.jie8.cc:8080")
	t.Log("pass")
}
