# Multi-stage Dockerfile for Talent Portal
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
# Copy package file first for layer caching
COPY package.json ./
RUN npm install
# Copy rest of the project (includes src/admin and src/frontend)
COPY . .
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.8.4-openjdk-17 AS backend-build
WORKDIR /app
COPY src/backend/pom.xml ./
COPY src/backend/src ./src
RUN mkdir -p src/main/resources/static
# Copy frontend build to backend static resources
COPY --from=frontend-build /app/src/frontend/dist ./src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Final Image
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
EXPOSE 8081
# Recommended production environment variables
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-jar", "app.jar"]
