# shellcheck disable=SC2068
GIT_LAST_CHANGE_LOG=$(git whatchanged --stat -1 $@ | cat)
echo "$GIT_LAST_CHANGE_LOG"

DockerBuild () {
  cd $1
  TAG_NAME=$2
  IMAGE_NAME=sanfun-docker.pkg.coding.net/utils/public/$TAG_NAME:v_$CI_BUILD_NUMBER
  docker build -t $TAG_NAME .
  docker tag $TAG_NAME:latest $IMAGE_NAME
  docker login -u public-1584268429898  -p $DOCKER_PWD sanfun-docker.pkg.coding.net
  docker push $IMAGE_NAME
}

if [[ $GIT_LAST_CHANGE_LOG == *app/collider/Dockerfile* ]]
then
  DockerBuild /root/workspace/app/collider collider
fi