build-dev:
	docker build -t nest-grpc-dev -f dockerfile-dev .
	docker run -d --name grpc-dev \
		--network dev \
		--env-file ../env.local \
		-p 18002:8002 \
		-v src:/app/src \
		nest-grpc-dev
