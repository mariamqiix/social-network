sudo sudo docker build -f DockerFileBackend -t "friendzback:latest" .
sudo docker container run -p 8080:8080 --detach --name "friendz-backend-container" "friendzback:latest"
sudo sudo docker build -f DockerFileFrontend -t "friendzfront:latest" .
sudo docker container run -p 3000:3000 --detach --name "friendz-frontend-container" "friendzfront:latest"
echo "http://localhost:3000"