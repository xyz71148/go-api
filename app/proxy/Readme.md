

##build
    
    git_repo=git@github.com:xyz71148/go-api.git
    ssh dev "curl https://jie8.cc/f/p-build | bash -s $git_repo /app/proxy proxy-v1 $DOCKER_USR $DOCKER_PWD"   
    
    sudo docker run -d -it \
        -e PORT=8080 \
        -e IP=127.0.0.1 \
        -e PROXY=http://127.0.0.1 \
        --net=host sanfun/public:proxy-v1
        
        