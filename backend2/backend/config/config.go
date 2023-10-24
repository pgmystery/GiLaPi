package config

import (
	"encoding/json"
	"io"
	"os"
)

type Config struct {
	Db ConfigDB `json:"db"`
}

type ConfigDB struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Username string `json:"username"`
	Password string `json:"password"`
	Database string `json:"database"`
}

func LoadConfig() Config {
	jsonFile, err := os.Open("users.json")

	if err != nil {
		panic(err)
	}

	defer func() {
		if err := jsonFile.Close(); err != nil {
			panic(err)
		}
	}()

	byteValue, _ := io.ReadAll(jsonFile)

	var config Config

	if err := json.Unmarshal(byteValue, &config); err != nil {
		panic(err)
	}

	return config
}
