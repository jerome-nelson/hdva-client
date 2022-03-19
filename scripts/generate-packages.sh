for module in $(find functions -name \*main.go | awk -F / '{print $2}'); do \
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/$module functions/$module/main.go ; \
done