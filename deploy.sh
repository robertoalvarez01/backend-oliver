#!/bin/bash

#Es necesario un volume con el nombre "oliverpetshop"

docker stop backend-oliver
docker stop petshop-oliver-mongo
docker container rm petshop-oliver-mongo
docker container rm backend-oliver
docker image rm backend-oliver

docker build -t backend-oliver .

docker run -d --restart unless-stopped --name petshop-oliver-mongo --mount src=oliverpetshop,dst=/data/db mongo
docker run -d --restart unless-stopped --name backend-oliver -p 3000:3000 --link petshop-oliver-mongo backend-oliver