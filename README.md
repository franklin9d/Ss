# All-in-One File Lab

A production-grade SaaS platform for file conversion and processing. Built with Next.js 15, TypeScript, Prisma, Stripe, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)

---

## Features

### File Processing Tools (15+ Tools)

| Category | Tools |
|----------|-------|
| **PDF** | Image to PDF, Text to PDF, Merge PDF, Split PDF, Compress PDF |
| **Images** | Format Convert, Resize, Compress |
| **Media** | Video Convert, Audio Extract |
| **Documents** | Word to PDF, Markdown to PDF |
| **Utilities** | ZIP Create, ZIP Extract, OCR |

### User System
- Email/password authentication with bcrypt hashing
- Google OAuth integration
- JWT access tokens (15min) + refresh tokens (7 days)
- User dashboard with usage tracking
- Role-based access control (User/Admin)

### Monetization (Stripe Integration)
- **Free Plan**: 5 conversions/day, 10MB file limit
- **Pro Plan**: $9.99/month - Unlimited conversions, 100MB file limit, priority processing
- **Yearly Plan**: $99.99/year (save 17%)
- Stripe Checkout for subscriptions
- Stripe Customer Portal for self-service billing
- Webhook handling for real-time subscription updates

### Security
- Input validation (Zod schemas)
- File type validation (MIME + extension)
- File size limits per plan
- Virus scan hook/simulation
- Rate limiting (per IP, per endpoint)
- CSRF protection via NextAuth
- XSS prevention (sanitize-html)
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Password hashing (bcrypt, 12 rounds)
- Dangerous file type blocking
- Path traversal prevention
- JWT with short expiry + refresh rotation

### Admin Panel
- User management (view, search, block/unblock)
- Revenue analytics
- File processing statistics
- System audit logs with filtering
- Conversion rate tracking

---

## Architecture

```
src/
├── app/
│   ├── api/                    # API Routes (Backend)
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── [...nextauth]/  # NextAuth handler
│   │   │   ├── register/       # User registration
│   │   │   └── me/             # Current user profile
│   │   ├── files/              # File processing endpoints
│   │   │   ├── upload/         # File upload & process
│   │   │   ├── download/[id]/  # File download
│   │   │   └── history/        # Processing history
│   │   ├── payments/           # Stripe endpoints
│   │   │   ├── create-checkout/# Create checkout session
│   │   │   ├── webhook/        # Stripe webhooks
│   │   │   └── portal/         # Customer portal
│   │   └── admin/              # Admin endpoints
│   │       ├── stats/          # Dashboard statistics
│   │       ├── users/          # User management
│   │       └── logs/           # Audit logs
│   ├── (auth)/                 # Auth pages (login, register)
│   ├── (dashboard)/            # Dashboard pages (tools, history, settings)
│   ├── (marketing)/            # Marketing pages (pricing)
│   ├── (admin)/                # Admin panel pages
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── layout/                 # Layout components
│   ├── tools/                  # Tool-specific components
│   └── marketing/              # Marketing components
├── lib/
│   ├── auth/                   # Auth utilities (JWT, password, NextAuth)
│   ├── db/                     # Database (Prisma client)
│   ├── security/               # Security (validation, rate limiting, headers)
│   ├── stripe/                 # Stripe configuration
│   ├── storage/                # File storage
│   ├── processing/             # File processing engines
│   └── utils/                  # Utility functions
├── types/                      # TypeScript type definitions
└── middleware.ts               # Next.js middleware (auth, security headers)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS 4 |
| **Backend** | Next.js API Routes, NextAuth.js |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | NextAuth.js (Credentials + Google OAuth) |
| **Payments** | Stripe (Subscriptions, Webhooks, Customer Portal) |
| **File Processing** | Sharp (images), pdf-lib (PDF), Tesseract.js (OCR), Mammoth (DOCX) |
| **Storage** | Local filesystem (dev) / AWS S3 (production) |
| **Deployment** | Vercel (frontend) / Docker (self-hosted) |

---

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Stripe account (for payments)

### 1. Clone & Install

```bash
git clone https://github.com/franklin9d/Ss.git
cd Ss
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/filelab"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"
JWT_SECRET="generate-another-random-secret"
JWT_REFRESH_SECRET="and-another-one"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

### Deploy to Vercel (Recommended for Frontend)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

**Required Vercel Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string (use Neon, Supabase, or Railway)
- `NEXTAUTH_URL` - Your Vercel domain
- `NEXTAUTH_SECRET` - Random secret
- `JWT_SECRET` - Random secret
- `JWT_REFRESH_SECRET` - Random secret
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `STRIPE_PRO_PRICE_ID` - Stripe price ID for Pro plan
- `NEXT_PUBLIC_APP_URL` - Your Vercel domain
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### Deploy with Docker (VPS/AWS)

```bash
# Clone and configure
git clone https://github.com/franklin9d/Ss.git
cd Ss
cp .env.example .env

# Edit .env with production values
nano .env

# Start all services
docker-compose up -d

# Run database migrations
docker exec filelab-app npx prisma db push

# Check status
docker-compose ps
```

### Deploy to AWS

1. **Database**: Use AWS RDS (PostgreSQL)
2. **Cache**: Use AWS ElastiCache (Redis)
3. **Storage**: Use AWS S3 for file storage
4. **Compute**: Use AWS ECS or EC2 with Docker
5. **CDN**: Use CloudFront for static assets

---

## Stripe Setup

### 1. Create Products

In your Stripe Dashboard:
1. Create a Product called "File Lab Pro"
2. Add a monthly price: $9.99/month
3. Add a yearly price: $99.99/year
4. Copy the Price IDs

### 2. Configure Webhooks

Add webhook endpoint: `https://your-domain.com/api/payments/webhook`

Listen for events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`

### 3. Test with Stripe CLI

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

---

## Database Schema

### Core Models

- **User** - Authentication, profile, plan info
- **Account** - OAuth provider accounts
- **Session** - Active sessions
- **RefreshToken** - JWT refresh tokens
- **Subscription** - Stripe subscription data
- **Payment** - Payment history
- **Usage** - Daily usage tracking (credits system)
- **FileRecord** - File processing history
- **AuditLog** - Security audit trail
- **SystemLog** - System-level logs

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | User registration |
| POST | `/api/auth/[...nextauth]` | Public | NextAuth handlers |
| GET | `/api/auth/me` | Required | Get current user |
| POST | `/api/files/upload` | Required | Upload & process files |
| GET | `/api/files/history` | Required | Get processing history |
| GET | `/api/files/download/[id]` | Public | Download processed file |
| POST | `/api/payments/create-checkout` | Required | Create Stripe checkout |
| POST | `/api/payments/webhook` | Stripe | Handle Stripe webhooks |
| POST | `/api/payments/portal` | Required | Create billing portal |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET/PATCH | `/api/admin/users` | Admin | User management |
| GET | `/api/admin/logs` | Admin | Audit logs |

---

## Security Measures

| Measure | Implementation |
|---------|---------------|
| Password Hashing | bcrypt (12 rounds) |
| JWT Tokens | 15min access, 7d refresh with rotation |
| Rate Limiting | Per-IP, configurable per endpoint |
| Input Validation | Zod schemas on all endpoints |
| File Validation | MIME type + extension + size checks |
| Virus Scanning | Hook for ClamAV/VirusTotal integration |
| XSS Prevention | sanitize-html on all inputs |
| Security Headers | CSP, HSTS, X-Frame-Options, etc. |
| Path Traversal | Resolved path validation |
| Dangerous Files | Blocked executable extensions |
| CSRF Protection | NextAuth built-in CSRF tokens |

---

## License

MIT License - See [LICENSE](LICENSE) for details.
