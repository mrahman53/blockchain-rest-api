# Project 3: Private Blockchain to Front-End Client via Rest APIs.


## Getting Started

git clone https://github.com/mrahman53/blockchain-rest-api.git

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

Use NPM to initialize the project and create package.json to store project dependencies.

npm init

outline the dependencies(body-parser, express,level,crypto-js) on package.json


## Install all required dependencies by following command

npm install 

## start the server by following command

node Index.js

## API Endpoint
# Get block End Point. index-0 which is Genesis block
curl -v -X GET http://localhost:8000/block/0

# Post block End Point
curl -v -X POST http://localhost:8000/block

