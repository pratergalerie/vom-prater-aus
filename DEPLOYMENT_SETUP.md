# Automatic Deployment Setup Guide

This guide will help you set up automatic deployment for your application. Every time you push to the `main` branch, your application will automatically be deployed to your server.

## Prerequisites

- A server with Docker and Docker Compose installed
- SSH access to your server
- A GitHub repository with your code
- Domain name (optional, for SSL certificates)

## Server Setup

### 1. Install Required Software

Connect to your server and install the necessary software:

```bash
# Update package list
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt install -y git

# Install curl (for health checks)
sudo apt install -y curl

# Add your user to docker group (replace 'your-username' with your actual username)
sudo usermod -aG docker $USER
```

### 2. Clone Your Repository

```bash
# Navigate to your home directory or where you want to store the project
cd /root

# Clone your repository
git clone https://github.com/your-username/your-repo-name.git vom-prater-aus
cd vom-prater-aus
```

### 3. Set Up Environment Variables

Create a `.env` file with your configuration:

```bash
# Copy the example environment file (if you have one)
cp .env.example .env

# Edit the environment file
nano .env
```

Make sure your `.env` file contains all necessary variables for production deployment.

### 4. Set Up SSH Key for GitHub Actions

Generate an SSH key pair for GitHub Actions:

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@your-domain.com" -f ~/.ssh/github_actions

# Display the public key
cat ~/.ssh/github_actions.pub
```

**Important:** Copy the public key output - you'll need it for the next step.

Configure SSH to use this key for GitHub:

```bash
# Create SSH config file
cat > ~/.ssh/config << 'EOF'
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_actions
    IdentitiesOnly yes
EOF

# Set proper permissions
chmod 600 ~/.ssh/config
chmod 600 ~/.ssh/github_actions
```

### 5. Make Deployment Script Executable

```bash
# Make the deployment script executable
chmod +x deploy-auto.sh
```

## GitHub Repository Setup

### 1. Add Deploy Key to GitHub Repository

**This step is crucial and was missing from the original instructions:**

1. Go to your GitHub repository: `https://github.com/your-username/your-repo-name`
2. Navigate to **Settings** → **Deploy keys**
3. Click **Add deploy key**
4. Give it a title (e.g., "Server Deploy Key")
5. Paste the public key content (from `cat ~/.ssh/github_actions.pub`) into the **Key** field
6. Check **Allow write access** if you want to allow pushing (optional for deployments)
7. Click **Add key**

### 2. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add the following secrets:

- `SERVER_HOST`: Your server's IP address or domain
- `SERVER_USER`: Your server username (e.g., `root`)
- `SERVER_SSH_KEY`: The private SSH key content (from `~/.ssh/github_actions`)
- `SERVER_PORT`: SSH port (usually `22`)

To get the private key content:
```bash
cat ~/.ssh/github_actions
```

### 3. Push the Workflow Files

Make sure the following files are in your repository:
- `.github/workflows/deploy.yml`
- `deploy-auto.sh`

## Testing the Setup

### 1. Test SSH Connection

Before testing the deployment, verify SSH access works:

```bash
# Test SSH connection to GitHub
ssh -i ~/.ssh/github_actions -T git@github.com
```

You should see a welcome message like: "Hi username! You've successfully authenticated..."

### 2. Test Manual Deployment

First, test the deployment script manually on your server:

```bash
cd /root/vom-prater-aus
./deploy-auto.sh
```

### 3. Test GitHub Actions

Make a small change to your code and push to the main branch:

```bash
# Make a test change
echo "# Test deployment" >> README.md
git add README.md
git commit -m "Test deployment"
git push origin main
```

Check the GitHub Actions tab in your repository to see if the deployment runs successfully.

## Monitoring and Troubleshooting

### 1. Check Deployment Status

```bash
# Check running containers
docker compose -f docker-compose.yml --profile prod ps

# Check container logs
docker compose -f docker-compose.yml --profile prod logs

# Check specific service logs
docker compose -f docker-compose.yml --profile prod logs nuxt-app-prod
```

### 2. View GitHub Actions Logs

Go to your GitHub repository → Actions tab to see deployment logs and status.

### 3. Common Issues

#### SSH Connection Issues
- **Most Common**: Forgetting to add the deploy key to GitHub repository settings
- Verify the SSH key is correctly added to GitHub secrets
- Check that the server user has the correct permissions
- Ensure the SSH port is correct
- Test SSH connection manually: `ssh -i ~/.ssh/github_actions -T git@github.com`

#### Git Authentication Issues
- If you see "fatal: could not read Username for 'https://github.com'", the repository is using HTTPS instead of SSH
- Change remote URL to SSH: `git remote set-url origin git@github.com:username/repo-name.git`
- Ensure the deploy key is added to the repository

#### Docker Issues
- Make sure Docker and Docker Compose are installed
- Check that your user is in the docker group
- Verify the `.env` file exists and has correct values

#### Application Issues
- Check container logs for errors
- Verify all required environment variables are set
- Ensure ports are not already in use

## Maintenance

### 1. Automated Supabase Backups

Set up automated backups for your Supabase database and storage data:

#### Prerequisites

Ensure the backup script is executable:
```bash
chmod +x supabase/scripts/backup-supabase.sh
```

#### Test the Backup Script

Before setting up automation, test the backup script manually:
```bash
cd /root/vom-prater-aus
./supabase/scripts/backup-supabase.sh
```

The script will:
- Create a timestamped backup directory in `/root/vom-prater-aus/backups/`
- Backup the PostgreSQL database
- Backup MinIO storage data
- Backup storage metadata
- Clean up backups older than 30 days (configurable)

#### Set Up Automated Backups

Add a cron job to run backups automatically:

```bash
# Edit crontab
crontab -e

# Add this line to run backup daily at 2:00 AM
0 2 * * * /root/vom-prater-aus/supabase/scripts/backup-supabase.sh

# Alternative schedules:
# Every 6 hours: 0 */6 * * * /root/vom-prater-aus/supabase/scripts/backup-supabase.sh
# Weekly on Sunday: 0 2 * * 0 /root/vom-prater-aus/supabase/scripts/backup-supabase.sh
# Twice daily (2 AM and 2 PM): 0 2,14 * * * /root/vom-prater-aus/supabase/scripts/backup-supabase.sh
```

#### Backup Configuration

The backup script supports several configuration options:

- **Retention Period**: Set `BACKUP_RETENTION_DAYS` environment variable (default: 30 days)
- **Backup Location**: Backups are stored in `/root/vom-prater-aus/backups/`
- **Logging**: Each backup creates a detailed log file

#### Monitor Backups

Check backup status and logs:
```bash
# List recent backups
ls -la /root/vom-prater-aus/backups/

# View backup logs
tail -f /root/vom-prater-aus/backups/latest/backup.log

# Check backup sizes
du -sh /root/vom-prater-aus/backups/*
```

#### Restore from Backup

To restore from a backup:
1. Stop Supabase services: `docker-compose down`
2. Restore database: `gunzip backup.sql.gz && docker exec -i supabase-db psql -U postgres -d postgres < backup.sql`
3. Restore storage: `tar -xzf minio_storage.tar.gz -C supabase/volumes/storage/`
4. Start services: `docker-compose up -d`

### 2. Regular Cleanup

Set up a cron job to clean up old backups and Docker resources:

```bash
# Edit crontab
crontab -e

# Add this line to run cleanup daily at 2 AM
0 2 * * * cd /root/vom-prater-aus && docker system prune -f && find backups -type d -mtime +7 -exec rm -rf {} \;
```

### 3. SSL Certificate Renewal

SSL certificates are automatically renewed by Certbot, but you can manually renew them:

```bash
cd /root/vom-prater-aus
docker compose -f docker-compose.yml --profile prod run --rm certbot renew
```

#### Automatic SSL Certificate Renewal

The deployment script (`deploy-auto.sh`) automatically checks for SSL certificate renewal during each deployment. However, for better reliability, you should also set up a separate renewal process.

##### Manual Renewal

You can manually renew SSL certificates using the dedicated renewal script:

```bash
./renew-ssl.sh
```

##### Automated Renewal with Cron

For automatic renewal independent of deployments, set up a cron job:

```bash
# Edit crontab
crontab -e

# Add this line to run renewal twice daily (Let's Encrypt recommends daily)
0 2,14 * * * cd /root/vom-prater-aus && ./renew-ssl.sh >> /var/log/ssl-renewal.log 2>&1
```

##### Certificate Status

Check certificate status:

```bash
# Check certificate validity
docker compose -f docker-compose.yml --profile prod run --rm certbot certificates

# Check specific domain
docker compose -f docker-compose.yml --profile prod run --rm certbot certificates --cert-name yourdomain.com
```

##### SSL Certificate Best Practices

1. **Automatic Renewal**: Let's Encrypt certificates expire after 90 days, so automatic renewal is crucial
2. **Backup Certificates**: Certificates are stored in Docker volumes and persist between deployments
3. **Domain Validation**: Ensure your domain points to your server's IP address for certificate validation
4. **Rate Limits**: Let's Encrypt has rate limits, so the renewal script includes `--no-random-sleep-on-renew` for efficiency

## Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Check the server logs using `docker compose logs`
3. Verify all environment variables are set correctly
4. Ensure the server has sufficient resources (CPU, RAM, disk space)

The deployment script includes comprehensive error handling and logging to help diagnose issues quickly. 