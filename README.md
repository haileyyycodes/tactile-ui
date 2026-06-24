# tactile-ui

tactile-ui is a monorepo scaffold for a shared UI library and a Next.js site.

## Structure

- `apps/site` — Next.js app using the App Router
- `packages/ui` — shared UI package skeleton
- `tsconfig.base.json` — shared TypeScript configuration
- `package.json` — root workspace definition and workspace scripts

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the site locally:
   ```bash
   npm run dev
   ```
3. Open the site at `http://localhost:3000`

## Notes

- Root scripts proxy workspace commands.
- Add shared components and exports in `packages/ui/src`.
- The site can import the library as `@tactile-ui/ui` once the package is built.
