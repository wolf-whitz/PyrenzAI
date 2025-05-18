#!/bin/bash

# This script automates starting the app for Mac/Linux.
# It installs dependencies, formats code, builds the app, and starts the production server.
# Make sure you have Node.js and npm installed before running this.

set -e

echo "Installing dependencies..."
npm install

echo "Running format..."
npm run format

echo "Running format:check..."
npm run format:check

echo "Building the app..."
npm run build

echo "Starting production server..."
npm run prod
