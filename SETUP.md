# Maison Douceur — Deployment Guide (Asura Hosting / cPanel)

## Prerequisites

- Asura Hosting account with cPanel access
- PHP 8.0+ with PDO MySQL extension
- MySQL database
- Node.js 18+ (local machine for building)

## 1. Local Build

```bash
npm install
cp .env.example .env
# Edit .env with your production values
npm run build
```

This creates a `dist/` folder with optimized static files.

## 2. Database Setup

1. Log in to cPanel → **MySQL Databases**
2. Create a database (e.g. `username_maisondouceur`)
3. Create a database user with full privileges
4. Open **phpMyAdmin** → select your database → **Import**
5. Upload `backend/migrations/schema.sql`

## 3. Backend Configuration

1. Copy the `backend/` folder to your hosting root
2. Create `backend/.env` from `.env.example`:

```
DB_HOST=localhost
DB_NAME=username_maisondouceur
DB_USER=username_dbuser
DB_PASS=your_password
JWT_SECRET=generate-a-64-char-random-string
```

3. Ensure PHP 8.x is selected in cPanel → **MultiPHP Manager**

## 4. Upload Frontend

Upload contents of `dist/` to `public_html/` (or your domain root):

```
public_html/
├── index.html
├── assets/
├── favicon.svg
├── robots.txt
├── .htaccess
└── backend/
    ├── api/
    ├── config/
    └── .env
```

Copy `public/.htaccess` to `public_html/.htaccess` for SPA routing.

## 5. SSL Certificate

1. cPanel → **SSL/TLS Status**
2. Enable AutoSSL or install Let's Encrypt
3. Force HTTPS via cPanel → **Domains** → redirect HTTP to HTTPS

## 6. Environment Variables (Frontend)

Create `.env` before building with:

```
VITE_API_URL=/backend/api
VITE_SITE_URL=https://yourdomain.com
```

Rebuild after changing: `npm run build`

## 7. Admin Access

Default admin credentials (change immediately after first login):

- Email: `admin@maisondouceur.qa`
- Password: `admin123`

Access admin panel at: `https://yourdomain.com/admin`

## 8. WhatsApp Integration

Edit `src/components/WhatsAppButton.jsx` and update the phone number:

```jsx
const phone = '974XXXXXXXX'
```

Rebuild and redeploy.

## 9. Payment Gateway

For Stripe or local Qatar payment gateway:

1. Add API keys to `backend/.env`
2. Implement payment handler in `backend/api/payments.php`
3. Update checkout flow in `src/pages/Checkout.jsx`

## 10. Verify Deployment

- [ ] Homepage loads at `/en` and `/ar`
- [ ] Language switcher works (RTL for Arabic)
- [ ] Products display on shop page
- [ ] Cart and checkout flow works
- [ ] API responds: `https://yourdomain.com/backend/api/products.php`
- [ ] Admin panel accessible at `/admin`
- [ ] SSL certificate active
- [ ] Contact form submits successfully

## Troubleshooting

| Issue | Solution |
|---|---|
| 404 on page refresh | Ensure `.htaccess` is uploaded and `mod_rewrite` is enabled |
| API returns 500 | Check `backend/.env` credentials and PHP error log in cPanel |
| Blank page | Check browser console; verify `assets/` folder uploaded |
| CORS errors | API includes CORS headers; ensure API URL matches deployment path |

## File Structure

```
Cake/
├── dist/              # Production build (upload to public_html)
├── backend/
│   ├── api/           # PHP REST endpoints
│   ├── config/        # Database configuration
│   └── migrations/    # SQL schema
├── src/               # React source code
├── public/            # Static assets + .htaccess
└── SETUP.md           # This file
```
