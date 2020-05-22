#!/bin/sh

echo "Starting ..."

/bin/proxy_go -ip=${IP} -port=${PORT} -proxy=${PROXY}
