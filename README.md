<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a9270051-26ff-438a-ac46-4b2a5038302e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` (for Gemini) and `VITE_TMDB_API_KEY` (for TMDB) in [.env.local](.env.local).

Example `.env.local` entries:

```
GEMINI_API_KEY=your_gemini_api_key_here
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```
3. Run the app:
   `npm run dev`
