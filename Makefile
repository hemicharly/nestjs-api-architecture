# Defines the name of the Docker network to be used by the containers
NETWORK_NAME = app_network

# Checks if the Docker network defined in NETWORK_NAME already exists;
# if not, creates the network with the specified name.
create-network:
	@if [ -z "$$(docker network ls --filter name=^$(NETWORK_NAME)$$ --format '{{.Name}}')" ]; then \
		echo "Creating the network $(NETWORK_NAME)..."; \
		docker network create $(NETWORK_NAME); \
	else \
		echo "The network $(NETWORK_NAME) already exists."; \
	fi

# Creates the network defined in NETWORK_NAME (if it doesn't exist) and builds Docker images
# based on the compose.yml file.
build:
	make create-network &&\
	docker compose -f compose.yml build

# Installs the project dependencies using Yarn, running in a container
# configured in the yarn.cli.yml file.
install:
	yarn install &&\
	docker compose -f yarn.cli.yml run --rm yarn install

# Run test
test:
	docker compose -f yarn.cli.yml run --rm yarn test

# Run coverage
test-coverage:
	docker compose -f yarn.cli.yml run --rm yarn test:coverage

# Run to update readme coverage
readme-coverage:
	docker compose -f yarn.cli.yml run --rm yarn readme:coverage

# Updates all project libraries to their latest versions using Yarn,
# running in a container defined in the yarn.cli.yml file.
upgrade-lib:
	docker compose -f yarn.cli.yml run --rm yarn upgrade --latest

# Runs the seed script (to populate the database or initialize data) using Yarn,
# in a container defined in the yarn.cli.yml file.
seed:
	docker compose -f yarn.cli.yml run --rm yarn seed

# Generates the project's index (e.g., files or reference code) using Yarn,
# in a container defined in the yarn.cli.yml file.
generate-index:
	docker compose -f yarn.cli.yml run --rm yarn generate-index && \
	git add .

# Creates the network defined in NETWORK_NAME (if it doesn't exist) and starts only the MongoDB
# container in the background, based on the compose.yml file.
mongodb:
	make create-network &&\
	docker compose -f compose.yml up --remove-orphans -d mongodb

# Creates the network defined in NETWORK_NAME (if it doesn't exist) and starts only the Localstack
# container in the background, based on the compose.yml file.
localstack-dev:
	make create-network &&\
	docker compose -f compose.yml up --remove-orphans -d localstack-dev &&\
	make create-queue-local;

# Bash to create sqs queue on Localstack
create-queue-local:
	bash ./create-queue-sqs.sh;

# Starts the development environment for the application, bringing up the main container (app)
# defined in the compose.yml file.
dev:
	docker compose -f compose.yml up --remove-orphans app

# Automatically fixes linting and code formatting issues,
# and then builds the project using Yarn in a container defined in the yarn.cli.yml file.
lint-format:
	docker compose -f yarn.cli.yml run --rm yarn lint:fix &&\
	docker compose -f yarn.cli.yml run --rm yarn format:fix &&\
	docker compose -f yarn.cli.yml run --rm yarn build