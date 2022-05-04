package main

import (
	"fmt"
	"testing"
	"time"

	"github.com/golang-jwt/jwt"
)

func init() {
	secret = []byte("test123")
}

func _createToken() (string, error) {
	claims := CustomClaimsExample{
		jwt.StandardClaims{
			Audience:  "hdva-image-directory",
			ExpiresAt: time.Now().Add(time.Minute * 1).Unix(),
		},
		UserInfo{
			Email:  "test@test.com",
			Group:  123,
			Name:   "Test",
			Role:   123,
			UserId: "123asd-asdasd123asd-asd",
		},
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return t.SignedString(secret)
}

func TestExtractToken(t *testing.T) {
	type Case struct {
		data   string
		assert string
		name   string
		err    bool
	}
	ttoken, _ := _createToken()
	cases := []Case{
		{
			data:   "",
			assert: "token is empty",
			name:   "Should throw an error if string is malformed (empty)",
			err:    true,
		},
		{
			data:   "Bearer a",
			assert: "token contains an invalid number of segments",
			name:   "Should throw an error if string is malformed (not JWT)",
			err:    true,
		},
		{
			data:   fmt.Sprintf("Bearer %s", ttoken),
			assert: "token contains an invaqweqwr of segments",
			name:   "Should pass token back",
			err:    false,
		},
	}

	for _, testcase := range cases {
		t.Run(testcase.name, func(t *testing.T) {
			result, err := extractToken(testcase.data)
			if err != nil {
				if testcase.err && err.Error() != testcase.assert {
					t.Fatalf("Assertion failed: %v, %q, ", result, err.Error())
					return
				}
			} else if (result == UserInfo{}) {
				t.Error("Assertion failed: result was empty")
			}
		})
	}
}
