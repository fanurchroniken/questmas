# Setting Up HTTPS in Coolify

This guide will help you enable HTTPS for your Questmas application deployed on Coolify.

## Overview

Coolify handles HTTPS at the reverse proxy level (using Traefik or Caddy). Your nginx container continues to serve HTTP internally, and Coolify's proxy handles SSL termination. This is the standard and recommended approach.

## Prerequisites

1. **A domain name** (e.g., `questmas.yourdomain.com`)
   - You can use a subdomain of a domain you own
   - Free domains are available from services like Freenom, but paid domains (Namecheap, Cloudflare, etc.) are more reliable

2. **DNS access** to configure DNS records for your domain

3. **Coolify instance** running and accessible

## Step 1: Configure Your Domain in Coolify

1. **Log into Coolify Dashboard**
   - Navigate to your Questmas application

2. **Go to Domains Section**
   - In your application settings, find the **"Domains"** or **"Networking"** section
   - Click **"Add Domain"** or **"Configure Domain"**

3. **Add Your Domain**
   - Enter your domain name (e.g., `questmas.yourdomain.com`)
   - Coolify will show you the DNS records you need to configure

## Step 2: Configure DNS Records

You need to point your domain to your Coolify server. Coolify will provide you with the exact records needed, but typically:

### Option A: Using an A Record (Recommended)

1. Go to your domain registrar's DNS management
2. Add an **A record**:
   - **Name/Host**: `questmas` (or `@` for root domain)
   - **Type**: `A`
   - **Value/IP**: Your Coolify server's public IP address
   - **TTL**: 3600 (or default)

### Option B: Using a CNAME Record

If Coolify provides a hostname:
1. Add a **CNAME record**:
   - **Name/Host**: `questmas`
   - **Type**: `CNAME`
   - **Value**: The hostname provided by Coolify
   - **TTL**: 3600 (or default)

## Step 3: Enable SSL/TLS in Coolify

1. **In the Domain Settings**
   - Find the **"SSL/TLS"** or **"Certificate"** section
   - Enable **"Automatic SSL"** or **"Let's Encrypt"**

2. **Coolify will automatically:**
   - Request a Let's Encrypt certificate for your domain
   - Configure automatic renewal
   - Set up HTTPS redirect (HTTP → HTTPS)

3. **Wait for Certificate Provisioning**
   - This usually takes 1-5 minutes
   - You can check the status in Coolify's logs
   - Once complete, your site will be accessible via HTTPS

## Step 4: Verify HTTPS is Working

1. **Test HTTPS Access**
   - Visit `https://questmas.yourdomain.com`
   - You should see a padlock icon in your browser
   - The site should load without security warnings

2. **Check HTTP Redirect**
   - Visit `http://questmas.yourdomain.com`
   - It should automatically redirect to HTTPS

3. **Test Security Headers**
   - Open browser DevTools → Network tab
   - Check response headers for:
     - `Strict-Transport-Security` (HSTS)
     - `X-Frame-Options`
     - `X-Content-Type-Options`

## Step 5: Update Supabase CORS Settings (Important!)

After enabling HTTPS, you must update your Supabase CORS settings:

1. **Go to Supabase Dashboard**
   - Navigate to **Settings** → **API**

2. **Add Your HTTPS Domain to Allowed CORS Origins**
   - Add: `https://questmas.yourdomain.com`
   - Add: `https://www.questmas.yourdomain.com` (if using www)
   - Save changes

3. **Why This is Important**
   - Supabase will reject requests from domains not in the CORS allowlist
   - Your app will fail to connect to Supabase if the domain isn't added

## Troubleshooting

### Issue: Certificate Not Provisioning

**Symptoms**: HTTPS not working, certificate errors

**Solutions**:
- Verify DNS records are correct (use `dig` or `nslookup`)
- Ensure DNS has propagated (can take up to 48 hours, usually much faster)
- Check that port 80 and 443 are open on your server firewall
- Verify your domain is publicly accessible
- Check Coolify logs for specific error messages

### Issue: Mixed Content Warnings

**Symptoms**: Browser shows "Not Secure" or mixed content warnings

**Solutions**:
- Ensure all resources (images, scripts, etc.) are loaded via HTTPS
- Check that Supabase URL uses HTTPS (`https://...supabase.co`)
- Update any hardcoded HTTP URLs in your code

### Issue: CORS Errors After Enabling HTTPS

**Symptoms**: API requests fail with CORS errors

**Solutions**:
- Add your HTTPS domain to Supabase CORS settings (see Step 5)
- Clear browser cache
- Check browser console for specific CORS error messages

### Issue: HTTP Not Redirecting to HTTPS

**Symptoms**: HTTP still accessible, no automatic redirect

**Solutions**:
- Check Coolify's domain settings for "Force HTTPS" or "Redirect HTTP to HTTPS"
- Verify Coolify's proxy configuration
- This should be automatic, but may need to be enabled in settings

## Using a Free Domain (Alternative)

If you don't have a domain, you can use:

1. **sslip.io** (already in use for your current deployment)
   - Provides free subdomains with automatic DNS
   - Format: `your-app-name.xxx.xxx.xxx.xxx.sslip.io`
   - Coolify can automatically provision SSL for sslip.io domains

2. **Other Free Options**:
   - Freenom (free domains like `.tk`, `.ml`, `.ga`)
   - DuckDNS (free subdomains)

**Note**: Free domains may have limitations and are not recommended for production use.

## Security Best Practices

1. **Always Use HTTPS in Production**
   - Never serve user data over HTTP
   - HTTPS is required for many browser features (camera, geolocation, etc.)

2. **Keep Certificates Updated**
   - Let's Encrypt certificates expire every 90 days
   - Coolify handles automatic renewal automatically

3. **Monitor Certificate Expiration**
   - Check Coolify dashboard periodically
   - Set up alerts if available

4. **Use Strong Security Headers**
   - The nginx configuration includes security headers
   - These are automatically applied when behind HTTPS

## Additional Resources

- [Coolify Documentation - Domains & SSL](https://coolify.io/docs)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)

## Quick Checklist

- [ ] Domain name configured
- [ ] DNS records pointing to Coolify server
- [ ] Domain added in Coolify
- [ ] SSL/TLS enabled in Coolify
- [ ] Certificate provisioned successfully
- [ ] HTTPS accessible and working
- [ ] HTTP redirects to HTTPS
- [ ] Supabase CORS updated with HTTPS domain
- [ ] All resources loading via HTTPS
- [ ] Security headers present

Once all items are checked, your application is fully secured with HTTPS! 🔒


