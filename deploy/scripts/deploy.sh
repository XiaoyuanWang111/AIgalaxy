#!/bin/bash

# AI Galaxy Platform - Ubuntu Server Deployment Script
# This script automates the complete deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ai-galaxy"
PROJECT_DIR="/opt/${PROJECT_NAME}"
BACKUP_DIR="/opt/${PROJECT_NAME}-backups"
LOG_FILE="/var/log/${PROJECT_NAME}-deploy.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root. Please run as a regular user with sudo privileges."
    fi
}

# System requirements check
check_system() {
    log "Checking system requirements..."
    
    # Check Ubuntu version
    if ! grep -q "Ubuntu" /etc/os-release; then
        error "This script is designed for Ubuntu systems"
    fi
    
    # Check available memory
    MEMORY=$(free -m | awk 'NR==2{printf "%.0f", $2}')
    if [[ $MEMORY -lt 2048 ]]; then
        warning "System has less than 2GB RAM. Performance may be affected."
    fi
    
    # Check available disk space
    DISK_SPACE=$(df -BG / | awk 'NR==2{print $4}' | sed 's/G//')
    if [[ $DISK_SPACE -lt 10 ]]; then
        error "Insufficient disk space. At least 10GB free space required."
    fi
    
    success "System requirements check passed"
}

# Install Docker and Docker Compose
install_docker() {
    log "Installing Docker and Docker Compose..."
    
    # Update package index
    sudo apt-get update
    
    # Install prerequisites
    sudo apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        git \
        unzip
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Set up Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    success "Docker installed successfully"
}

# Setup project directory
setup_project() {
    log "Setting up project directory..."
    
    # Create project directory
    sudo mkdir -p "$PROJECT_DIR"
    sudo mkdir -p "$BACKUP_DIR"
    sudo chown $USER:$USER "$PROJECT_DIR"
    sudo chown $USER:$USER "$BACKUP_DIR"
    
    # Clone repository if not exists
    if [[ ! -d "$PROJECT_DIR/.git" ]]; then
        log "Cloning repository..."
        git clone https://github.com/Xaiver03/AIgalaxy.git "$PROJECT_DIR"
    else
        log "Updating repository..."
        cd "$PROJECT_DIR"
        git pull origin main
    fi
    
    cd "$PROJECT_DIR"
    success "Project setup completed"
}

# Setup environment variables
setup_environment() {
    log "Setting up environment variables..."
    
    ENV_FILE="$PROJECT_DIR/deploy/docker/.env"
    
    if [[ ! -f "$ENV_FILE" ]]; then
        cp "$PROJECT_DIR/deploy/docker/.env.example" "$ENV_FILE"
        
        # Generate secure passwords
        DB_PASSWORD=$(openssl rand -base64 32)
        REDIS_PASSWORD=$(openssl rand -base64 32)
        SESSION_SECRET=$(openssl rand -base64 48)
        
        # Update .env file
        sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" "$ENV_FILE"
        sed -i "s/REDIS_PASSWORD=.*/REDIS_PASSWORD=$REDIS_PASSWORD/" "$ENV_FILE"
        sed -i "s/SESSION_SECRET=.*/SESSION_SECRET=$SESSION_SECRET/" "$ENV_FILE"
        
        warning "Environment file created at $ENV_FILE"
        warning "Please review and update the configuration before continuing."
        warning "Press Enter when ready to continue..."
        read -r
    fi
    
    success "Environment configuration ready"
}

# Generate SSL certificate
generate_ssl() {
    log "Generating SSL certificate..."
    
    SSL_DIR="$PROJECT_DIR/deploy/nginx/ssl"
    mkdir -p "$SSL_DIR"
    
    if [[ ! -f "$SSL_DIR/cert.pem" ]]; then
        # Generate self-signed certificate for testing
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$SSL_DIR/private.key" \
            -out "$SSL_DIR/cert.pem" \
            -subj "/C=CN/ST=Beijing/L=Beijing/O=AI Galaxy/CN=localhost"
        
        chmod 600 "$SSL_DIR/private.key"
        chmod 644 "$SSL_DIR/cert.pem"
        
        warning "Self-signed SSL certificate generated. For production, use a proper SSL certificate."
    fi
    
    success "SSL certificate ready"
}

# Deploy application
deploy_app() {
    log "Deploying AI Galaxy application..."
    
    cd "$PROJECT_DIR"
    
    # Build and start services
    docker compose -f deploy/docker/docker-compose.yml --env-file deploy/docker/.env up -d --build
    
    # Wait for services to be healthy
    log "Waiting for services to start..."
    sleep 30
    
    # Initialize database
    log "Initializing database..."
    docker compose -f deploy/docker/docker-compose.yml exec -T app npx prisma db push
    docker compose -f deploy/docker/docker-compose.yml exec -T app npm run db:seed
    
    success "Application deployed successfully"
}

# Setup system services
setup_services() {
    log "Setting up system services..."
    
    # Create systemd service for auto-start
    sudo tee /etc/systemd/system/ai-galaxy.service > /dev/null <<EOF
[Unit]
Description=AI Galaxy Platform
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=true
WorkingDirectory=$PROJECT_DIR
ExecStart=docker compose -f deploy/docker/docker-compose.yml --env-file deploy/docker/.env up -d
ExecStop=docker compose -f deploy/docker/docker-compose.yml down
User=$USER
Group=docker

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable ai-galaxy.service
    
    success "System service configured"
}

# Setup firewall
setup_firewall() {
    log "Configuring firewall..."
    
    # Enable UFW
    sudo ufw --force reset
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    
    # Allow SSH
    sudo ufw allow ssh
    
    # Allow HTTP and HTTPS
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    
    # Allow specific ports for development (optional)
    sudo ufw allow 3000/tcp comment "AI Galaxy App"
    sudo ufw allow 8080/tcp comment "Adminer"
    sudo ufw allow 9000/tcp comment "Portainer"
    
    sudo ufw --force enable
    
    success "Firewall configured"
}

# Setup monitoring and logging
setup_monitoring() {
    log "Setting up monitoring and logging..."
    
    # Setup log rotation
    sudo tee /etc/logrotate.d/ai-galaxy > /dev/null <<EOF
$LOG_FILE {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF

    # Create monitoring script
    sudo tee /usr/local/bin/ai-galaxy-monitor.sh > /dev/null <<'EOF'
#!/bin/bash
CONTAINERS=$(docker ps --filter "name=ai-galaxy" --format "table {{.Names}}\t{{.Status}}")
echo "[$(date)] Container Status:" >> /var/log/ai-galaxy-monitor.log
echo "$CONTAINERS" >> /var/log/ai-galaxy-monitor.log
EOF

    sudo chmod +x /usr/local/bin/ai-galaxy-monitor.sh
    
    # Add cron job for monitoring
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/ai-galaxy-monitor.sh") | crontab -
    
    success "Monitoring and logging configured"
}

# Create backup script
create_backup_script() {
    log "Creating backup script..."
    
    sudo tee /usr/local/bin/ai-galaxy-backup.sh > /dev/null <<EOF
#!/bin/bash
BACKUP_DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/backup_\$BACKUP_DATE"

mkdir -p "\$BACKUP_PATH"

# Backup database
docker exec ai-galaxy-db pg_dump -U ai_galaxy_user ai_galaxy > "\$BACKUP_PATH/database.sql"

# Backup uploads
docker cp ai-galaxy-app:/app/public/uploads "\$BACKUP_PATH/"

# Backup configuration
cp "$PROJECT_DIR/deploy/docker/.env" "\$BACKUP_PATH/"

# Compress backup
tar -czf "\$BACKUP_PATH.tar.gz" -C "$BACKUP_DIR" "backup_\$BACKUP_DATE"
rm -rf "\$BACKUP_PATH"

# Keep only last 7 backups
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: \$BACKUP_PATH.tar.gz"
EOF

    sudo chmod +x /usr/local/bin/ai-galaxy-backup.sh
    
    # Add daily backup cron job
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/ai-galaxy-backup.sh") | crontab -
    
    success "Backup script created"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Check Docker containers
    if ! docker compose -f "$PROJECT_DIR/deploy/docker/docker-compose.yml" ps | grep -q "Up"; then
        error "Some containers are not running"
    fi
    
    # Check application response
    sleep 10
    if ! curl -f http://localhost/health > /dev/null 2>&1; then
        warning "Application health check failed. It may still be starting up."
    fi
    
    success "Health check completed"
}

# Display final information
show_completion_info() {
    log "Deployment completed successfully!"
    
    echo -e "\n${GREEN}🎉 AI Galaxy Platform has been deployed successfully!${NC}\n"
    echo -e "${BLUE}📋 Access Information:${NC}"
    echo -e "   • Application: http://your-server-ip"
    echo -e "   • Admin Panel: http://your-server-ip/admin"
    echo -e "   • Database Admin: http://your-server-ip:8080"
    echo -e "   • Container Manager: http://your-server-ip:9000"
    echo -e "\n${BLUE}🔑 Default Credentials:${NC}"
    echo -e "   • Admin Email: admin@ai-galaxy.com"
    echo -e "   • Admin Password: admin123"
    echo -e "\n${YELLOW}⚠️ Important Next Steps:${NC}"
    echo -e "   1. Change default admin credentials"
    echo -e "   2. Configure your domain name"
    echo -e "   3. Install proper SSL certificate"
    echo -e "   4. Review environment variables"
    echo -e "\n${BLUE}📁 Important Locations:${NC}"
    echo -e "   • Project: $PROJECT_DIR"
    echo -e "   • Backups: $BACKUP_DIR"
    echo -e "   • Logs: $LOG_FILE"
    echo -e "\n${BLUE}🛠️ Management Commands:${NC}"
    echo -e "   • Start: sudo systemctl start ai-galaxy"
    echo -e "   • Stop: sudo systemctl stop ai-galaxy"
    echo -e "   • Restart: sudo systemctl restart ai-galaxy"
    echo -e "   • Logs: docker logs ai-galaxy-app"
    echo -e "   • Backup: sudo /usr/local/bin/ai-galaxy-backup.sh"
    echo -e "\n${GREEN}Happy coding! 🚀${NC}\n"
}

# Main execution
main() {
    log "Starting AI Galaxy Platform deployment..."
    
    check_root
    check_system
    install_docker
    setup_project
    setup_environment
    generate_ssl
    deploy_app
    setup_services
    setup_firewall
    setup_monitoring
    create_backup_script
    health_check
    show_completion_info
}

# Run main function
main "$@"