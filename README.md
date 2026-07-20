# Bitewise

A community-driven web app that helps people with food allergies find safe dishes at restaurants near them.

**Live app:** https://bitewise-app.onrender.com
**Server repo:** https://github.com/noagortler/bitewise-server

---

## Project Overview

I recently developed food allergies, and dining out has not been the same since. Many of us look at a restaurant menu before deciding whether to dine there. That used to be me too, but now instead of looking for what sounds good, I am looking for what is safe. And even after reviewing the menu ahead of time, you cannot know for sure until you confirm with the staff, because menus do not list every ingredient. Showing up to a restaurant unsure whether they can accommodate your allergies without a fuss is an uncomfortable feeling.

With food allergies on the rise, I know I am not alone in this. Bitewise is the app I wanted: a place where people can share the dishes they have eaten safely, so others with the same allergies can dine out with a little more confidence.

---

## Features

- **Allergen profile** - on sign up, users select their allergens from a list of the nine most common: gluten, dairy, eggs, peanuts, tree nuts, soy, sesame, fish, and shellfish
- **Interactive map** - opens at the user's default location and loads pins for every restaurant with dishes logged in Bitewise, wherever the map is moved. The map remembers where you were while you browse and resets to your default location each new session
- **Allergen filter** - the user's saved allergens are applied automatically. Restaurants with dishes free from the selected allergens show teal pins, the rest show blue
- **Restaurant search** - search restaurants already on Bitewise alongside live Google Places results, biased to where you are on the map. Selecting a Google result lets you log its first dish and adds the restaurant to Bitewise
- **Restaurant page** - view all logged dishes for a restaurant, sorted by most logged. Dishes matching your allergen filter are highlighted and sorted to the top. Each dish shows a count of how many people have logged it safely
- **Dish logging** - log a safe dish with the dish name, allergens it is free of, and modifications selected from a standardized chip list. Your own dishes can be edited or deleted from your profile
- **Favourite restaurants** - save restaurants you trust and access them quickly from your profile
- **Profile page** - view your allergen profile, your favourite restaurants, and a personal history of every dish you have logged
- **Settings** - update your account details, password, allergen profile, and default location

---

## Technologies Used

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript, Vite, Material UI |
| Backend | Node.js, Express, JavaScript |
| Database | MongoDB |
| Authentication | Passport.js |
| Map rendering | Google Maps JavaScript API |
| Restaurant search | Google Places API |
| Testing | Vitest, React Testing Library, Supertest |
| Deployment | Render |
| Fonts | Nunito, Outfit (Google Fonts) |

---

## Installation Instructions

1. Clone the repo and install dependencies:
```
cd client
npm install
```

2. Create a `.env` file in `client/` with:
```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_browser_key
```
The Google Maps key needs the Maps JavaScript API enabled. The backend must also be running, see the [server repo](https://github.com/noagortler/bitewise-server) for its setup.

3. Start the dev server:
```
npm run dev
```

---

## Usage

To see the app with data, use the Vancouver area:

1. Register an account and pick a few allergens (gluten shows the filters well)
2. Search for Vancouver, BC on map. Alternatively, go to settings, then location, and set your default location to Vancouver, BC, and open the map.

The seeded restaurants are concentrated around Richmond, Vancouver, and Burnaby, BC.

About the data: every restaurant on the map is a real Metro Vancouver business with live details (address, phone, website) pulled from the Google Places API. The dish logs and demo users are seeded test data for display purposes only, showing how the app looks with an active community. The dishes are plausible for each restaurant but were not actually eaten and logged, so they should not be relied on for real allergy decisions. Any signed in user can add real restaurants anywhere by searching for them and logging a dish.

---

## How the Community Data Works

- **Positive experiences only** - Bitewise is not a review platform. Users share dishes they ate safely, not complaints or ratings
- **Confirmed allergens only** - a dish tagged gluten free means someone personally confirmed that with restaurant staff. Users only tag the allergens they confirmed, so the absence of a tag does not mean a dish contains that allergen
- **Safety disclaimer** - a logged dish means someone ate it safely, it does not guarantee safety for every person in every circumstance. Users should always communicate their allergies to restaurant staff before ordering
- **Restaurant details** - restaurant information is pulled from Google Places when the first dish is logged there and stored in the database, so details may become outdated over time

---

## Testing

Frontend tests run with Vitest and React Testing Library: 16 component tests covering the dish modals (validation, chip toggling, mocked submits) and protected route logic. Test files live in `src/tests/`.

```
npm run test:run
```

The backend has its own suite of 62 tests with Vitest and Supertest against an in-memory MongoDB. See the [server repo](https://github.com/noagortler/bitewise-server) and its `testing.md` for the full case list.

---

## Future Improvements

- Forgot password via email reset
- Photo uploads on dish entries
- Extended allergen list
- Mobile app version via React Native
- Verified restaurant owner accounts
- Notifications when a new dish is logged at a saved restaurant
- Richer restaurant details from Google Places, such as hours, price level, and photos
- Smarter dish matching, using AI to recognize when differently worded entries describe the same dish
- Natural language dish search, such as "gluten free ramen near me", parsed into a search across dishes rather than restaurant names