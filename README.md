# Scotland for £0

A phone-friendly checklist of places in Scotland you can reach from Edinburgh on free under-22 (Young Scot) buses. Animal spots come first. It also has multi-day routes, hostel prices and student discounts.

- `index.html`: the site (no build step)
- `api/ticks.js`: cloud save for ticks (Vercel function)
- `animals.js`: every animal, its season, its photo and where to see it
- `images/`: photos from Wikimedia Commons (credits in `images/credits.js` and the Info tab)
- `data.js`: all places, routes and hostel prices. Edit this to add or fix places.

## Deploy on Vercel
Import this repo in Vercel, set Framework Preset to **Other**, and leave the build command empty.

## Cloud sync with a code
Tap **☁︎ Sync** on the Today screen and type a shared code (for example `YOURCODE`) on each phone. Every tick then saves to the cloud, so any phone with the same code sees the same checklist.

One-time setup on Vercel (free):
1. Open the project in Vercel, go to **Storage**, then **Create Database** and choose **Upstash for Redis** (free plan).
2. Connect it to this project. Vercel adds the `KV_REST_API_URL` and `KV_REST_API_TOKEN` environment variables for you.
3. Redeploy the project (Deployments, then Redeploy).

The API lives in `api/ticks.js`. Anyone who knows a code can read and change its ticks, so keep the code private.

Bus routes, times and prices are approximate. Check Traveline Scotland before you travel.
