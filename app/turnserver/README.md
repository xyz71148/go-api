- https://meetrix.io/blog/webrtc/turnserver/long_term_cred.html

    
    git clone https://github.com/xyz71148/apprtc.git
    
    cd ~/apprtc/src/turnserver
    sudo docker build -t coturn-long-term-cred .    
    
    export IMAGE_NAME=sanfun/public:coturn-v1
    sudo docker tag coturn-long-term-cred $IMAGE_NAME
    echo $DOCKER_PWD | sudo docker login --username=$DOCKER_USR --password-stdin
    sudo docker push $IMAGE_NAME    
    
    sudo docker rm -f my-coturn
    sudo docker run -d --net=host -e TURN_SECRET=TURN_SECRET_2020  -e TURN_PORT=8478 --name my-coturn -t coturn-long-term-cred

    sudo docker run -d --net=host \
        -e TURN_SECRET=TURN_SECRET_2020  \
        -e TURN_PORT=8478 sanfun/public:coturn-v1

# gen secret

    secret=mysecret && \
    time=$(date +%s) && \
    expiry=8400 && \
    username=$(( $time + $expiry )) &&\
    echo username:$username && \
    echo password : $(echo -n $username | openssl dgst -binary -sha1 -hmac $secret | openssl base64)
    