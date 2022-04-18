package main

import (
	"context"
	"errors"
	"os"
	"packages/sls-api/lib/auth/functions/db"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
)

var secret []byte

type UserInfo struct {
	Email  string `json:"email"`
	Group  int64  `json:"group"`
	Name   string `json:"name"`
	Role   int64  `json:"role"`
	UserId string `json:"userId"`
}

type CustomClaimsExample struct {
	jwt.StandardClaims
	User UserInfo
}

func init() {
	secret = []byte(os.Getenv("jwt"))
}

func extractToken(token string) (UserInfo, error) {
	tokenSlice := strings.Split(token, " ")
	bearerToken := tokenSlice[len(tokenSlice)-1]

	if len(bearerToken) == 0 {
		return UserInfo{}, errors.New("token is empty")
	}

	tokenMap, err := jwt.ParseWithClaims(bearerToken, &CustomClaimsExample{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return secret, nil
	})

	if err != nil {
		return UserInfo{}, err
	}

	return tokenMap.Claims.(*CustomClaimsExample).User, nil

}

func handler(request events.APIGatewayCustomAuthorizerRequest) (events.APIGatewayCustomAuthorizerResponse, error) {

	details, parseErr := extractToken(request.AuthorizationToken)

	roleExists := bson.D{{"id", details.Role}}
	count, err := db.Client.Database(os.Getenv("dbname")).Collection("roles").CountDocuments(context.TODO(), roleExists)

	if err != nil || count == 0 {
		return events.APIGatewayCustomAuthorizerResponse{}, errors.New("Unauthorized")
	}

	uExists := bson.D{
		{"$or",
			bson.A{
				bson.D{{"email", strings.ToLower(details.Email)}},
				bson.D{{"username", strings.ToLower(details.Email)}},
			},
		},
	}

	count, err = db.Client.Database(os.Getenv("dbname")).Collection("users").CountDocuments(context.TODO(), uExists)

	if err != nil || count == 0 {
		return events.APIGatewayCustomAuthorizerResponse{}, errors.New("Unauthorized")
	}

	if (parseErr != nil || details == UserInfo{}) {
		return events.APIGatewayCustomAuthorizerResponse{}, errors.New("Unauthorized")
	}

	return generatePolicy("user", "Allow", request.MethodArn, details), nil
}

func main() {
	lambda.Start(handler)
}

func generatePolicy(principalID, effect, resource string, user UserInfo) events.APIGatewayCustomAuthorizerResponse {
	authResponse := events.APIGatewayCustomAuthorizerResponse{PrincipalID: principalID}
	if effect != "" && resource != "" {
		authResponse.PolicyDocument = events.APIGatewayCustomAuthorizerPolicy{
			Version: "2012-10-17",
			Statement: []events.IAMPolicyStatement{
				{
					Action:   []string{"execute-api:Invoke"},
					Effect:   effect,
					Resource: []string{resource},
				},
			},
		}
		authResponse.Context = map[string]interface{}{
			"user": user,
		}
	}
	return authResponse
}
