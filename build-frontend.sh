#!/bin/bash

# Talent Portal - Frontend Build & Backend Integration Script
# This script builds the React frontend and moves it to the Spring Boot static resources.

# 1. Navigate to root and build frontend
echo "🚀 Building Frontend..."
npm install
npm run build

# 2. Ensure Backend Static Directory Exists
echo "📁 Preparing Backend Static Directory..."
mkdir -p src/backend/src/main/resources/static

# 3. Clean and Move Frontend Assets
echo "📦 Moving Assets to Backend..."
rm -rf src/backend/src/main/resources/static/*
cp -r dist/* src/backend/src/main/resources/static/

# 4. Success message
echo "✅ Frontend integrated successfully!"
echo "You can now run './mvnw clean package' in src/backend to create a unified JAR."
