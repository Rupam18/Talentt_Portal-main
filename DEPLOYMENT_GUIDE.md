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

## 🏗 Strategy 3: Render Blueprint (One-Click)

The [render.yaml](file:///Users/rupamkumarsarangi/Downloads/Talentt_Portal-main/render.yaml) file allows for automated setup.

1. Go to **Render Dashboard** -> **Blueprints**.
2. Connect your repository.
3. Render will automatically provision:
   - **PostgreSQL Database**
   - **Web Service** (using the Dockerfile)

---

## 🎨 Strategy 4: Split Deployment (Vercel + Render)

Best for high-performance frontend delivery.

### 1. Frontend on Vercel
- **Root Directory**: Project Root (recommend using the main `src/frontend` folder).
- **Build Command**: `npm run build`
- **Output Directory**: `src/frontend/dist` (as configured in your `vite.config.js`).
- **Frontend URL**: Note this down (e.g., `https://talent-portal.vercel.app`).
- **vercel.json**: Dedicated [vercel.json](file:///Users/rupamkumarsarangi/Downloads/Talentt_Portal-main/vercel.json) is provided for easy mapping.

### 2. Backend on Render
- Use the **Web Service** option.
- **Environment Variable**: Set `ALLOWED_ORIGINS` to your Vercel URL.

---

## 🛠 Troubleshooting & Optimization

If you encounter **"Could not resolve entry module"** or other persistent build errors:

1. **Clean Rebuild**: Force Docker to ignore cached layers:
   ```bash
   docker build --no-cache -t talent-portal .
   ```

2. **System Prune**: Remove unused Docker data if issues persist:
   ```bash
   docker system prune -a
   ```

3. **Verify Configuration**: The current `monaco-config.js` is optimized for Vite 7 production. Ensure only one version exists in your `src/` directory.

---

## 💡 Important Notes
- **SPA Routing**: The backend uses `FrontendController.java` to serve `index.html` for React Router paths, ensuring refresh works correctly.
- **Port**: The default port is `8081`. Change it via `SERVER_PORT` env var if needed.
