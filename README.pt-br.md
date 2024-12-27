# timesheet-in-transit

## Documentação disponível em idiomas

[![en](https://img.shields.io/badge/lang-en-blue.svg)](README.md)
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](README.pt-br.md)

## Introdução

Este projeto foi desenvolvido com fins didáticos, visando explorar e aprofundar o conhecimento no framework **NestJS**.
Ele funciona como um estudo prático para a adaptação de conceitos como **Clean Architecture** e
**Hexagonal Architecture**, com o objetivo de promover boas práticas de design de software, garantindo uma clara
separação de responsabilidadese a abstração de dependências externas.

## 1. Requisitos de Instalação

Para rodar o projeto, você precisará dos seguintes requisitos:

* **Sistema Operacional**: Linux
* **Docker**: Certifique-se de ter o Docker instalado em sua máquina.
* **Docker Compose**: Instale o Docker Compose para orquestrar os containers.
* **Makefile**: Certifique-se de ter o Makefile instalado para facilitar a execução de comandos.
* **MongoDB**: Versão 8.x do MongoDB com container docker.

## 1.1. Estrutura do Projeto

Este projeto se assemelha muito à **Clean Architecture** e à **Hexagonal Architecture**, pois promove uma clara
separação de responsabilidades e abstração das dependências externas.
Isso facilita a manutenção, escalabilidade e testabilidade, além de permitir que a aplicação evolua sem impactos diretos
nas regras de negócios centrais.

A divisão ocorre em três módulos principais, cada um com uma responsabilidade específica:

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

O módulo `application` é responsável pela gestão dos pontos de entrada da aplicação, como `web`, `jobs` e
`consumers`.

**Importante**: **não deve conter regras de negócio**. Este pode ter validações de entradas de dados
de objetos de requests.

### **core**

O módulo `core` gerencia todas as regras de negócio da aplicação. Algumas diretrizes importantes:

- Este módulo deve ser **autônomo** e **sem dependências externas**.
- Não use framework ou bibliotecas.
- A pasta **domain** dentro do módulo contém as entidades e regras de negócio em nível mais granular.
- **Comunicação de saída** para sistemas externos deve ser feita através das interfaces definidas no módulo `providers`.
- **Comunicação de entrada** deve ocorrer através das interfaces do módulo `usecases`.

### **infrastructure**

O módulo `infrastructure` gerencia a comunicação externa da aplicação, como:

- **Conexões com Bancos de Dados**
- **Integrações com APIs**
- **Mensageria**

**Importante**: O módulo `infrastructure` **não deve conter regras de negócio**.

## 2. Passos para Rodar o Projeto

### 2.1. Iniciando o Projeto em Modo Desenvolvimento

Siga os passos abaixo para rodar o projeto em modo desenvolvimento.

1. **Copiar o arquivo de configuração**:
    - Copie o arquivo `.env.dist` para `.env` com o comando:
      ```bash
      cp .env.dist .env
      ```

2. **Iniciar o projeto com Docker**:
   Use os comandos do `Makefile` para facilitar o processo:

| COMANDO                   | DESCRIÇÃO                                    |
|---------------------------|----------------------------------------------|
| `make create-network`     | Cria a rede Docker necessária para o projeto |
| `make build`              | Constrói as imagens Docker                   |
| `make install`            | Instala as dependências do projeto           |
| `make upgrade-lib`        | Atualiza as dependências do projeto          |
| `make seed`               | Popula o banco de dados com dados iniciais   |
| `make mongodb`            | Inicia container docker do mongodb           |
| `make localstack-dev`     | Inicia container docker do localstack        |
| `make create-queue-local` | Cria filas no localstack                     |
| `make dev`                | Inicia a aplicação no modo desenvolvimento   |
| `make lint-format`        | Executa lint e formatação do código          |
| `make generate-index`     | Gera índices automaticamente (se necessário) |

### 2.2. Documentação

O projeto inclui várias formas de documentação acessíveis localmente:

- [Swagger UI - Interface Interativa](http://localhost:3000/swagger-doc)
- [Swagger JSON - Documento Swagger](http://localhost:3000/swagger-doc-json)
- [Redoc - Documentação Alternativa](http://localhost:3000/docs)
- [Health Check - Verificação de Saúde da Aplicação](http://localhost:3000/health)

### 2.3. Diagramas

Para melhor compreensão do fluxo da aplicação, consulte os diagramas abaixo:

- [Diagrama](diagram/README.md)