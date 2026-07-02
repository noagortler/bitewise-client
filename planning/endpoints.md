# Bitewise - API Endpoints

## Overview

All endpoints are prefixed with `/api`. All request and response bodies use JSON. All protected routes require an active session via Passport.js.

---

## Auth

### POST /api/auth/register

Creates a new user account.

**Request body:**
```json
{
  "firstName": "Felix",
  "lastName": "Green",
  "email": "felix@email.com",
  "password": "password123",
  "allergens": ["gluten", "dairy"]
}
```

**Validation:**
- `firstName` - required, string
- `lastName` - required, string
- `email` - required, must be a valid email format, must be unique
- `password` - required, minimum 8 characters
- `allergens` - optional, array of strings, values must be from the fixed allergen list

**Response (201):**
```json
{
  "_id": "1",
  "firstName": "Felix",
  "lastName": "Green",
  "email": "felix@email.com",
  "allergens": ["gluten", "dairy"],
  "createdAt": "2026-06-26"
}
```

**Error responses:**
- `400` - missing or invalid fields
- `409` - email already in use

---

### POST /api/auth/login

Logs in an existing user and creates a session.

**Request body:**
```json
{
  "email": "felix@email.com",
  "password": "password123"
}
```

**Validation:**
- `email` - required, must be a valid email format
- `password` - required

**Response (200):**
```json
{
  "_id": "1",
  "firstName": "Felix",
  "lastName": "Green",
  "email": "felix@email.com",
  "allergens": ["gluten", "dairy"],
  "favourites": ["2", "5"],
  "defaultLocation": {
    "lat": 49.2827,
    "lng": -123.1207
  },
  "createdAt": "2026-06-26"
}
```

**Error responses:**
- `400` - missing fields
- `401` - invalid email or password

---

### POST /api/auth/logout

Logs out the current user and destroys the session.

**Request body:** none

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### PUT /api/auth/password

Updates the current user's password. Protected route.

**Request body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}
```

**Validation:**
- `currentPassword` - required, must match the user's current password
- `newPassword` - required, minimum 8 characters
- `confirmPassword` - required, must match `newPassword`

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

**Error responses:**
- `400` - missing fields, passwords do not match, or new password is too short
- `401` - current password is incorrect or user is not logged in

---

## Users

### GET /api/users/:id

Fetches a user's profile. Protected route.

**Request body:** none

**Response (200):**
```json
{
  "_id": "1",
  "firstName": "Felix",
  "lastName": "Green",
  "allergens": ["gluten", "dairy"],
  "favourites": ["2", "5"],
  "defaultLocation": {
    "lat": 49.2827,
    "lng": -123.1207
  },
  "createdAt": "2026-06-26"
}
```

**Error responses:**
- `401` - not logged in
- `404` - user not found

---

### PUT /api/users/:id

Updates a user's account details or allergen profile. Protected route. Users can only update their own account.

**Request body:**
```json
{
  "firstName": "Felix",
  "lastName": "Green",
  "email": "felix@newemail.com",
  "allergens": ["gluten", "dairy", "eggs"],
  "defaultLocation": {
    "lat": 49.2827,
    "lng": -123.1207
  }
}
```

**Validation:**
- All fields optional, only fields provided will be updated
- `email` - must be a valid email format if provided, must be unique
- `allergens` - array of strings, values must be from the fixed allergen list
- `defaultLocation` - must include both `lat` and `lng` if provided

**Response (200):**
```json
{
  "_id": "1",
  "firstName": "Felix",
  "lastName": "Green",
  "email": "felix@newemail.com",
  "allergens": ["gluten", "dairy", "eggs"],
  "defaultLocation": {
    "lat": 49.2827,
    "lng": -123.1207
  },
  "createdAt": "2026-06-26"
}
```

**Error responses:**
- `400` - invalid fields
- `401` - not logged in
- `403` - attempting to update another user's account
- `404` - user not found
- `409` - email already in use

---

### POST /api/users/:id/favourites/:restaurantId

Saves a restaurant to the user's favourites. Protected route. Users can only update their own favourites.

**Request body:** none

**Response (200):**
```json
{
  "_id": "1",
  "favourites": ["2", "5", "9"]
}
```

**Error responses:**
- `401` - not logged in
- `403` - attempting to update another user's favourites
- `404` - user or restaurant not found
- `409` - restaurant already in favourites

---

### DELETE /api/users/:id/favourites/:restaurantId

Removes a restaurant from the user's favourites. Protected route. Users can only update their own favourites.

**Request body:** none

**Response (200):**
```json
{
  "_id": "1",
  "favourites": ["2"]
}
```

**Error responses:**
- `401` - not logged in
- `403` - attempting to update another user's favourites
- `404` - user or restaurant not found

---

## Restaurants

### GET /api/restaurants

Fetches all restaurants within a given radius of a location. Used to populate map pins. Protected route.

**Query parameters:**
- `lat` - required, number
- `lng` - required, number
- `radius` - optional, number in meters, defaults to 5000

**Example request:**
```
GET /api/restaurants?lat=49.2827&lng=-123.1207&radius=5000
```

**Response (200):**
```json
[
  {
    "_id": "2",
    "googlePlaceId": "ChIJ...",
    "name": "The Naam",
    "address": "2724 W 4th Ave, Vancouver",
    "location": {
      "lat": 49.2663,
      "lng": -123.1924
    }
  }
]
```

**Error responses:**
- `400` - missing lat or lng
- `401` - not logged in

---

### GET /api/restaurants/:id

Fetches a single restaurant's full details. Protected route.

**Request body:** none

**Response (200):**
```json
{
  "_id": "2",
  "googlePlaceId": "ChIJ...",
  "name": "The Naam",
  "address": "2724 W 4th Ave, Vancouver",
  "phone": "604-738-7151",
  "website": "https://thenaam.com",
  "location": {
    "lat": 49.2663,
    "lng": -123.1924
  },
  "createdAt": "2026-06-26"
}
```

**Error responses:**
- `401` - not logged in
- `404` - restaurant not found

---

## Dishes

### GET /api/dishes

Fetches dishes by restaurant or by user depending on the query parameter. Protected route.

**Query parameters (use one):**
- `restaurantId` - fetch all dishes for a restaurant page
- `userId` - fetch all dishes logged by a user for the profile page

**Example requests:**
```
GET /api/dishes?restaurantId=2
GET /api/dishes?userId=1
```

**Response (200):**
```json
[
  {
    "_id": "3",
    "restaurantId": "2",
    "userId": "1",
    "dishName": "mushroom burger",
    "freeFrom": ["gluten", "dairy"],
    "modifications": ["no bun"],
    "otherModifications": "",
    "createdAt": "2026-06-26",
    "logCount": 4,
    "user": {
      "firstName": "Felix",
      "lastName": "Green"
    }
  }
]
```

**Notes:**
- `logCount` is the number of users who have logged the same `dishName`, `freeFrom`, and `modifications` at the same restaurant, computed via aggregation
- `user` is populated from the Users collection so the frontend can display the display name on each dish card
- Results are sorted by `createdAt` descending (most recent first)
- Cards with no modifications display "None" in the modifications area

**Error responses:**
- `400` - missing query parameter
- `401` - not logged in

---

### POST /api/dishes

Logs a new dish. Also creates the restaurant document if it does not already exist. Protected route.

**Request body:**
```json
{
  "restaurant": {
    "googlePlaceId": "ChIJ...",
    "name": "The Naam",
    "address": "2724 W 4th Ave, Vancouver",
    "phone": "604-738-7151",
    "website": "https://thenaam.com",
    "location": {
      "lat": 49.2663,
      "lng": -123.1924
    }
  },
  "dish": {
    "dishName": "Mushroom Burger",
    "freeFrom": ["gluten", "dairy"],
    "modifications": ["no bun"],
    "otherModifications": ""
  }
}
```

**Validation:**
- `restaurant.googlePlaceId` - required, string
- `restaurant.name` - required, string
- `restaurant.address` - required, string
- `restaurant.location.lat` - required, number
- `restaurant.location.lng` - required, number
- `dish.dishName` - required, string, normalized to lowercase and trimmed on save
- `dish.freeFrom` - required, array, must contain at least one value from the fixed allergen list
- `dish.modifications` - optional, array of strings, values must be from the fixed modification chip list
- `dish.otherModifications` - optional, string

**Response (201):**
```json
{
  "_id": "3",
  "restaurantId": "2",
  "userId": "1",
  "dishName": "mushroom burger",
  "freeFrom": ["gluten", "dairy"],
  "modifications": ["no bun"],
  "otherModifications": "",
  "createdAt": "2026-06-26"
}
```

**Error responses:**
- `400` - missing or invalid fields
- `401` - not logged in

---

### PUT /api/dishes/:id

Edits an existing dish entry. Users can only edit their own dishes. Protected route.

**Request body:**
```json
{
  "dishName": "Mushroom Burger",
  "freeFrom": ["gluten", "dairy", "eggs"],
  "modifications": ["no bun", "no cheese"],
  "otherModifications": ""
}
```

**Validation:**
- All fields optional, only fields provided will be updated
- `dishName` - string, normalized to lowercase and trimmed on save
- `freeFrom` - array, values must be from the fixed allergen list
- `modifications` - array of strings, values must be from the fixed modification chip list
- `otherModifications` - string

**Response (200):**
```json
{
  "_id": "3",
  "restaurantId": "2",
  "userId": "1",
  "dishName": "mushroom burger",
  "freeFrom": ["gluten", "dairy", "eggs"],
  "modifications": ["no bun", "no cheese"],
  "otherModifications": "",
  "createdAt": "2026-06-26"
}
```

**Error responses:**
- `400` - invalid fields
- `401` - not logged in
- `403` - attempting to edit another user's dish
- `404` - dish not found

---

### DELETE /api/dishes/:id

Deletes a dish entry. Users can only delete their own dishes. Protected route.

**Request body:** none

**Response (200):**
```json
{
  "message": "Dish deleted successfully"
}
```

**Error responses:**
- `401` - not logged in
- `403` - attempting to delete another user's dish
- `404` - dish not found

---

## Data Workflows

### Workflow 1: User logs a dish

This workflow covers the most complex flow in the app, from restaurant search to dish saved.

**Step 1:** User searches for a restaurant in the navbar.

**Step 2:** Frontend calls Google Places API directly and returns a list of matching restaurants by proximity. This does not touch the backend.

**Step 3:** User selects a restaurant from the results. Frontend navigates to the restaurant page.

**Step 4:** User hits "Log a dish" on the restaurant page. A popup form appears with the dish fields.

**Step 5:** User fills in the form and submits. Frontend sends `POST /api/dishes` with the restaurant data and dish data combined in one request body.

**Step 6:** Backend receives the request and checks if a restaurant with that `googlePlaceId` already exists in MongoDB.

- If the restaurant does NOT exist: backend creates a new Restaurant document, then saves the Dish document linked to it.
- If the restaurant DOES exist: backend skips restaurant creation and saves the Dish document directly.

**Step 7:** Backend returns the new Dish document with a 201 status. Frontend updates the restaurant page to show the new entry.

---

### Workflow 2: User loads the map

This workflow covers how the map populates with restaurant pins when a user opens the app.

**Step 1:** User logs in and lands on the map page.

**Step 2:** Frontend calls `navigator.geolocation` to get the user's location. The browser only asks for permission the first time the user loads the map. After that the browser remembers the choice and no prompt appears on subsequent visits.

- If permission was GRANTED: frontend uses the current lat/lng.
- If permission was DENIED: frontend checks for `defaultLocation` on the user profile.
  - If a default location is saved: frontend uses those coordinates.
  - If no default location is saved: frontend falls back to a hardcoded default location.

**Step 3:** Frontend sends `GET /api/restaurants?lat=...&lng=...&radius=5000` to the backend.

**Step 4:** Backend queries MongoDB for all restaurants within the given radius and returns an array of restaurant documents with their location data.

**Step 5:** Frontend passes the results to the Google Maps JavaScript API and places a pin on the map for each restaurant.

**Step 6:** If the user toggles the allergen filter, the frontend re-renders the pins to show only restaurants that have at least one dish matching the user's allergen profile.

---

## Google API Error Handling

Because Bitewise depends on Google Maps JavaScript API and Google Places API, the frontend must handle any API failures rather than crashing or showing raw errors.

### Google Places API unavailable or returns no results

Display a message in the search results area:

"We could not find any restaurants matching your search. Please try again."

Do not show a raw error or allow the page to crash.

### Google Maps JavaScript API fails to load

Display a message in place of the map:

"The map is temporarily unavailable. Please try again later."

Provide the city search input and allergen filter as fallbacks so the user is not completely blocked.

### User denies location access

Do not fail or show an error. Fall back to the user's saved default location if one exists, or a hardcoded default location if not. The city search input above the map allows the user to manually set their location at any time.

### Restaurant not found in Google Places

If a search returns no results for a restaurant name, display:

"No restaurants found. Try a different search term."

### General rule

All Google API calls on the frontend should be wrapped in try/catch blocks. Errors should be caught and displayed as user-friendly messages. The application should never crash or show a raw error message to the user.