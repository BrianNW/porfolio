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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Using Oakes Grotesk Semi Bold as the Site Font

This project is configured to use the Oakes Grotesk Semi Bold font as the default site font. **You must provide the web font files** (WOFF/WOFF2) due to licensing restrictions. Follow these steps:

1. **Obtain the font files**: Purchase or download `OakesGrotesk-SemiBold.woff2` and `OakesGrotesk-SemiBold.woff` from the official foundry or your license provider.
2. **Add the font files**: Place them in the `public/fonts` directory:

   ```
   public/fonts/OakesGrotesk-SemiBold.woff2
   public/fonts/OakesGrotesk-SemiBold.woff
   ```

3. **Font-face CSS**: The following is already (or should be) added to `src/app/globals.css`:

   ```css
   @font-face {
     font-family: 'Oakes Grotesk';
     src: url('/fonts/OakesGrotesk-SemiBold.woff2') format('woff2'),
          url('/fonts/OakesGrotesk-SemiBold.woff') format('woff');
     font-weight: 600;
     font-style: normal;
     font-display: swap;
   }
   html, body {
     font-family: 'Oakes Grotesk', Arial, sans-serif;
     font-weight: 600;
   }
   ```

4. **Tailwind config**: Optionally, extend your `tailwind.config.js` to use the custom font as the default sans font:

   ```js
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         fontFamily: {
           sans: ['Oakes Grotesk', 'Arial', 'sans-serif'],
         },
       },
     },
     // ...rest of config
   };
   ```

5. **Restart your dev server** after adding the font files.

> **Note:** The font will not display unless you provide the actual font files in the correct directory.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
