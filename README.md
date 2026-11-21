# Vishnu Varma — Interactive Software & Cloud Engineer Portfolio

Full-stack interactive engineering portfolio built with React, TypeScript, Tailwind CSS, Recharts, React Router, and Express (`server.ts`).

## Architecture Overview

- **Frontend (`src/`)**: Modular React + TypeScript SPA featuring Dark/Light theme switching, segmented project filtering, dedicated project architecture detail routes (`/projects/:slug`), Recharts LeetCode analytics, and 5 isolated interactive demos wrapped in error boundaries.
- **Data Layer (`src/data/`)**: Centralized content modules (`personal.ts`, `projects.ts`, `skills.ts`, `certifications.ts`, `achievements.ts`, `education.ts`, `journey.ts`, `socialLinks.ts`) separating content from UI components.
- **Backend (`server.ts`)**: Express server with:
  - Cached (30-min TTL) `/api/github` and `/api/leetcode` proxy endpoints with verified fallback snapshots.
  - Rate-limited, input-sanitized ephemeral `/api/chat/messages` sandbox room for TalkTime cross-tab testing.
  - Optional server-side `@google/genai` endpoints (`/api/demos/analyze-resume`, `/api/demos/generate-quiz`) using `GEMINI_API_KEY` solely on the server.
- **Resumes (`public/resumes/`)**: Direct role-specific PDF downloads for SDE (Java Backend) and Cloud/DevOps roles.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Configure `.env` from `.env.example` if enabling live Gemini AI demo modes:
   ```bash
   cp .env.example .env
   ```
3. Run development server (Express + Vite middleware on port 3000):
   ```bash
   npm run dev
   ```
4. Build and run production locally:
   ```bash
   npm run build
   npm start
   ```

## Docker Deployment

```bash
docker compose up -d --build
```
The application serves on port `3000` (and port `80` via the bundled Nginx service).

## Deployment Option A — Oracle Cloud Infrastructure (Ubuntu VM)

1. Provision an Ubuntu 22.04/24.04 Compute VM and open ingress rules in your VCN Security List for TCP `80` and `443` (and `22` restricted to your IP).
2. On the VM, configure UFW firewall & install Docker + Nginx + Certbot:
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   sudo apt update && sudo apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx
   ```
3. Clone the repository and start the container on `127.0.0.1:3000`:
   ```bash
   docker build -t vishnu-portfolio .
   docker run -d --restart unless-stopped --name portfolio -p 127.0.0.1:3000:3000 vishnu-portfolio
   ```
4. Point your domain's DNS `A` record to the VM's public IP, configure `/etc/nginx/sites-available/portfolio` to proxy to `http://127.0.0.1:3000`, and provision TLS with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```
5. Check logs & redeploy updates:
   ```bash
   docker logs -f portfolio
   git pull && docker build -t vishnu-portfolio . && docker rm -f portfolio && docker run -d --restart unless-stopped --name portfolio -p 127.0.0.1:3000:3000 vishnu-portfolio
   ```

## Deployment Option B — Microsoft Azure (App Service for Containers)

1. Build and push the image to Azure Container Registry (ACR):
   ```bash
   az acr login --name <your-acr>
   docker build -t <your-acr>.azurecr.io/vishnu-portfolio:latest .
   docker push <your-acr>.azurecr.io/vishnu-portfolio:latest
   ```
2. Deploy to Azure App Service (Linux container):
   ```bash
   az webapp create --resource-group <rg> --plan <app-plan> --name <app-name> --deployment-container-image-name <your-acr>.azurecr.io/vishnu-portfolio:latest
   az webapp config appsettings set --resource-group <rg> --name <app-name> --settings WEBSITES_PORT=3000 NODE_ENV=production
   ```
3. Bind your custom domain and enable managed HTTPS certificate in Azure App Service Custom Domains.
4. Stream logs via:
   ```bash
   az webapp log tail --resource-group <rg> --name <app-name>
   ```
