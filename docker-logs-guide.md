# Docker Logs Troubleshooting Guide

## Quick Commands to Check Logs

### 1. Check Service Status
```bash
docker compose ps
```

### 2. Check Backend Logs (Most Important)
```bash
docker compose logs hianime-backend
```

### 3. Check Frontend Logs
```bash
docker compose logs hianime-frontend
```

### 4. Check Nginx Logs
```bash
docker compose logs hianime-nginx
```

### 5. Check Redis Logs
```bash
docker compose logs hianime-redis
```

### 6. Follow Live Logs
```bash
# Follow all logs
docker compose logs -f

# Follow specific service logs
docker compose logs -f hianime-backend
```

### 7. Check Recent Logs
```bash
# Show last 50 lines
docker compose logs --tail=50 hianime-backend

# Show last 100 lines with timestamps
docker compose logs --tail=100 --timestamps hianime-backend
```

## Common Issues and Solutions

### Backend Stuck in "Waiting" State

1. **Check Backend Logs**
   ```bash
   docker compose logs hianime-backend
   ```
   Look for:
   - Port conflicts (3030 already in use)
   - Missing dependencies
   - Environment variable issues
   - Database connection errors

2. **Check if Backend is Actually Running**
   ```bash
   docker compose exec hianime-backend ps aux
   ```

3. **Test Backend Health**
   ```bash
   curl http://localhost:3030/ping
   ```

### Port Conflicts

1. **Check if Ports are Available**
   ```bash
   # Check port 3030
   netstat -tlnp | grep :3030
   
   # Check port 3000
   netstat -tlnp | grep :3000
   ```

2. **Kill Processes Using Ports**
   ```bash
   # Kill process using port 3030
   sudo kill -9 $(sudo lsof -t -i:3030)
   
   # Kill process using port 3000
   sudo kill -9 $(sudo lsof -t -i:3000)
   ```

### Environment Issues

1. **Check Environment Files**
   ```bash
   cat backend.env
   cat frontend.env
   ```

2. **Verify Environment Variables in Container**
   ```bash
   docker compose exec hianime-backend env
   ```

### Memory/Resource Issues

1. **Check Container Resources**
   ```bash
   docker stats
   ```

2. **Check System Resources**
   ```bash
   free -h
   df -h
   ```

## Complete Restart Procedure

If services are stuck, try this complete restart:

```bash
# 1. Stop all services
docker compose down

# 2. Clean up unused containers
docker system prune -f

# 3. Rebuild and start
docker compose up --build -d

# 4. Wait and check status
sleep 30
docker compose ps
```

## Access Services Directly

### Backend API
```bash
# Test backend directly
curl http://localhost:3030/ping

# Check API docs
curl http://localhost:3030/ui
```

### Frontend
```bash
# Test frontend
curl http://localhost:3000/

# Test through nginx
curl http://localhost:8080/
```

## Common Error Messages and Solutions

### "Address already in use"
- Another process is using the required port
- Use `netstat` to find and kill the process
- Or change ports in docker-compose.yml

### "Connection refused"
- Service is not running or not ready
- Check logs for startup errors
- Wait longer for service to initialize

### "Permission denied"
- File permission issues
- Check Docker user permissions
- Try running with sudo

### "Container unhealthy"
- Health check is failing
- Check the specific service logs
- Verify health check endpoints are working