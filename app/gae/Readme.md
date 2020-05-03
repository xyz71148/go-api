
##deploy

    ssh dev "/tmp/google-cloud-sdk/bin/gcloud auth login"
    project_id=go-api-276013
    git_repo=https://github.com/xyz71148/go-api.git
    git add . && git commit -m "deploy" && git push origin master
    ssh dev "curl https://jie8.cc/f/p-deploy | bash -s deploy $project_id $git_repo /app/gae"