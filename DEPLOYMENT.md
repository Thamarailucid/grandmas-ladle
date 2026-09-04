# Complete Production Deployment Guide
**Architecture:** Node.js (EC2) + PostgreSQL (Local EC2) + Image Storage (AWS S3)

---

## Phase 1: AWS S3 Bucket Setup (Image Storage)

1. Log into your **AWS Console** and search for **S3**.
2. Click **Create bucket**.
3. **Region:** `Asia Pacific (Mumbai) ap-south-1`
4. **Bucket name:** `grandmas-ladle-uploads` (or your preferred name).
5. **Object Ownership:** Keep as `ACLs disabled (recommended)`.
6. **Block Public Access settings:**
   * 🛑 **UNCHECK** the box that says "Block all public access" (ensure it is completely empty).
   * Check the yellow warning box: *"I acknowledge that the current settings might result in this bucket and the objects within becoming public."*
7. Leave everything else as default and click **Create bucket**.
8. Click on your new bucket, go to the **Permissions** tab.
9. Scroll to **Bucket Policy**, click **Edit**, and paste this exact code (if you used a different bucket name, change `grandmas-ladle-uploads` below):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::grandmas-ladle-uploads/*"
        }
    ]
}
```
10. Click **Save changes**. Your bucket is now ready to serve images to the public!

---

## Phase 2: AWS IAM User Setup (API Keys)

We need to generate a secure Access Key so your Node.js backend is allowed to upload images to the S3 bucket.

1. At the top of your AWS Console, search for **IAM** and click it.
2. On the left menu, click **Users** -> **Create user**.
3. **User name:** `s3-uploader` -> click **Next**.
4. **Permissions:** Select **"Attach policies directly"**.
5. Search for `AmazonS3FullAccess`, check the box next to it, click **Next** -> **Create user**.
6. Click on your new `s3-uploader` user from the list.
7. Go to the **Security credentials** tab.
8. Scroll down and click **Create access key**.
9. Select **"Application running outside AWS"**, click **Next** -> **Create access key**.
10. **🚨 IMPORTANT:** Copy your **Access key** and **Secret access key** to a notepad immediately. You will need these for your server's `.env` file.

---

## Phase 3: PostgreSQL Database Setup (Local EC2)

By installing the database directly on your EC2 instance, you ensure zero-latency API queries and completely avoid the cost of an AWS RDS server.

Log into your Ubuntu EC2 terminal via SSH and run:

```bash
# 1. Install PostgreSQL
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# 2. Enter the PostgreSQL Console
sudo -u postgres psql
```

Once inside the `postgres=#` prompt, run:
```sql
ALTER USER postgres PASSWORD 'Novacodex123!';
\q
```

Back in the normal Ubuntu terminal, create your empty database:
```bash
sudo -u postgres createdb grandmas_ladle
```

---

## Phase 4: Configure the Node.js API

Update the environment variables on your EC2 server to connect the local database and the AWS S3 bucket.

```bash
cd ~/grandmas-ladle/services/api
nano .env
```

Delete everything inside and paste this configuration (Replace the S3 keys at the bottom with your actual IAM keys):

```text
NODE_ENV=production
PORT=5000

# Local PostgreSQL Database
DATABASE_URL=postgresql://postgres:Novacodex123!@localhost:5432/grandmas_ladle

# JWT Configuration
JWT_ACCESS_SECRET=change-this-to-a-random-64-char-string
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change-this-to-a-different-random-64-char-string
JWT_REFRESH_EXPIRES_IN=7d

# CORS (Allowed Frontends)
CORS_ORIGINS=https://grandma.novacodex.in,https://grandmadashboard.novacodex.in,http://localhost:5173,http://localhost:5174

# Email (SMTP)
BUSINESS_EMAIL=grandmasladle1269@gmail.com

# WhatsApp
WHATSAPP_BUSINESS_NUMBER=9841207516

# AWS S3 Image Uploads
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=grandmas-ladle-uploads
AWS_ACCESS_KEY_ID=your-access-key-here
AWS_SECRET_ACCESS_KEY=your-secret-key-here
```
Press `Ctrl+X`, then `Y`, then `Enter` to save.

---

## Phase 5: Final Deployment & Sync

To apply updates, generate the database tables, and insert the default admin user, run these final commands on your EC2 server:

```bash
cd ~/grandmas-ladle

# Pull latest code
git stash
git pull

# Install dependencies and build
pnpm install
pnpm build:api

# Create tables and seed data
pnpm --filter @grandmas-ladle/api migrate
pnpm --filter @grandmas-ladle/api seed

# Restart the live server
pm2 restart grandmas-api
```

### ✅ Done!
Your architecture is fully operational.
* **Database Data** -> Saved locally on the EC2 drive for maximum speed.
* **Uploaded Images** -> Automatically compressed, converted to WebP, and offloaded securely to AWS S3.
