docker-buildl:
	docker build -t nest-grpc-test .

docker-build-dev:
	docker build -t nest-grpc-dev -f dockerfile-dev .
	docker run -d --name grpc-dev \
		--network dev \
		--env-file ../env.local \
		-p 18082:8082 \
		-v src:/app/src \
		nest-grpc-dev

docker-build:
	docker build -t nest-gql-test .
