package utils

import (
	"os"
	"strings"
)

func IsPathExist(path string) bool {
	_, err := os.Stat(path)
	if err == nil {
		return true
	}
	if os.IsNotExist(err) {
		return false
	}
	return true
}

func GetEnv(key string,defaultValue string) string {
	val := os.Getenv(key)
	if strings.Count(val,"") == 1 {
		return defaultValue
	}else{
		return val
	}
}
