# Talent Portal Deployment Guide

This guide explains how to deploy the **Talent Portal** as a unified application (Frontend + Backend in one JAR).

## Prerequisites
- **Node.js 18+** & **npm** (for frontend build)
- **Java 17** & **Maven** (for backend build)
- **Docker** (optional, for containerized deployment)

---

## 🚀 Strategy 1: Manual Unified Build (Recommended)

This strategy builds the React frontend, moves it into the Spring Boot `static` resources, and packages everything into a single executable JAR.

1. **Run the integration script**:
   ```bash
   chmod +x build-frontend.sh
   ./build-frontend.sh
   ```

2. **Build the Backend JAR**:
   ```bash
   cd src/backend
   ./mvnw clean package -DskipTests
   ```

3. **Run the application**:
   ```bash
   java -jar target/talent-portal-0.0.1-SNAPSHOT.jar
   ```
   The app will be available at `http://localhost:8081`.

---

## 🐳 Strategy 2: Docker Deployment

Use the provided `Dockerfile` in the root directory to build a production-ready container.

1. **Build the Image**:
   ```bash
   docker build -t talent-portal .
   ```

2. **Run the Container**:
   ```bash
   docker run -p 8081:8081 \
     -e SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host/neondb \
     -e SPRING_DATASOURCE_USERNAME=your-user \
     -e SPRING_DATASOURCE_PASSWORD=your-pass \
     -e ALLOWED_ORIGINS=https://your-domain.com \
     talent-portal
   ```

---

## ⚙️ Essential Environment Variables

For production, ensure these are configured:

| Variable | Description |
| :--- | :--- |
| `SPRING_DATASOURCE_URL` | PostgreSQL Connection String |
| `SPRING_DATASOURCE_USERNAME` | Database Username |
| `SPRING_DATASOURCE_PASSWORD` | Database Password |
| `SPRING_MAIL_USERNAME` | SMTP Email (Gmail) |
| `SPRING_MAIL_PASSWORD` | SMTP App Password |
| `ALLOWED_ORIGINS` | Your frontend/production domain |

---

## 💡 Important Notes
- **SPA Routing**: The backend is configured to serve `index.html` for any unknown routes, ensuring React Router works correctly on page refresh.
- **Port**: The default port is `8081`. Change it via `SERVER_PORT` env var if needed.
