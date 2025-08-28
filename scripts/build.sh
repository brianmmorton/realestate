#!/bin/bash

echo "Building the API..."
echo $(pwd)

# Build the API
cd apps/api
npm install
npm run build
cd ../..

# Build the web app
cd apps/web
npm install
npm run build