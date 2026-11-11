# Stillwaters

A guided daily prayer app: onboarding, a guided player (breathing sun, spoken guidance, ambient tone),
streaks, journal, a 16-prayer library, and a membership paywall. Built with React, TypeScript and Vite.

## Run it
    npm install
    npm run dev        # local preview
    npm run build      # makes dist/index.html (one file)

## Put it online (free)
Drag the `deploy` folder onto https://app.netlify.com/drop or push this repo to Vercel/Cloudflare Pages.

## What is real and what is a placeholder
Real: onboarding, today's prayer by focus, guided player, streaks, journal, library, settings, saving on the device.
Placeholder:
- Payments. "Start 7-day free trial" only flips a local flag. Connect RevenueCat (iOS/Android) and Stripe (web).
- Voice. Narration uses the device's built-in voice. Replace with recorded audio (see src/Player.tsx, the `say` steps).
- Accounts and sync. Everything lives in localStorage. Add Supabase auth + tables for journal and completions.
- Reminders. Need the native app (Expo) or web push.
- Content. src/content.ts holds 16 prayers. Scripture is KJV (public domain). Reflections and prayers are drafts
  and must be reviewed by your pastor advisor before launch.

## Next steps
1. Pastor review of src/content.ts
2. Real voice recordings for the first 7 prayers
3. Supabase accounts + RevenueCat/Stripe
4. Wrap as a native app with Expo or Capacitor and submit to the App Store and Google Play
