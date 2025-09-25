#!/bin/bash

# Hianime Management Script
# Simple management for Docker deployment

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[MANAGE]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[MANAGE]${NC} $1"
}

print_error() {
    echo -e "${RED}[MANAGE]${NC} $1"
}

show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start       Start all services"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  status      Show service status"
    echo "  logs        Show service logs"
    echo "  update      Update and rebuild services"
    echo "  clean       Clean up unused containers"
    echo "  health      Check service health"
    echo "  help        Show this help"
    echo ""
}

start_services() {
    print_status "Starting services..."
    docker compose up -d
    sleep 5
    print_status "Services started"
}

stop_services() {
    print_status "Stopping services..."
    docker compose down
    print_status "Services stopped"
}

restart_services() {
    print_status "Restarting services..."
    docker compose restart
    print_status "Services restarted"
}

show_status() {
    print_status "Service Status:"
    docker compose ps
    
    echo ""
    print_status "Access URLs:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:3000/api"
    echo "  Backend Direct: http://localhost:3030"
    echo "  API Documentation: http://localhost:3030/ui"
    echo "  Nginx HTTP: http://localhost:8080"
    echo "  Nginx HTTPS: https://localhost:8443"
}

show_logs() {
    if [ -n "$2" ]; then
        print_status "Showing logs for $2..."
        docker compose logs -f "$2"
    else
        print_status "Showing logs for all services..."
        docker compose logs -f
    fi
}

update_services() {
    print_status "Updating services..."
    docker compose down
    docker compose up --build -d
    print_status "Services updated and restarted"
}

cleanup() {
    print_status "Cleaning up unused containers and images..."
    docker system prune -f
    print_status "Cleanup completed"
}

health_check() {
    print_status "Checking service health..."
    
    if ! docker compose ps | grep -q "Up"; then
        print_error "Services are not running"
        exit 1
    fi
    
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_status "Frontend: Healthy"
    else
        print_error "Frontend: Unhealthy"
    fi
    
    if curl -f http://localhost:3030/ping > /dev/null 2>&1; then
        print_status "Backend: Healthy"
    else
        print_error "Backend: Unhealthy"
    fi
    
    if docker compose exec redis redis-cli ping > /dev/null 2>&1; then
        print_status "Redis: Healthy"
    else
        print_error "Redis: Unhealthy"
    fi
}

case "$1" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$@"
        ;;
    update)
        update_services
        ;;
    clean)
        cleanup
        ;;
    health)
        health_check
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac