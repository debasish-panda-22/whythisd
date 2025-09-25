# Hianime Docker Deployment

Production-ready Docker deployment for hianime-api backend + watanuki frontend.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose (v2) installed
- Ports 3000, 3030, 6379, 8080, 8443 available

### Setup and Run

```bash
# 1. Clone and setup
git clone <repository-url>
cd hianime-docker

# 2. Run setup script
./setup.sh

# 3. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3000/api
# API Documentation: http://localhost:3030/ui
```

## 📁 Project Structure

```
.
├── backend/                 # hianime-api backend source
│   ├── Dockerfile          # Backend Docker configuration
│   ├── src/                # Backend source code
│   └── package.json        # Backend dependencies
├── frontend/               # watanuki frontend source
│   ├── Dockerfile          # Frontend Docker configuration
│   ├── nginx.conf          # Frontend nginx config
│   ├── src/                # Frontend source code
│   └── package.json        # Frontend dependencies
├── nginx/                  # Reverse proxy
│   ├── nginx.conf          # Main nginx configuration
│   └── ssl/                # SSL certificates
├── redis/                  # Redis configuration
│   └── redis.conf          # Redis config file
├── docker-compose.yml      # Service orchestration
├── backend.env            # Backend environment variables
├── frontend.env           # Frontend environment variables
├── backend.env.example    # Backend environment template
├── frontend.env.example   # Frontend environment template
├── setup.sh               # One-time setup script
├── manage.sh              # Service management script
└── README.md              # This file
```

## 🛠️ Management Commands

### Daily Operations
```bash
# Start all services
./manage.sh start

# Stop all services
./manage.sh stop

# Restart services
./manage.sh restart

# Check service status
./manage.sh status

# View logs
./manage.sh logs

# Check service health
./manage.sh health
```

### Maintenance
```bash
# Update and rebuild services
./manage.sh update

# Clean up unused containers
./manage.sh clean
```

## ⚙️ Configuration

### Environment Variables

#### Backend (backend.env)
```env
NODE_ENV=production
PORT=3030
HOSTNAME=0.0.0.0
ORIGIN=http://localhost:3000,https://your-domain.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_LIMIT=100
REDIS_URL=redis://redis:6379
JWT_SECRET=your-super-secret-jwt-key-here
ENCRYPTION_KEY=your-super-secret-encryption-key-here
```

#### Frontend (frontend.env)
```env
VITE_APP_MODE=production
VITE_APP_SERVERURL=http://localhost:3000/api
VITE_APP_LOCALURL=http://localhost:3000/api
VITE_APP_PROXYURL=
VITE_APP_ENABLE_DEBUG=false
```

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000/api
- **Backend Direct**: http://localhost:3030
- **API Documentation**: http://localhost:3030/ui
- **Nginx HTTP**: http://localhost:8080
- **Nginx HTTPS**: https://localhost:8443
- **Redis**: localhost:6379

## 🔧 Services

### Backend (hianime-api)
- **Framework**: Hono with Bun runtime
- **Port**: 3030
- **Features**: Rate limiting, CORS, Redis caching, Swagger docs

### Frontend (watanuki)
- **Framework**: React with Vite
- **Port**: 3000 (via nginx)
- **Features**: Video player, responsive design, SEO optimized

### Redis
- **Purpose**: Caching layer
- **Port**: 6379
- **Memory**: 256MB limit

### Nginx
- **Purpose**: Reverse proxy
- **Ports**: 8080 (HTTP), 8443 (HTTPS)
- **Features**: SSL termination, gzip compression, security headers

## 🔒 Security

- Rate limiting (100 requests/minute per IP)
- CORS protection
- Security headers
- SSL/TLS encryption
- Redis authentication ready

## 📊 Monitoring

### Health Checks
- Frontend: `GET /health`
- Backend: `GET /ping`
- Redis: `redis-cli ping`

### Logs
```bash
# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f redis
```

## 🔄 Updates

```bash
# Update backend source
cd backend
git pull origin main

# Update frontend source
cd frontend
git pull origin main

# Rebuild and restart
./manage.sh update
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using the ports
   sudo lsof -i :3000
   sudo lsof -i :3030
   sudo lsof -i :6379
   ```

2. **Services not starting**
   ```bash
   # Check logs
   docker compose logs
   
   # Check container status
   docker compose ps
   ```

3. **Memory issues**
   ```bash
   # Check resource usage
   docker stats
   ```

### Reset Setup
```bash
# Stop and remove all containers
docker compose down -v

# Remove unused images
docker system prune -a

# Re-run setup
./setup.sh
```

## 🚀 Production Deployment

### Domain Configuration
1. Update your domain DNS to point to your server IP
2. Replace SSL certificates in `nginx/ssl/` with your production certificates
3. Update environment files with your domain

### SSL Certificates
```bash
# Generate with Let's Encrypt
sudo certbot --nginx -d your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem
```

### Environment Updates
```bash
# Update backend.env
ORIGIN=https://your-domain.com

# Update frontend.env
VITE_APP_SERVERURL=https://your-domain.com/api
VITE_APP_LOCALURL=https://your-domain.com/api
```

---

**Note**: This is a Docker-only deployment. All dependencies are containerized and managed through Docker Compose.