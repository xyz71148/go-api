FROM golang:alpine

ENV PORT 8443
ENV HOST 127.0.0.1
ENV TLS false
ENV ROOM_SERVER https://jie8.cc

ADD ./build /go/src/github.com/xyz71148/go-api
RUN apk add git && cd /go/src/github.com/xyz71148/go-api/app/collider/collidermain && \
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags' -o /bin/collider . && \
    rm -rf /go/src/

ADD start.sh /bin/start.sh
RUN chmod +x /bin/start.sh /bin/collider

CMD ["/bin/start.sh"]


