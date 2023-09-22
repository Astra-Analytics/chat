include .env

.PHONY: all

build:
	docker build -t whum/aero-chat .

run:
	export $(cat .env | xargs)
	docker stop whum/chatbot-ui || true && docker rm whum/chatbot-ui || true
	docker run --name whum/chatbot-ui --rm -e OPENAI_API_KEY=${OPENAI_API_KEY} -p 3000:3000 whum/chatbot-ui

logs:
	docker logs -f whum/chatbot-ui

push:
	docker tag whum/chatbot-ui:latest ${DOCKER_USER}/whum/chatbot-ui:${DOCKER_TAG}
	docker push ${DOCKER_USER}/whum/chatbot-ui:${DOCKER_TAG}