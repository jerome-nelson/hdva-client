package db

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type DBConn struct {
	Url        string
	DbName     string
	AuthSource string
	Replica    string
}

var Client mongo.Client

func main() {
	mongoConnect()
}

func mongoConnect() {
	details := DBConn{
		Url:        os.Getenv("dburl"),
		DbName:     os.Getenv("dbname"),
		AuthSource: os.Getenv("dbauth"),
		Replica:    os.Getenv("dbreplica"),
	}
	if Client.NumberSessionsInProgress() > 0 {
		fmt.Println("Database already initialiased")
	} else {
		uri := fmt.Sprintf("%s:27017/?maxPoolSize=20&w=majority", details.Url)
		Client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
		if err != nil {
			panic(err)
		}
		defer func() {
			if err = Client.Disconnect(context.TODO()); err != nil {
				panic(err)
			}
		}()
		if err := Client.Ping(context.TODO(), readpref.Primary()); err != nil {
			panic(err)
		}
		fmt.Println("Successfully connected and pinged.")
	}

}
