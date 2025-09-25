#!/bin/bash

# Hianime Docker Setup Script
# Production-ready Docker deployment for hianime-api + watanuki

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[SETUP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[SETUP]${NC} $1"
}

print_error() {
    echo -e "${RED}[SETUP]${NC} $1"
}

check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Docker and Docker Compose are installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Prerequisites check passed"
}

setup_environment() {
    print_status "Setting up environment..."
    
    # Create SSL directory if it doesn't exist
    mkdir -p nginx/ssl
    
    # Generate self-signed SSL certificate if not exists
    if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
        print_status "Generating self-signed SSL certificate..."
        openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        chmod 600 nginx/ssl/key.pem
        print_status "SSL certificate generated"
    fi
    
    # Copy environment files if they don't exist
    if [ ! -f "backend.env" ]; then
        cp backend.env.example backend.env
        print_status "Backend environment file created"
    fi
    
    if [ ! -f "frontend.env" ]; then
        cp frontend.env.example frontend.env
        print_status "Frontend environment file created"
    fi
    
    # Note: Environment files are already correctly referenced in docker-compose.yml
    # No need to modify the file with sed commands
    
    print_status "Environment setup completed"
}

start_services() {
    print_status "Starting services..."
    
    # Stop any existing services
    docker compose down --remove-orphans
    
    # Build and start services
    docker compose up --build -d
    
    print_status "Services are starting up..."
    
    # Wait for services to be healthy (increased time for our backend)
    print_status "Waiting for services to become healthy (this may take up to 2 minutes)..."
    sleep 30
    
    # Check if services are healthy
    if docker compose ps | grep -q "healthy"; then
        print_status "Services started successfully and are healthy"
    else
        print_warning "Services are starting but may not be fully healthy yet..."
        print_warning "Check service status with: docker compose ps"
        print_warning "Check logs with: docker compose logs"
        # Don't exit here, let the user see the status
    fi
}

show_access_info() {
    print_status "=== HIANIME DEPLOYMENT COMPLETE ==="
    echo ""
    print_status "Access URLs:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:3000/api"
    echo "  Backend Direct: http://localhost:3030"
    echo "  API Documentation: http://localhost:3030/ui"
    echo "  Nginx HTTP: http://localhost:8080"
    echo "  Nginx HTTPS: https://localhost:8443"
    echo "  Redis: localhost:6379"
    echo ""
    print_status "Management Commands:"
    echo "  View logs: docker compose logs -f"
    echo "  Stop services: docker compose down"
    echo "  Restart services: docker compose restart"
    echo "  Check status: docker compose ps"
    echo ""
    print_status "Service Health:"
    docker compose ps
}

main() {
    echo "=========================================="
    echo "  HIANIME DOCKER SETUP"
    echo "=========================================="
    echo ""
    
    check_prerequisites
    setup_environment
    start_services
    show_access_info
    
    echo ""
    print_status "🎉 Hianime is now running in Docker!"
    print_status "   Access your application at http://localhost:3000"
    echo ""
}

main "$@"