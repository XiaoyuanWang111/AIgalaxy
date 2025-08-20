#!/bin/bash

# AI Galaxy Platform - Management Script
# Simplified commands for common operations

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_DIR="/opt/ai-galaxy"
COMPOSE_FILE="$PROJECT_DIR/deploy/docker/docker-compose.yml"
ENV_FILE="$PROJECT_DIR/deploy/docker/.env"

# Check if project exists
check_project() {
    if [[ ! -d "$PROJECT_DIR" ]]; then
        echo -e "${RED}❌ AI Galaxy project not found. Please run deploy.sh first.${NC}"
        exit 1
    fi
}

# Show usage
usage() {
    echo -e "${BLUE}AI Galaxy Platform Management${NC}"
    echo -e "Usage: $0 {start|stop|restart|status|logs|update|backup|shell|db}"
    echo -e ""
    echo -e "${YELLOW}Commands:${NC}"
    echo -e "  start     - Start all services"
    echo -e "  stop      - Stop all services"
    echo -e "  restart   - Restart all services"
    echo -e "  status    - Show service status"
    echo -e "  logs      - Show application logs"
    echo -e "  update    - Update to latest version"
    echo -e "  backup    - Create backup"
    echo -e "  shell     - Open shell in app container"
    echo -e "  db        - Database management"
    echo -e "  tools     - Start development tools (Adminer, Portainer)"
    echo -e "  ssl       - SSL certificate management"
    echo -e ""
}

# Start services
start_services() {
    echo -e "${BLUE}🚀 Starting AI Galaxy services...${NC}"
    cd "$PROJECT_DIR"
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
    echo -e "${GREEN}✅ Services started${NC}"
}

# Stop services
stop_services() {
    echo -e "${YELLOW}🛑 Stopping AI Galaxy services...${NC}"
    cd "$PROJECT_DIR"
    docker compose -f "$COMPOSE_FILE" down
    echo -e "${GREEN}✅ Services stopped${NC}"
}

# Restart services
restart_services() {
    echo -e "${BLUE}🔄 Restarting AI Galaxy services...${NC}"
    stop_services
    sleep 2
    start_services
}

# Show status
show_status() {
    echo -e "${BLUE}📊 AI Galaxy Service Status${NC}"
    cd "$PROJECT_DIR"
    docker compose -f "$COMPOSE_FILE" ps
    echo -e "\n${BLUE}💾 Resource Usage${NC}"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
}

# Show logs
show_logs() {
    echo -e "${BLUE}📜 AI Galaxy Logs${NC}"
    cd "$PROJECT_DIR"
    if [[ -z "$2" ]]; then
        docker compose -f "$COMPOSE_FILE" logs -f --tail=50
    else
        docker compose -f "$COMPOSE_FILE" logs -f --tail=50 "$2"
    fi
}

# Update application
update_app() {
    echo -e "${BLUE}📥 Updating AI Galaxy...${NC}"
    
    # Backup before update
    echo -e "${YELLOW}Creating backup before update...${NC}"
    /usr/local/bin/ai-galaxy-backup.sh
    
    # Pull latest code
    cd "$PROJECT_DIR"
    git pull origin main
    
    # Rebuild and restart
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build
    
    # Run database migrations
    echo -e "${YELLOW}Running database migrations...${NC}"
    docker compose -f "$COMPOSE_FILE" exec app npx prisma db push
    
    echo -e "${GREEN}✅ Update completed${NC}"
}

# Create backup
create_backup() {
    echo -e "${BLUE}💾 Creating backup...${NC}"
    /usr/local/bin/ai-galaxy-backup.sh
    echo -e "${GREEN}✅ Backup completed${NC}"
}

# Open shell
open_shell() {
    echo -e "${BLUE}🐚 Opening shell in app container...${NC}"
    cd "$PROJECT_DIR"
    docker compose -f "$COMPOSE_FILE" exec app /bin/sh
}

# Database management
db_management() {
    echo -e "${BLUE}🗄️ Database Management${NC}"
    echo -e "1. Open database shell"
    echo -e "2. Backup database"
    echo -e "3. Restore database"
    echo -e "4. Reset database"
    echo -e "5. View database logs"
    read -p "Choose option (1-5): " choice
    
    cd "$PROJECT_DIR"
    case $choice in
        1)
            docker compose -f "$COMPOSE_FILE" exec postgres psql -U ai_galaxy_user -d ai_galaxy
            ;;
        2)
            BACKUP_FILE="/tmp/db_backup_$(date +%Y%m%d_%H%M%S).sql"
            docker compose -f "$COMPOSE_FILE" exec postgres pg_dump -U ai_galaxy_user ai_galaxy > "$BACKUP_FILE"
            echo -e "${GREEN}Database backed up to: $BACKUP_FILE${NC}"
            ;;
        3)
            read -p "Enter backup file path: " RESTORE_FILE
            if [[ -f "$RESTORE_FILE" ]]; then
                docker compose -f "$COMPOSE_FILE" exec -T postgres psql -U ai_galaxy_user -d ai_galaxy < "$RESTORE_FILE"
                echo -e "${GREEN}Database restored${NC}"
            else
                echo -e "${RED}Backup file not found${NC}"
            fi
            ;;
        4)
            read -p "Are you sure you want to reset the database? (y/N): " confirm
            if [[ $confirm == "y" || $confirm == "Y" ]]; then
                docker compose -f "$COMPOSE_FILE" exec app npx prisma db push --force-reset
                docker compose -f "$COMPOSE_FILE" exec app npm run db:seed
                echo -e "${GREEN}Database reset completed${NC}"
            fi
            ;;
        5)
            docker compose -f "$COMPOSE_FILE" logs postgres
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
}

# Start development tools
start_tools() {
    echo -e "${BLUE}🛠️ Starting development tools...${NC}"
    cd "$PROJECT_DIR"
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile tools up -d
    echo -e "${GREEN}✅ Tools started${NC}"
    echo -e "${BLUE}Access:${NC}"
    echo -e "  • Adminer: http://localhost:8080"
    echo -e "  • Portainer: http://localhost:9000"
}

# SSL management
ssl_management() {
    echo -e "${BLUE}🔒 SSL Certificate Management${NC}"
    echo -e "1. Generate self-signed certificate"
    echo -e "2. Install Let's Encrypt certificate"
    echo -e "3. View current certificate"
    echo -e "4. Renew certificate"
    read -p "Choose option (1-4): " choice
    
    SSL_DIR="$PROJECT_DIR/deploy/nginx/ssl"
    
    case $choice in
        1)
            read -p "Enter domain name (or localhost): " DOMAIN
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout "$SSL_DIR/private.key" \
                -out "$SSL_DIR/cert.pem" \
                -subj "/C=CN/ST=Beijing/L=Beijing/O=AI Galaxy/CN=$DOMAIN"
            chmod 600 "$SSL_DIR/private.key"
            chmod 644 "$SSL_DIR/cert.pem"
            echo -e "${GREEN}Self-signed certificate generated${NC}"
            ;;
        2)
            echo -e "${YELLOW}Installing certbot...${NC}"
            sudo apt-get update
            sudo apt-get install -y certbot
            read -p "Enter your domain name: " DOMAIN
            read -p "Enter your email: " EMAIL
            sudo certbot certonly --standalone -d "$DOMAIN" --email "$EMAIL" --agree-tos
            sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$SSL_DIR/cert.pem"
            sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$SSL_DIR/private.key"
            sudo chown $USER:$USER "$SSL_DIR"/*
            echo -e "${GREEN}Let's Encrypt certificate installed${NC}"
            ;;
        3)
            openssl x509 -in "$SSL_DIR/cert.pem" -text -noout
            ;;
        4)
            sudo certbot renew
            echo -e "${GREEN}Certificate renewed${NC}"
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
}

# Main logic
check_project

case "${1:-help}" in
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
        update_app
        ;;
    backup)
        create_backup
        ;;
    shell)
        open_shell
        ;;
    db)
        db_management
        ;;
    tools)
        start_tools
        ;;
    ssl)
        ssl_management
        ;;
    help|*)
        usage
        ;;
esac