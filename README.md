# ShopHub Backend

The backend for **ShopHub**, a full-fledged e-commerce platform built with Node.js, Express, Sequelize, MySQL, Stripe, and Gmail SMTP. This server powers authentication, product management, cart functionality, orders, payment processing, and email-based features.

> GitHub: [https://github.com/parthgoyal974/shophub](https://github.com/parthgoyal974/shophub)

---

## 📦 Installation

### 1. Clone the Repository

```
git clone https://github.com/parthgoyal974/shophub.git
cd shophub/backend
```

### 2. Install Dependencies

```
npm install
```

---

##  Environment Setup

Create a `.env` file in the `backend/` directory with the following contents:

```
DB_NAME="authentication"
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
PORT=3000

JWT_KEY=your_jwt_secret_key

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your_email@gmail.com

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
BASE_URL=http://localhost:5173

ADMIN_SESSION_SECRET=admin_session_secret
ADMIN_PASSKEY=admin_secure_passkey
```

>  **Important:** Do **not** commit your `.env` to version control. Add `.env` to your `.gitignore`.

---

##  Sequelize DB Configuration

Create `backend/config/config.json` with the following:

```
{
  "development": {
    "username": "your_mysql_user",
    "password": "your_mysql_password",
    "database": "Authentication",
    "host": "localhost",
    "dialect": "mysql"
  },
  "test": {
    "username": "your_mysql_user",
    "password": "your_mysql_password",
    "database": "Authentication",
    "host": "localhost",
    "dialect": "mysql"
  },
  "production": {
    "username": "your_mysql_user",
    "password": "your_mysql_password",
    "database": "Authentication",
    "host": "localhost",
    "dialect": "mysql"
  }
}
```

---

##  Importing the Database

The SQL dump file (`Dump20250722.sql`) sets up the entire database schema along with seed data.

### Step-by-step import:

1. Ensure MySQL is installed and running on the system.

2. Place the `Dump20250722.sql` file inside the `backend/` directory.

3. Run this command in terminal or command prompt:

```
mysql -u your_mysql_user -p < Dump20250722.sql
```

4. Enter your password when prompted. This will:
   - Create the `authentication` database
   - Define tables (`users`, `products`, `orders`, `reviews`, etc.)
   - Insert seed data into many of the tables

---

##  Stripe Secret Key Setup

1. Go to https://dashboard.stripe.com and log in or create an account.
2. Navigate to **Developers > API keys**.
3. Copy your **Secret Key** (starting with `sk_test_...`).
4. Paste into your `.env`:

```
STRIPE_SECRET_KEY=sk_test_YourStripeSecretKey
```

>  Use Stripe’s test keys for development. Create webhooks, test payments, and simulate success and failure scenarios.

---

##  Gmail SMTP Setup

To enable email services (like OTPs, order confirmation):

1. Turn on **2-Step Verification** in your Google Account.
2. Visit: https://myaccount.google.com/apppasswords
3. Generate an **App Password** for "Mail".
4. Copy and paste into `.env`:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_generated_app_password
EMAIL_FROM=your_email@gmail.com
```

>  The app password replaces your regular email password for programmatic access.

---

##  Run the Development Server

```
npm run dev
```

The app will run at: [http://localhost:3000](http://localhost:3000)

---

##  Project Overview

```
backend/
├── config/
│   └── config.json        # Sequelize DB configuration
├── models/                # Sequelize models
├── controllers/           # Business logic loaders
├── routes/                # Express routing
├── utils/                 # Helpers: Email, Stripe, etc.
├── Dump20250722.sql       # MySQL Dump File
├── .env                   # Environment variables
└── server.js              # Entry point
```

---

##  Security Practices

- Sensitive credentials stay in `.env`
- Passwords use bcrypt hashing
- JWT secret keys for secure token validation
- Stripe server-side only
- Gmail SMTP via app password

---

##  To-Do Before Deployment

- Secure `.env` and `.sql` files
- Configure environment variables for production (use `.env.production`)
- Setup SSL and CORS rules
- Use cloud DB (e.g., AWS RDS) for production readiness

---

## 🧾 License

This project is MIT licensed.

---

Built by [Parth Goyal](mailto:parthgoyal974@gmail.com)
```


