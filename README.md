# timesheet-in-transit

## Documentation available in languages

[![en](https://img.shields.io/badge/lang-en-blue.svg)](README.md)
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](README.pt-br.md)

## Introduction

This project was developed for educational purposes, aiming to explore and deepen knowledge of the **NestJS** framework.
It serves as a practical study for the adaptation of concepts such as **Clean Architecture** and
**Hexagonal Architecture**, with the goal of promoting the best software design practices, ensuring clear separation of
responsibilities, and abstracting external dependencies.

## 1. Installation Requirements

To run the project, you will need the following requirements:

* **Operating System**: Linux
* **Docker**: Ensure Docker is installed on your machine.
* **Docker Compose**: Install Docker Compose to orchestrate containers.
* **Makefile**: Ensure you have Makefile installed to simplify command execution.
* **MongoDB**: Version 8.x of MongoDB running in a Docker container.
* **NodeJs**: Version 22.x of NodeJs running in a Docker container.

## 1.1. Project Structure

This project closely resembles **Clean Architecture** and **Hexagonal Architecture** as it promotes a clear separation
of responsibilities and abstraction of external dependencies.  
This approach enhances maintainability, scalability, and testability while allowing the application to evolve without
directly impacting core business rules.

The division is organized into three main modules, each with a specific responsibility:

```lua
timesheet-in-transit/
│-- app/
│   │-- src/
│   │   │-- app.module.ts
│   │   │-- config.env.ts
│   │   │-- database.module.ts
│   │   │-- index.ts
│   │   │-- main.ts
│   │   │-- seed.module.ts
│   │   │-- seed.ts
│   │   │-- application/
│   │   │   │-- config/
│   │   │   │-- consumers/
│   │   │   │-- web/
│   │   │-- core/
│   │   │   │-- domain/
│   │   │   │   │-- entities/
│   │   │   │   │-- enums/
│   │   │   │   │-- exceptions/
│   │   │   │-- providers/
│   │   │   │   │-- integrations/
│   │   │   │   │-- queue/
│   │   │   │   │-- repositories/
│   │   │   │-- usecases/
│   │   │   │   │-- auth/
│   │   │   │   │-- notification/
│   │   │   │   │-- orders/
│   │   │-- infrastructure/
│   │   │   │-- integrations/
│   │   │   │-- queue/
│   │   │   │-- repositories/
```

### **application**

The `application` module is responsible for managing the application's entry points, such as `web`, `jobs`, and
`consumers`.

**Important**: **It must not contain business logic**. This module may include input data validation for request
objects.

### **core**

The `core` module manages all the application's business logic. Key guidelines include:

- This module must be **autonomous** and **free of external dependencies**.
- Do not use framework or libraries.
- The **domain** folder within the module contains the entities and granular business logic.
- **Outgoing communication** to external systems must be handled through interfaces defined in the `providers` module.
- **Incoming communication** must occur through interfaces in the `usecases` module.

### **infrastructure**

The `infrastructure` module manages the application's external communication, such as:

- **Database Connections**
- **API Integrations**
- **Messaging Systems**

**Important**: The `infrastructure` module **must not contain business logic**.

## 2. Steps to Run the Project

### 2.1. Starting the Project in Development Mode

Follow the steps below to run the project in development mode.

1. **Copy the configuration file**:
    - Copy the `.env.dist` file to `.env` using the command:
      ```bash
      cp .env.dist .env
      ```

2. **Start the project with Docker**:
   Use the `Makefile` commands to simplify the process:

| COMMAND                   | DESCRIPTION                                 |
|---------------------------|---------------------------------------------|
| `make create-network`     | Creates the necessary Docker network        |
| `make build`              | Builds Docker images                        |
| `make install`            | Installs project dependencies               |
| `make upgrade-lib`        | Updates project dependencies                |
| `make seed`               | Seeds the database with initial data        |
| `make mongodb`            | Starts the MongoDB container                |
| `make localstack-dev`     | Starts the LocalStack container             |
| `make create-queue-local` | Creates queues in LocalStack                |
| `make dev`                | Starts the application in development mode  |
| `make lint-format`        | Runs lint and code formatting               |
| `make generate-index`     | Automatically generates indices (if needed) |

### 2.2. Documentation

The project includes several forms of documentation accessible locally:

- [Swagger UI - Interactive Interface](http://localhost:3000/swagger-doc)
- [Swagger JSON - Swagger Document](http://localhost:3000/swagger-doc-json)
- [Redoc - Alternative Documentation](http://localhost:3000/docs)
- [Health Check - Application Health Verification](http://localhost:3000/health)

### 2.3. Diagrams

For a better understanding of the application's flow, refer to the diagrams below:

- [Diagram](diagram/README.md)