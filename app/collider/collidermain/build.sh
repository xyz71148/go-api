docker run -v $PWD:/build -it golang:alpine sh


cd /build && CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags' -o collider .
