# StudyConnect Frontend

Welcome to the **StudyConnect** frontend repository! StudyConnect helps students easily connect, collaborate, and organize effective study sessions.

This project is built with [Next.js](https://nextjs.org).   It uses **TypeScript** for type-safe development and **Tailwind CSS** for a utility-first styling approach.

## Getting Started

Follow these simple steps to run the project locally:

### Prerequisites

Ensure you have the following installed:

- **Node.js** version **20.10.0** or higher ([download Node.js](https://nodejs.org/))
- **npm** (automatically included with Node.js)

Check your installed Node.js version with:

```bash
node -v
```

### Production Build

Run the following commands to create an optimized production build:

```bash
npm install
npm run build
npm run start
```

The app will now be accessible at [http://localhost:3000](http://localhost:3000).

Alternatively for the relase [Docker](https://www.docker.com) is required.

The frontend image should be built with the following command:

```bash
docker build -t studyconnect-frontend -f docker/Dockerfile.frontend .  
```

After building it the image can be applied to a container with:

```bash
docker run -e NEXT_PUBLIC_API_URL="http://localhost:8080/swagger/index.html" -p 3000:3000 studyconnect-frontend
```

Please note that the [backend](https://github.com/StudyConnect-ZHAW/Backend) docker environment has to already be running for the interfaces to be available and proper mapping can be applied.

### Development Mode

For development with live updates and easy debugging:

```bash
npm install
npm run dev
```

If you get an error like
```
[Error: `turbo.createProject` is not supported by the wasm bindings.]
```
try deleting `node_modules` and `.next` and running `npm install` again to get rid of old settings or dependencies.

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app in real-time.

Start editing `app/page.tsx`, and your changes will auto-update instantly

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to optimize and load [Geist](https://vercel.com/font), a modern font provided by Vercel.

## Learn More

Enhance your Next.js skills with these resources:

- [Next.js Documentation](https://nextjs.org/docs) - Comprehensive guide to Next.js features.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
