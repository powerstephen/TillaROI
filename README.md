# Tilla ROI Calculator — Branded (Vite + React + Tailwind)

## Local dev
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## Deploy to Vercel (recommended)
1) Push all files (including the **src/** and **public/** folders) to a GitHub repo.
2) In Vercel: New Project → Import GitHub repo → Deploy.
3) Vercel will detect Vite and serve the `dist/` output.

## Branding
- Colors are defined in `tailwind.config.js` under `theme.extend.colors.tilla`.
- Placeholder logo lives at `public/tilla-logo.svg`. Replace with your real logo using the same filename/path.
- Favicon is `public/favicon.svg`.

## Shareable links
- The app reads URL query params: `industry`, `vessels`, `hourlyCost`, `turnover`, `softwareReplaced`, `tillaCost`.
- Click **Share link** to copy a prefilled URL to clipboard.
