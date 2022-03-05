# 💪 flexin [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

A PWA for daily tracking and progress of a 30-day pushup routine.

## Getting Started

### **`.env`**

Copy the `.env.example` file to an `.env` file at the root of the directory.

### **Services**

First, let's spin up containers for a Postgres DB and a fake SMTP server. The SMTP server is used for the passwordless login via email:

```bash
docker-compose up -d
```

Let's also open up a new browser tab at http://localhost:3080. This is the SMTP email client interface we'll use to receive emails outgoing from the application.

### **Prisma**

We'll need to generate the Prisma client so let's run a migration using the initial migration file to setup our Postgres DB.

```bash
npx prisma migrate dev
```

Running this command will apply the initial migration to setup the database as well as generate the Prisma client that's used in the application.

### **Next.js**

Next, let's spin up our Next.js app

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### **Authenticating**

This app has an authentication wall and so you will be directed to the signin page and asked for an email. Enter the email and submit, you'll be navigated to a verification email request page. Navigating back to the SMTP email client tab, you should now see a new email. The signin link in the email will allow you to authenticate and navigate to the homepage of the application.

## Tech Stack

- Next.js: React framework
- NextAuth.js: authentication for Next.js
- Prisma: database ORM
- Postgres: our database
- Nodemailer: email client
- Tailwind: CSS framework
- TypeScript: typing system
- ESLint: JavaScript linter
- Prettier: code formatter
- Husky: git hooks for pre-commit linting, testing
- Commitizen: CLI for enforcing commit message conventions
