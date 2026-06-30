# Bitewise

A community-driven web app that helps people with food allergies find safe dishes at restaurants near them.

---

## Project Overview

I recently developed food allergies, and dining out has not been the same since. Many of us look at a restaurant menu before deciding whether to dine there. That used to be me too, but now instead of looking for what sounds good, I am looking for what is safe. And even after reviewing the menu ahead of time, you cannot know for sure until you confirm with the staff, because menus do not list every ingredient. Showing up to a restaurant unsure whether they can accommodate your allergies without a fuss is an uncomfortable feeling.

With food allergies on the rise, I know I am not alone in this. Bitewise is the app I wanted: a place where people can share the dishes they have eaten safely, so others with the same allergies can dine out with a little more confidence.

---

## Features

- **Allergen profile** - on sign up, users select their allergens from a list of the nine most common: gluten, dairy, eggs, peanuts, tree nuts, soy, sesame, fish, and shellfish
- **Interactive map** - loads centered on the user's current location with pins marking restaurants that have dishes logged in Bitewise
- **Allergen filter** - filter map pins by individual allergens from your profile
- **Restaurant search** - search for a specific restaurant or explore a different area
- **Restaurant page** - view all logged dishes for a restaurant, filtered by allergen, sorted by most recent. Each dish shows a count of how many people have logged it safely
- **Dish logging** - log a safe dish with the dish name, allergens it is free of, and modifications selected from a standardized chip list
- **Favourite restaurants** - save restaurants you trust and access them quickly from your profile
- **Profile page** - view your allergen profile, your favourite restaurants, and a personal history of every dish you have logged
- **Settings** - update your account details, password, allergen profile, and default location

---

## Technologies Used

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Material UI |
| Backend | Node.js, Express, JavaScript |
| Database | MongoDB |
| Authentication | Passport.js |
| Map rendering | Google Maps JavaScript API |
| Restaurant search | Google Places API |
| Fonts | Nunito, Outfit (Google Fonts) |

---

## Installation Instructions

-

---

## Usage

-

---

## Testing

### Backend (Jest + Supertest)

Used to test Express API endpoints and backend business logic.

1. Install dependencies:
```
npm install --save-dev jest supertest
```

2. Add jest config to `package.json`:
```json
"jest": {
  "testEnvironment": "node"
}
```

3. Create a `__tests__` folder in the root of the server directory (`__` = double underscore, also called dunder)

4. Create a test file inside it: `app.test.js`

5. To run tests:
```
npm test
```

### Frontend (Vitest + React Testing Library)

Used to test React components and frontend behavior.

1. Install dependencies:
```
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

2. Add test script to `package.json`:
```json
"scripts": {
  "preview": "vite preview",
  "test": "vitest"
}
```

3. Create `vite.config.js` in the root of the client directory and add the following:
```js
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
```

4. Create `setupTests.js` in the `src` folder

5. Create test files in the `src` folder using the naming convention `filename.test.js`

---

## Future Improvements

- Forgot password via email reset
- Photo uploads on dish entries
- Extended allergen list
- Mobile app version via React Native
- Verified restaurant owner accounts
- Notifications when a new dish is logged at a saved restaurant