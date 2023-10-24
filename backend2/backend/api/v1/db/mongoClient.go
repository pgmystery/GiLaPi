package db

import "go.mongodb.org/mongo-driver/mongo"

type MongoClient struct {
	Client *mongo.Client
	DB     *mongo.Database
}

func GetMongoClient() {
	databaseName := "gilapi"
	mongoURI := ""

	return MongoClient{}
}
