#!/bin/bash
set -e

REPO_GIT=$1
ROOT_BUILD=$2
TAG_NAME=$3
DOCKER_USR=$4
DOCKER_PWD=$5

DockerBuild () {
  cd $1
  IMAGE_NAME=sanfun/public:$TAG_NAME
  echo "===>>>>> $IMAGE_NAME"
  sudo docker build -t $TAG_NAME .
  sudo docker tag $TAG_NAME:latest $IMAGE_NAME
  sudo docker login -u $DOCKER_USR -p $DOCKER_PWD
  sudo docker push $IMAGE_NAME
}

PRO_ROOT=/tmp/repo
rm -rf $PRO_ROOT
git clone $REPO_GIT $PRO_ROOT
DockerBuild $PRO_ROOT$ROOT_BUILD $TAG_NAME
rm -rf $PRO_ROOT