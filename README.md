This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font).

## Contact Form Email Setup

The contact form now sends mail through an SMTP server from the Next.js app route at `src/app/api/contact/route.ts`.

When deployed to GitHub Pages, the site is exported as static files, so that server route is not available. In the Pages build, the contact form falls back to a `mailto:` action and uses `NEXT_PUBLIC_CONTACT_TO_EMAIL`.

1. Copy `.env.example` to `.env.local`.
2. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASS` for your mail provider.
3. Set `CONTACT_TO_EMAIL` to the inbox that should receive portfolio inquiries.
4. Set `CONTACT_FROM_EMAIL` to the sender address your SMTP provider allows.
5. Set `CONTACT_CAPTCHA_SECRET` to any long random string so the built-in captcha token can be signed securely.

Use these variables in `.env.local`:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=mailer@example.com
SMTP_PASS=replace-with-your-smtp-password
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=mailer@example.com
CONTACT_CAPTCHA_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_CONTACT_TO_EMAIL=you@example.com
```

`CONTACT_TO_EMAIL` is the inbox that receives the message.
`CONTACT_FROM_EMAIL` must be a sender address your SMTP provider accepts.
If your provider does not require authentication, leave both `SMTP_USER` and `SMTP_PASS` unset.
`CONTACT_CAPTCHA_SECRET` is used to sign the simple math captcha served by the contact form API.
`NEXT_PUBLIC_CONTACT_TO_EMAIL` is only needed for the GitHub Pages static fallback.

If any of those values are missing or incorrect, the form will fail and the UI will show the returned error message instead of pretending the email was sent.

## GitHub Pages Deployment

This repo includes a GitHub Actions workflow that deploys the site to GitHub Pages as a static export.

1. In GitHub, enable Pages and set the source to GitHub Actions.
2. Add a repository variable named `CONTACT_TO_EMAIL` if you want the Pages deployment to use the `mailto:` contact fallback.
3. Push to `main` and the workflow will build and deploy automatically.

The Pages build uses `output: "export"`, computes the correct `basePath` from the repository name, and switches the contact form to static `mailto:` mode because GitHub Pages cannot run the local Next.js API route.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
