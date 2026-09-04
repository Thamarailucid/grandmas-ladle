# Complete Production Deployment Guide - Grandma's Ladle

This guide contains every single step, command, and configuration required to deploy the Grandma's Ladle platform from scratch.

---

## Phase 1: AWS Database Setup (RDS)

1. Go to **AWS RDS** and click **Create database** -> **Standard create**.
2. Engine: **PostgreSQL**.
3. Templates: **Free tier** (`db.t3.micro` or `db.t4g.micro`).
4. Identifier: `grandmas-ladle-db`, Username: `postgres`, Password: `<YourPassword>`.
5. Storage: Uncheck "Enable storage autoscaling".
6. Connectivity: **Public access = Yes**.
7. Create a new VPC Security Group named `grandmas-db-security`.
8. Click **Create database** and wait for it to be Available. Copy the **Endpoint** URL.

**Fix the Firewall:**
1. Click your database in RDS, go to **Connectivity & security**.
2. Click the blue link for your Security Group under the **Security** column.
3. Go to the **Inbound rules** tab -> **Edit inbound rules**.
4. Add a new rule: **Type:** PostgreSQL, **Source:** Anywhere-IPv4 (`0.0.0.0/0`).
5. Save rules.

---

## Phase 2: EC2 Server Setup (Backend)

Connect to your Ubuntu EC2 instance via SSH and run these commands:

### 1. Install Node.js, PNPM, PM2, and Nginx
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx

# Install package managers
sudo npm install -g pnpm pm2
```

### 2. Add Swap Space (Crucial for 1GB RAM Servers)
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 3. Clone Repository
```bash
cd ~
git clone https://github.com/Thamarailucid/grandmas-ladle.git
cd grandmas-ladle
pnpm install
```

---

## Phase 3: Backend Configuration & Building

### 1. Configure Environment Variables
```bash
cd ~/grandmas-ladle/services/api
nano .env
```
Paste this exact content (Replace `DATABASE_URL` password and endpoint with yours):
```text
NODE_ENV=production
PORT=5000

# Remember the ?ssl=true at the end!
DATABASE_URL=postgresql://postgres:<YOUR_PASSWORD>@<YOUR_ENDPOINT>.ap-south-1.rds.amazonaws.com:5432/postgres?ssl=true

JWT_ACCESS_SECRET=random-64-char-string
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=random-64-char-string
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGINS=https://grandma.novacodex.in,https://grandmadashboard.novacodex.in,http://localhost:5173,http://localhost:5174

BUSINESS_EMAIL=grandmasladle1269@gmail.com
WHATSAPP_BUSINESS_NUMBER=9841207516

# Required for AWS DB SSL Connections
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### 2. Build the API
```bash
cd ~/grandmas-ladle
pnpm build:api
```

### 3. Migrate, Seed, and Start
```bash
# Create tables and insert default admin users
pnpm --filter @grandmas-ladle/api migrate
pnpm --filter @grandmas-ladle/api seed

# Start server forever
cd ~/grandmas-ladle/services/api
pm2 start dist/server.js --name "grandmas-api"
pm2 save
pm2 startup
```

---

## Phase 4: DNS, Nginx, and SSL (HTTPS)

1. In **GoDaddy**, add an `A` record pointing `grandmaapi` to your EC2 Public IP.
2. In your EC2 terminal, create the Nginx proxy:
```bash
sudo nano /etc/nginx/sites-available/grandmas-api
```
Paste this inside (notice the `client_max_body_size 50M;` which allows large image uploads!):
```nginx
server {
    listen 80;
    server_name grandmaapi.novacodex.in;
    
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```
3. Enable the proxy and install free SSL:
```bash
sudo ln -s /etc/nginx/sites-available/grandmas-api /etc/nginx/sites-enabled/
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d grandmaapi.novacodex.in
```

*(If Certbot splits the config file into two blocks, ensure `client_max_body_size 50M;` remains in the top block that handles `listen 443 ssl;`)*.

---

## Phase 5: Frontend Build & Hostinger Deployment

Run these steps on your **Local Computer (VS Code)**.

### 1. Set Production API URLs
Create `apps/web/.env.production`:
```text
VITE_API_BASE_URL=https://grandmaapi.novacodex.in/api/v1
```
Create `apps/admin/.env.production`:
```text
VITE_ADMIN_API_BASE_URL=https://grandmaapi.novacodex.in/api/v1
```

### 2. Build the Files
```bash
pnpm install
pnpm build:web
pnpm build:admin
```

### 3. Upload to Hostinger
1. Zip the contents of `apps/web/dist` and upload to Hostinger: `/public_html/grandma`
2. Zip the contents of `apps/admin/dist` and upload to Hostinger: `/public_html/grandmadashboard`

### 4. Create `.htaccess` (Fixes 404 Refresh Errors)
In Hostinger File Manager, create a file named exactly `.htaccess` inside both the `grandma` folder and the `grandmadashboard` folder. Paste this inside both:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Default Admin Credentials
* **Email:** `admin@novacodex.in`
* **Password:** `Novacodex@123`
*(Or `admin@grandmasladle.com` / `admin123`)*
