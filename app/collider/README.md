# Collider

A websocket-based signaling server in Go.

## Building

1. Install the Go tools and workspaces as documented at http://golang.org/doc/install and http://golang.org/doc/code.html

2. Checkout the `apprtc` repository

        git clone https://github.com/webrtc/apprtc.git

3. Make sure to set the $GOPATH according to the Go instructions in step 1

  E.g. `mkdir -p $GOPATH/src/github.com/xyz71148/go-api/app/collider`

4. Link the collider directories 
        
        ln -s `pwd`/src/collider $GOPATH/src/github.com/xyz71148/go-api/app/collider

5. Install dependencies

        go get collidermain

6. Install `collidermain`

        go install collidermain

## Running

    $GOPATH/bin/collidermain -port=8089 -tls=true

## Testing

    go test collider

## Deployment
These instructions assume you are using Debian 7/8 and Go 1.6.3.

1. Change [roomSrv](https://github.com/webrtc/apprtc/blob/master/src/collider/collidermain/main.go#L16) to your AppRTC server instance e.g.

```go
var roomSrv = flag.String("room-server", "https://your.apprtc.server", "The origin of the room server")
```

2. Then repeat step 6 in the Building section.

### Install Collider
1. Login on the machine that is going to run Collider.
2. Create a Collider directory, this guide assumes it's created in the root (`/collider`).
3. Create a certificate directory, this guide assumes it's created in the root (`/cert`).
4. Copy `$GOPATH/bin/collidermain ` from your development machine to the `/collider` directory on your Collider machine.

### Certificates
If you are deploying this in production, you should use certificates so that you can use secure websockets. Place the `cert.pem` and `key.pem` files in `/cert/`. E.g. `/cert/cert.pem` and `/cert/key.pem`

### Auto restart
1\. Add a `/collider/start.sh` file:

```bash
#!/bin/sh -
/collider/collidermain 2>> /collider/collider.log
```

2\. Make it executable by running `chmod 744 start.sh`.

#### If using inittab otherwise jump to step 5:

3\. Add the following line to `/etc/inittab` to allow automatic restart of the Collider process (make sure to either add `coll` as an user or replace it below with the user that should run collider):
```bash
coll:2:respawn:/collider/start.sh
```
4\. Run `init q` to apply the inittab change without rebooting.

#### If using systemd:

5\. Create a service by doing `sudo nano /lib/systemd/system/collider.service` and adding the following:

```
[Unit]
Description=AppRTC signalling server (Collider)
 
[Service]
ExecStart=/collider/start.sh
StandardOutput=null
 
[Install]
WantedBy=multi-user.target
Alias=collider.service
```
6\. Enable the service: `sudo systemctl enable collider.service`

7\. Verify it's up and running: `sudo systemctl status collider.service`


#### Rotating Logs
To enable rotation of the `/collider/collider.log` file add the following contents to the `/etc/logrotate.d/collider` file:

```
/collider/collider.log {
    daily
    compress
    copytruncate
    dateext
    missingok
    notifempty
    rotate 10
    sharedscripts
}
```

The log is rotated daily and removed after 10 days. Archived logs are in `/collider`.

    
    git clone git@github.com:xyz71148/go-api.git
    cd go-api/app/collider/collidermain
    docker run -v $PWD:/build -it golang:alpine sh
    cd /build 
    
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags' -o collider .

    
    
    mkdir -p ~/data/projects/wwwroot
    echo "bar" > ~/data/projects/wwwroot/bar.txt
    cd ~/data/projects/wwwroot
    python -m SimpleHTTPServer 8080
    
    curl https://get.acme.sh | sh
    
    domain=ws.jie8.cc:8080
    
    .acme.sh/acme.sh --issue \
        -d $domain \
        -w ~/data/projects/wwwroot --force
    
    cd ~/.acme.sh/$domain/
    
    cat $domain.key $domain.cer ca.cer > key.pem
    cp fullchain.cer cert.pem
    mkdir /cert
    sudo cp cert.pem key.pem /cert
    
    cd ~/
    curl -O https://raw.githubusercontent.com/xyz71148/apprtc/master/src/collider/bin/collider
    
    nohup sudo ~/collider -port=8090 -tls=false -room-server=https://ws.jie8.cc &