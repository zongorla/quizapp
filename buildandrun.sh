docker build -t thequizapp .
docker run -v ${PWD}:/app -v /app/node_modules -p 3001:3000 --rm thequizapp