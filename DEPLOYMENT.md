# TestSprite Deployment Guide

## Environment Variables Setup

### Vercel Environment Variables (Production)

Add these environment variables in Vercel Dashboard → Project Settings → Environment Variables:

#### Public Variables (Safe for client-side)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC9ehOBPijdpD66r-dmcrcovv89f-Ebkc4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mywebapp-99a71.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mywebapp-99a71
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mywebapp-99a71.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=802097394794
NEXT_PUBLIC_FIREBASE_APP_ID=1:802097394794:web:f59f62224caff164644613
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-QE4300GEHK
NEXT_PUBLIC_BASE_URL=https://your-production-domain.vercel.app
```

#### Secret Variables (Server-side only - NEVER expose to client)
```
STRIPE_SECRET_KEY=sk_live_your_production_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
DRIVE_LESSON_FOLDER_ID=1AOxIHb3GPHUHWbtU66hrm4PL3ve38hwo
FIREBASE_PROJECT_ID=mywebapp-99a71
```

### Firebase Functions Environment Variables

If using Firebase Functions for webhooks, set these using Firebase CLI:

```bash
firebase functions:config:set \
  stripe.secret_key="sk_live_your_production_stripe_secret_key" \
  stripe.webhook_secret="whsec_your_production_webhook_secret" \
  openai.api_key="your_openai_api_key_here" \
  gemini.api_key="your_gemini_api_key_here"
```

## Security Checklist

- [x] .env.local is in .gitignore (never committed to git)
- [ ] All secret keys use production values (not test/placeholder)
- [ ] STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are server-side only
- [ ] API keys are not visible in browser DevTools Network tab
- [ ] Separate development (.env.local) vs production (Vercel) keys
- [ ] No secrets hardcoded in source code

## Deployment Steps

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 2. Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-production-domain.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret
5. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### 3. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 4. Verify Deployment

- [ ] Visit production URL and verify it loads
- [ ] Test user signup/login
- [ ] Test lesson loading
- [ ] Test quiz functionality
- [ ] Test Stripe checkout (use test mode first)
- [ ] Verify webhook fires and updates Firestore
- [ ] Check Vercel logs for any errors
- [ ] Verify no secrets visible in browser DevTools

## Environment Separation

### Development (.env.local)
- Use Stripe test keys (sk_test_...)
- Use test webhook secret (whsec_test_...)
- Point to localhost:3001

### Production (Vercel)
- Use Stripe live keys (sk_live_...)
- Use production webhook secret
- Point to production domain

## Important Notes

1. **Never commit .env.local** - It's already in .gitignore
2. **Use Vercel CLI or Dashboard** to set production environment variables
3. **Rotate keys immediately** if accidentally exposed
4. **Test in Stripe test mode** before going live
5. **Monitor logs** in Vercel Dashboard for errors
6. **Keep development and production keys separate**
