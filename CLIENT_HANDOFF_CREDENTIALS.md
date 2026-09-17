# GRANDMA'S LADLE — PRODUCTION INFRASTRUCTURE & CREDENTIALS HANDOFF

**Project:** Grandma's Ladle (E-Commerce Web Application & Admin Portal)  
**Date:** September 2026  
**Environment:** Production (`ap-south-1` Asia Pacific - Mumbai)  
**Classification:** STRICTLY CONFIDENTIAL  

---

## 1. 🌐 LIVE WEBSITES & SERVICES

| Service | Live URL | Hosting Architecture | SSL / Status |
| :--- | :--- | :--- | :--- |
| **Main Website** | [https://grandmasladle.com](https://grandmasladle.com) | Amazon S3 + NGINX Gateway | ✅ Active (HTTPS) |
| **Alternative URL** | [https://www.grandmasladle.com](https://www.grandmasladle.com) | Amazon S3 + NGINX Gateway | ✅ Active (HTTPS) |
| **Admin Portal** | [https://admin.grandmasladle.com](https://admin.grandmasladle.com) | Amazon S3 + NGINX Gateway | ✅ Active (HTTPS) |
| **Backend REST API** | [https://api.grandmasladle.com](https://api.grandmasladle.com) | Node.js / PM2 on Ubuntu EC2 | ✅ Active (HTTPS) |
| **API Health Status** | [https://api.grandmasladle.com/health](https://api.grandmasladle.com/health) | System Health Check | ✅ 200 OK |
| **Public Business API** | [https://api.grandmasladle.com/api/v1/BusinessSetting/GetPublicBusinessSettings](https://api.grandmasladle.com/api/v1/BusinessSetting/GetPublicBusinessSettings) | PostgreSQL Database | ✅ 200 OK |

---

## 2. 🔐 ADMIN DASHBOARD ACCESS

**Admin URL:** [https://admin.grandmasladle.com](https://admin.grandmasladle.com)

### Accounts Configured:
1. **Store Owner / Superadmin:**
   * **Email:** `admin@grandmasladle.com`
   * **Initial Password:** `admin123`
   * *(Note: Please update this password upon your first login for security).*

2. **Technical Support Admin:**
   * **Email:** `admin@novacodex.in`
   * **Initial Password:** `Novacodex@123`

---

## 3. ☁️ AWS CONSOLE & CLOUD CREDENTIALS

### AWS Web Console Sign-in:
* **Console Sign-in URL:** [https://console.aws.amazon.com/](https://console.aws.amazon.com/)
* **Root Account Email:** *(Your registered AWS email address)*
* **Account ID / Alias:** *(Your 12-digit AWS Account ID)*
* **Primary Region:** `ap-south-1` (Asia Pacific - Mumbai)

### AWS Programmatic IAM / S3 Upload Access Keys:
*(Used by the backend server for image uploads to S3)*
* **IAM Username:** `grandmas-ladle-app-user` (or AWS Root / IAM Admin)
* **AWS Access Key ID:** `[YOUR_AWS_ACCESS_KEY_ID]`
* **AWS Secret Access Key:** `[YOUR_AWS_SECRET_ACCESS_KEY]`
* **Default Region:** `ap-south-1`

### Amazon S3 Storage Buckets:
| Bucket Name | Purpose | Access Policy |
| :--- | :--- | :--- |
| **`grandmasladle-web-prod`** | Customer Website static files | Public Read (Website Hosting) |
| **`grandmasladle-admin-prod`** | Admin Portal static files | Public Read (Website Hosting) |
| **`grandmasladle-media-prod`** | Product photos, hero banners, media | Public Read with CORS enabled |

---

## 4. 🖥️ AWS EC2 SERVER (BACKEND & GATEWAY)

* **Instance Type:** AWS EC2 t3.small / t2.micro
* **Operating System:** Ubuntu 24.04 LTS (Noble Numbat)
* **Public IPv4 Address:** `3.109.202.149`
* **Private IPv4 Address:** `172.31.6.82`
* **SSH Username:** `ubuntu`
* **SSH Port:** `22`
* **Key Pair (.pem):** *(Use your downloaded private key file)*
* **SSH Login Command:**
  ```bash
  ssh -i "path/to/your-key.pem" ubuntu@3.109.202.149
  ```

### Active Server Stack:
* **Node.js:** v20 LTS
* **Package Manager:** pnpm
* **Process Manager:** PM2 (Application process: `grandmas-api`, running on internal port `5000`)
* **Web Server:** NGINX 1.28 (Handles SSL termination & reverse proxying)
* **SSL Certificates:** Let's Encrypt / Certbot (Auto-renews automatically via systemd timer)
* **Memory Protection:** 2 GB Swap file configured to prevent out-of-memory errors

---

## 5. 🗄️ PRODUCTION DATABASE (POSTGRESQL)

* **Database Engine:** PostgreSQL 16
* **Database Host:** `127.0.0.1` (Internal localhost on EC2)
* **Database Port:** `5432`
* **Database Name:** `grandmas_ladle_db`
* **Database Username:** `grandma_admin`
* **Database Password:** `GrandmaLadle2026Secure`
* **Database Superuser:** `postgres`

### Database Connection String:
```text
postgresql://grandma_admin:GrandmaLadle2026Secure@127.0.0.1:5432/grandmas_ladle_db
```

### Database Management Commands:
```bash
# Connect to database shell as application user:
psql -U grandma_admin -d grandmas_ladle_db -h 127.0.0.1

# Connect as PostgreSQL superuser:
sudo -u postgres psql -d grandmas_ladle_db

# Create an on-demand SQL backup dump:
pg_dump -U grandma_admin -h 127.0.0.1 grandmas_ladle_db > ~/backup_$(date +%Y%m%d_%H%M%S).sql

# Restore a database backup:
psql -U grandma_admin -h 127.0.0.1 grandmas_ladle_db < ~/backup_file.sql
```

---

## 6. 🌍 DOMAIN & DNS REGISTRAR (GODADDY)

* **Domain Registrar:** GoDaddy
* **Registered Domain:** `grandmasladle.com`
* **Expiration Date:** September 2, 2029
* **Domain Security:** Full Protection & WHOIS Privacy Active

### Configured DNS Records:
| Type | Name | Data / Target | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `3.109.202.149` | 600s | Main website apex (`grandmasladle.com`) |
| **A** | `www` | `3.109.202.149` | 600s | WWW website (`www.grandmasladle.com`) |
| **A** | `admin` | `3.109.202.149` | 600s | Admin dashboard (`admin.grandmasladle.com`) |
| **A** | `api` | `3.109.202.149` | 600s | Backend REST API (`api.grandmasladle.com`) |

---

## 7. 🛠️ SERVER OPERATIONS & MAINTENANCE CHEAT SHEET

### PM2 Application Management:
```bash
# Check status of running backend
pm2 status

# View live real-time API logs
pm2 logs grandmas-api

# View last 100 log lines
pm2 logs grandmas-api --lines 100

# Restart backend process
pm2 restart grandmas-api

# Stop backend process
pm2 stop grandmas-api
```

### NGINX Web Server:
```bash
# Test NGINX configuration syntax
sudo nginx -t

# Reload NGINX without dropping connections
sudo systemctl reload nginx

# Check NGINX status
sudo systemctl status nginx
```

### SSL Certificates:
```bash
# Test automatic renewal
sudo certbot renew --dry-run

# View all installed certificates and expiration dates
sudo certbot certificates
```

### Deploying Code Updates:
```bash
cd ~/grandmas-ladle
git pull origin main

# Build API & restart:
pnpm --filter @grandmas-ladle/api build
pm2 restart grandmas-api

# Build Web frontend (if updating S3):
pnpm --filter @grandmas-ladle/web build
aws s3 sync apps/web/dist s3://grandmasladle-web-prod --delete

# Build Admin frontend (if updating S3):
pnpm --filter @grandmas-ladle/admin build
aws s3 sync apps/admin/dist s3://grandmasladle-admin-prod --delete
```

---

## 8. 🛡️ SECURITY & COMPLIANCE RECOMMENDATIONS

1. **Enable MFA on AWS:** Always enable Multi-Factor Authentication (Virtual MFA / Authenticator App) on the AWS root account.
2. **Rotate Passwords:** Change the initial admin dashboard password for `admin@grandmasladle.com` immediately after your first sign-in.
3. **Keep PEM Key Private:** Never share your private SSH `.pem` key file over unencrypted email or public messaging. Store it securely.
4. **Regular Backups:** Take regular PostgreSQL database backups using the provided `pg_dump` command before making major product catalog or system changes.
