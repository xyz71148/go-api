
##build
    
    git_repo=git@github.com:xyz71148/go-api.git
    ssh dev "curl https://vpn.japp.cc/f/p-build | bash -s $git_repo /app/proxy proxy-v2 $DOCKER_USR $DOCKER_PWD"   
    
    sudo docker run -it \
        -p 80:80 \
        -e PORT=7080 \
        -e IP=0.0.0.0 \
        -e PROXY=https://keen-frame-269312.appspot.com \
        --net=host sanfun/public:proxy-v2
        
        