FROM golang:alpine

ENV PORT 8080
ENV PROXY http://127.0.0.0
ENV IP 0.0.0.0

RUN apk add git && \
    mkdir -p /go/src/github.com/xyz71148 && cd /go/src/github.com/xyz71148 && \
    git clone https://github.com/xyz71148/go-api.git && \
    cd /go/src/github.com/xyz71148/go-api/app/proxy/main && \
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags' -o /bin/proxy_go . && \
    rm -rf /go/

ADD start.sh /bin/start.sh
RUN chmod +x /bin/start.sh /bin/proxy_go

CMD ["sh","/bin/start.sh"]
