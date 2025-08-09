# Tilla ROI Calculator (Vite + React + Tailwind)

## Local dev
```
npm install
npm run dev
```

## Production build
```
npm run build
npm run preview
```

## Deploy to Vercel
- Push this folder to a GitHub repo
- In Vercel: New Project → import repo → Deploy
- If you see build errors, ensure your project has:
  - `@vitejs/plugin-react` in devDependencies
  - `vite.config.js` using the plugin
  - Node 18+ (declared in `package.json` → `engines`)

## Notes
- Tailwind is preconfigured
- Output directory is `dist/`
