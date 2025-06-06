# NESTJS-API-ARCHITECTURE

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


<p align="center">
  <img src="app/test/badges/entrypoints.svg" alt="Entrypoints" style="margin: 2px">
  <img src="app/test/badges/core.svg" alt="Core" style="margin: 2px">
  <img src="app/test/badges/infrastructure.svg" alt="Infrastructure" style="margin: 2px">
  <img src="app/test/badges/shared.svg" alt="Shared" style="margin: 2px">
</p>

### Documentation available in languages

[![en](https://img.shields.io/badge/lang-en-blue.svg)](README.md)
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](README.pt-br.md)

## Introduction

This project was developed for educational purposes to explore the **NestJS** framework. It serves as a practical study
to "**adapt**" concepts like **Clean Architecture** and **Hexagonal Architecture**, promoting **good software design
practices**, with a clear separation of responsibilities and abstraction of external dependencies.


<p align="center">
  <img src="diagram/architecture-timesheet-in-transit-api.png" alt="architecture-timesheet-in-transit-api">
</p>

## 1. Installation Requirements

To run the project, you will need the following requirements:

* **Operating System**: Linux Ubuntu / Mint
* **Docker**: Ensure Docker is installed on your machine.
* **Docker Compose**: Install Docker Compose to orchestrate containers.
* **Makefile**: Ensure you have Makefile installed to simplify command execution.
* **MongoDB**: Version 8.x of MongoDB running in a Docker container.
* **NodeJs**: Version 22.x of NodeJs running in a Docker container.
* **NodeJs**: Version 20.x of NodeJs installed your machine.
* **Yarn**: Versão 1.22.x do Yarn installed your machine.

## 1.1. Project Structure

This project closely resembles **Clean Architecture** and **Hexagonal Architecture** as it promotes a clear separation
of responsibilities and abstraction of external dependencies.  
This approach enhances maintainability, scalability, and testability while allowing the application to evolve without
directly impacting core business rules.

The division is organized into three main modules, each with a specific responsibility:

```lua
NESTJS-API-ARCHITECTURE/
│-- app/
│   │-- src/
│   │   │-- app.module.ts
│   │   │-- database.module.ts
│   │   │-- index.ts
│   │   │-- main.ts
│   │   │-- seed.module.ts
│   │   │-- seed.ts
│   │   │-- entrypoints/
│   │   │   │-- consumers/
│   │   │   │-- web/
│   │   │   │   │-- config/
│   │   │   │   │-- rest/
│   │   │   │   │-- shared/
│   │   │-- core/
│   │   │   │-- domain/
│   │   │   │   │-- entities/
│   │   │   │   │-- enums/
│   │   │   │   │-- exceptions/
│   │   │   │-- providers/
│   │   │   │   │-- config-env/
│   │   │   │   │-- integrations/
│   │   │   │   │-- queue/
│   │   │   │   │-- repositories/
│   │   │   │-- usecases/
│   │   │   │   │-- auth/
│   │   │   │   │-- notification/
│   │   │   │   │-- orders/
│   │   │-- infrastructure/
│   │   │   │-- config-env/
│   │   │   │-- integrations/
│   │   │   │-- queue/
│   │   │   │-- repositories/
│   │   │-- shared/
│   │   │   │-- audit/
│   │   │   │-- config/
│   │-- test/
│   │   │-- entrypoints/
│   │   │   │-- web/
│   │   │   │   │-- rest/
```

### **entrypoints**

The `entrypoints` module is responsible for managing the application's entry points, such as `web`, `jobs`, and
`consumers`.

**Important**: **It must not contain business logic**. This module may include input data validation for request
objects.

### **core**

The `core` module manages all the application's business logic. Key guidelines include:

- This module must be **autonomous** and **free of external dependencies**.
  Do not use **external frameworks** or **libraries** directly in `core`.
- The **domain** folder within the module contains the entities and granular business logic.
- **Outgoing communication** to external systems must be handled through interfaces defined in the `providers` module.
- **Incoming communication** must occur through interfaces in the `usecases` module.

### **infrastructure**

The `infrastructure` module manages the application's external communication, such as:

- **Database Connections**
- **API Integrations**
- **Messaging Systems**

**Important**: The `infrastructure` module **must not contain business logic**.

### **shared**

The `shared` module contains functionality and utilities that are shared between the **entrypoints** and
**infrastructure**. It should be used to include functionality that does not involve business rules, such as validations
input, common error handling, and other external integration utilities.

**Important**: The **core** layer must not use the `shared` module, as the business logic must remain
independent of external functionalities.


## 2. Steps to Run the Project

### 2.1. Starting the Project in Development Mode

Follow the steps below to run the project in development mode.

#### 2.1.1. Copy the configuration file:

- We recommend creating an **alias** `dcli` to execute the command:  `docker compose -f docker-compose.cli.yml run --rm`

```bash
  chmod +x ./add_alias_cli.sh && ./add_alias_cli.sh
```

#### 2.1.2. Installing aws cli:

- Install and configure [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html):

```bash
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  sudo ./aws/install
```

- Configuring AWS region:

```bash
  nano ~/.aws/config
```

```textmate
[default]
region = us-east-1
output = json
```

- Configuring AWS credentials (optional):

```bash
  nano ~/.aws/credentials
```

```textmate
[default]
aws_access_key_id = <aws_access_key_id>
aws_secret_access_key =  <aws_secret_access_key>
```

#### 2.1.3. Copy the configuration file:

- Copy the `.env.dist` file to `.env` using the command:

```bash
  cp .env.dist .env
```

### 2.2. Start the project with Docker using the commands:

- Creates the necessary Docker network:

```bash
  make create-network
```

- Builds Docker images:

```bash
  make build
```

- Installs project dependencies:

```bash
  make install
```

- Updates project dependencies:

```bash
  make upgrade-lib
```

- Seeds the database with initial data:

```bash
  make seed
```

- Starts the MongoDB container:

```bash
  make mongodb
```

- Starts the LocalStack container:

```bash
  make localstack-dev
```

- Creates queues in LocalStack:

```bash
  make create-queue-local
```

- Starts the application in development mode:

```bash
  make dev
```

- Runs lint and code formatting:

```bash
  make lint-format
```

- Automatically generates indices (if needed):

```bash
  make generate-index
```

- Automatically generates test file:

```bash
  make generate-test-file
```

- Runs test:

```bash
  make test
```

- Runs test with coverage:

```bash
  make test-coverage
```

- Run to add new dependency with `yarn`:

```bash
  dcli yarn add <your_dependency>
```

### 2.3. Documentation

The project includes several forms of documentation accessible locally:

- [Swagger UI - Interactive Interface](http://localhost:3000/swagger-doc)
- [Swagger JSON - Swagger Document](http://localhost:3000/swagger-doc-json)
- [Health Check - Application Health Verification](http://localhost:3000/health)

#### 2.3.1. Diagrams

For a better understanding of the application's flow, refer to the diagrams below:

- [Diagram](diagram/README.md)
