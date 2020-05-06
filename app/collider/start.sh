#!/bin/bash

echo "Starting TURN/STUN server"

/bin/collider -port=${PORT} -host=${HOST} -tls=${TLS} -room-server=${ROOM_SERVER}
