// Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file in the root of the source
// tree.

package main

import (
	"github.com/xyz71148/go-api/app/collider/collider"
	"flag"
	"log"
)

var tls = flag.Bool("tls", true, "whether TLS is used")
var host = flag.String("host", "127.0.0.1", "The TCP host that the server listens on")
var port = flag.Int("port", 443, "The TCP port that the server listens on")
var roomSrv = flag.String("room-server", "https://appr.tc", "The origin of the room server")

func main() {
	flag.Parse()

	log.Printf("Starting collider: tls = %t, port = %d, room-server=%s", *tls, *port, *roomSrv)

	c := collider.NewCollider(*roomSrv)
	c.Run(*port, *tls)
}
