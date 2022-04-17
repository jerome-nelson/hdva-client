package main

import (
	"errors"
	"os"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/golang-jwt/jwt"
)

var secret []byte
var conn DBConn

// 1. Get Token
// 2. Slice it
// 3. If token is not valid, quit
// 4. MongoDB
// 	i. Connect to instance
//  ii. fetch role and user data
type DBConn struct {
	Url        string
	DbName     string
	AuthSource string
	Replica    string
}

type UserInfo struct {
	Email  string
	Group  int64
	Name   string
	Role   int64
	UserId string
}

type CustomClaimsExample struct {
	jwt.StandardClaims
	User UserInfo
}

func init() {
	secret = []byte(os.Getenv("jwt"))
	conn = DBConn{
		Url:        os.Getenv("dburl"),
		DbName:     os.Getenv("dbname"),
		AuthSource: os.Getenv("dbauth"),
		Replica:    os.Getenv("dbreplica"),
	}
}

func mongoConnect() {

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
	token, parseErr := extractToken(request.AuthorizationToken)

	if (parseErr != nil || token == UserInfo{}) {
		return events.APIGatewayCustomAuthorizerResponse{}, errors.New("Unauthorized")
	}

	return generatePolicy("user", "Allow", request.MethodArn), nil
}

func main() {
	lambda.Start(handler)
}

func generatePolicy(principalID, effect, resource string) events.APIGatewayCustomAuthorizerResponse {
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
	}
	return authResponse
}
