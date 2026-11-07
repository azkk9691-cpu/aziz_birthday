# Azizbek — Birthday invitation

React + Vite, Tailwind CSS, Motion, GSAP, React Three Fiber, Drei and Three.js.

## Local development

```sh
npm install
npm run dev
```

On PowerShell with script restrictions, use `npm.cmd` instead of `npm`.

## Deployment

Run `npm run build`. Deploy `dist/` as a static website. On Vercel choose the Vite preset, build command `npm run build`, output `dist`. No environment secrets are needed.

## Configuration

Edit `src/config.js`. The event target includes the explicit Tashkent UTC+05 offset. Change `target` when the actual event start time is known. The supplied birthday MP3 is served from public/media/happy-birthday.mp3. Change localAudio to replace it. The procedurally lit 3D scene is the default background.

The introduction runs for 5,000 ms after opening, followed by a 650 ms reveal. Browser scheduling in background tabs may delay the reveal. Synthesized quiet clock ticks require no external asset. Reduced-motion preferences disable continuous visual movement.

The supplied MP3 plays through a native HTML audio element after the intro. No YouTube script, video player or remote audio service is loaded. Automatic playback may be blocked; visitors can use the play button. Pause and mute controls remain available.

The supplied map coordinates are used without an invented venue or street address. Google Fonts and Google Maps require internet; serif/sans-serif system fonts serve as fallbacks.

## Verification

`npm test` validates timezone conversion, countdown arithmetic and zero clamping. `npm run build` validates the production bundle.

## Persistent guest comments

The hosted Worker exposes GET and POST /api/comments. D1 binding DB stores names, messages, server timestamps and idempotency keys. The schema is migrated from drizzle/0000_guest_comments.sql during deployment. Comments survive reloads, devices and deployments; the UI renders stored text without HTML. Cursor pagination keeps all older wishes accessible. Vite alone previews the frontend; the comments API requires the deployed Worker with D1. For Vercel, supply an equivalent persistent API/database; the previous static-only deployment configuration does not support shared comments.
