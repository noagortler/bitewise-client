# Bitewise - Development Log

A weekly log of building Bitewise, my capstone project: a community-driven web app that helps people with food allergies find safe dishes at restaurants near them.

---

## June 12 to 26 - Planning

- Wrote and submitted the planning docs: project summary, database schema, endpoint plan, test plan, style guide, and an out of scope document with assumptions
- Settled the core data model: users, restaurants, and dishes as separate collections. Restaurants are keyed by Google Place ID and created automatically the first time someone logs a dish there. Dish counts are calculated at query time instead of stored
- Writing the assumptions doc forced decisions early. One example: restaurant details come from Google Places at the first dish log and are stored, which later shaped how restaurants get created automatically

**Learning:** the planning docs were useful the whole way through. More than once, a bug turned out to be the code not matching what the plan already said.

[screenshot: style guide colour palette]

---

## Week of June 30 - Backend foundation and client setup

**Back end**

- Set up the Express server, MongoDB connection, and the user, restaurant, and dish routes and controllers with Passport session auth and ownership middleware
- Updated the planning docs based on instructor feedback
- Issue: creating a test restaurant returned MongoDB error 16755, "Can't extract geo keys." Cause: I had briefly tried GeoJSON for restaurant locations before switching to plain lat and lng fields, and the leftover 2dsphere index (a special index for geographic data) still expected GeoJSON. Fix: dropped the old index in Atlas
- While in Atlas I found my cluster was inside a previous assignment's project, so I reorganized it

**Front end**

- Set up the client with Vite and React, routing, and the auth context
- Reworked the colour palette into design tokens (100 to 900 shades per colour) instead of one-off hex values

**Learning:** changing the schema in code does not clean up indexes in the database.

---

## Week of July 7 - Core pages and the map

**Front end**

- Built login and signup pages with responsive CSS, the map page with restaurant pins, city search, the restaurant page with dish cards and allergen filters, and the log a dish modal
- Issue: Google's built in InfoWindow popup renders outside the React tree, which broke React Router navigation when clicking through to a restaurant. Fix: replaced it with a custom popup positioned by pixel math
- Issue: the custom popup drifted off its pin when the map panned. Fix: a bounds listener that recalculates its position every time the map moves

**Back end**

- Issue: city autocomplete returned an empty array with no error. I logged Google's raw response and found the real message: I was calling a legacy Places API that newer Google Cloud projects cannot enable. Fix: migrated to Places API (New), which uses POST with the key in a header instead of GET with the key in the URL

```js
const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
  },
  body: JSON.stringify({ input: input, includedPrimaryTypes: ['(cities)'] }),
})
```

- Built the dish aggregation: a MongoDB pipeline that groups logs of the same dish name, counts them, and joins the most recent logger's name

**Learning:** when an API fails silently, log the raw response before guessing.

[screenshot: map page with first pins]

---

## Week of July 14 to 19 - Deployment, search, seed data, tests, and polish

**Front end**

- Finished the remaining pages: profile with dish history, settings with account, allergens, location and account deletion, protected routes, and the navbar avatar dropdown
- Issue: after making pin clicks pan the map, the popup jumped to its final position while the pin was still moving, because the map reports its destination instantly while the animation plays. Fix: removed the pixel math entirely and rendered the popup inside the map, attached to the restaurant's coordinates, so it stays on its pin at all times

**Deployment**

First Render deploy failed, so I reverted and redeployed step by step. The issues:

- Hardcoded localhost URLs do not exist in production. Fix: environment variables
- The frontend and backend are on different domains, so the browser refused to send the login cookie between them. Fix: cross site cookie options and trust proxy so secure cookies work behind Render's proxy
- Logout looked like it worked but the session stayed alive on the server. Fix: destroy the session server side and clear the cookie with the same options it was set with
- Going directly to /map in production showed a white screen because the server did not return the React app for every route. Fix: recreated the rewrite rule on Render

**Back end**

Restaurant search took the most iterations of any feature. The plan: one search bar showing restaurants already on Bitewise together with Google results.

- Issue: typing "sa" returned nothing while "san" returned unrelated results. First fix: a timing bug where a slow earlier response could replace a newer one, solved by ignoring responses that no longer match what is typed
- Deeper issue: Google's Text Search treats input as a full phrase and does not match partial words. Fix: switched to the Autocomplete endpoint, which is built for search as you type
- Still broken, so I logged Google's raw response. It showed the real problem: Autocomplete returns at most five suggestions, and for "sa" all five were islands and lakes, which my food filter then removed. Fix: request only food place types so all five slots go to food businesses

```js
const requestBody = {
  input: query.trim(),
  includedPrimaryTypes: ['restaurant', 'cafe', 'bakery', 'bar', 'meal_takeaway'],
}
```

- Issue: search was supposed to lean toward the user's location, but the coordinates never arrived. The settings page saved the default location as just a city name, while my schema plan said to convert it to lat and lng on save. Nothing had ever read the field, so it went unnoticed for weeks. Fix: settings now converts the city through my geocode endpoint before saving
- Rewrote the seed script to look up twenty real Metro Vancouver restaurants on Google Places at run time, so every pin has a real place ID, address, phone, and website
- Issue: the seed script froze silently because one Google request never finished. Fix: a ten second timeout on every request
- Issue: the script crashed when a restaurant already existed as a second copy in the database. Fix: merge the copies and move their dishes over before updating

**Testing**

- Wrote 78 automated tests across both repos: 62 backend tests with Vitest and Supertest, 16 frontend component tests with React Testing Library. All passed
- Backend tests run against a temporary MongoDB that exists only in memory during the run, so the real database is never touched, and Google calls are replaced with fake responses
- Used Vitest instead of the Jest because my server uses a newer JavaScript module style that Jest does not handle well according to research.