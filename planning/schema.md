# Bitewise - Database Schema

## Overview

Bitewise uses MongoDB with three collections: Users, Restaurants, and Dishes. Dishes is the central collection that connects Users and Restaurants through references. There is no direct relationship between Users and Restaurants, they are only connected through Dishes.

---

## Collections

### Users

Stores account information and allergen profile for each user.

```json
{
  "_id": "ObjectId",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string (hashed)",
  "allergens": ["gluten", "dairy"],
  "favourites": ["ObjectId", "ObjectId"],
  "defaultLocation": {
    "lat": "number",
    "lng": "number"
  },
  "createdAt": "date"
}
```

**Notes:**
- `email` is used for login, must be unique
- `password` is hashed before storage, never stored as plain text. Users can update their password via the change password section in settings
- `allergens` is an array of strings from the fixed allergen list: gluten, dairy, eggs, peanuts, tree nuts, soy, sesame, fish, shellfish
- `favourites` is an array of Restaurant ObjectIds representing restaurants the user has saved
- Display name is computed on the frontend as `firstName + lastName[0]` (e.g. "Felix G")
- `defaultLocation` is optional and only populated if the user sets a default city in settings. The city name is converted to lat/lng coordinates via Google Places API when the user saves their settings

---

### Restaurants

Stores restaurant information sourced from the Google Places API. A restaurant document is created the first time a user logs a dish at that location.

```json
{
  "_id": "ObjectId",
  "googlePlaceId": "string",
  "name": "string",
  "address": "string",
  "phone": "string",
  "website": "string",
  "location": {
    "lat": "number",
    "lng": "number"
  },
  "createdAt": "date"
}
```

**Notes:**
- `googlePlaceId` is the unique identifier from Google Places API, used to prevent duplicate restaurant entries
- `location` stores lat/lng coordinates so the Google Maps JavaScript API can place pins without an additional API call
- Before creating a new restaurant document, the backend checks if a document with the same `googlePlaceId` already exists

---

### Dishes

Stores each dish entry logged by a user. References both the User and Restaurant collections.

```json
{
  "_id": "ObjectId",
  "restaurantId": "ObjectId",
  "userId": "ObjectId",
  "dishName": "string (normalized to lowercase, trimmed)",
  "freeFrom": ["gluten", "dairy"],
  "modifications": ["no bun", "no cheese"],
  "otherModifications": "string (optional)",
  "createdAt": "date"
}
```

**Notes:**
- `restaurantId` references the Restaurants collection
- `userId` references the Users collection
- `dishName` is normalized to lowercase and trimmed on save so variations in capitalization or spacing count as the same dish for aggregation purposes
- `freeFrom` is an array of strings from the fixed allergen list. Users only tag allergens they personally confirmed with restaurant staff, not all allergens the dish may be free from
- `modifications` is an array of strings selected from a fixed list of chip options: no bun, no cheese, no sauce, no dressing, no butter, no nuts, no croutons, no mayo, no gravy, no garnish, gluten free bun substitution, dairy free substitution
- `otherModifications` is an optional free text field for modifications not covered by the chip list. UI hints guide users toward brief descriptions (e.g. "no tahini")
- Dishes with the same `dishName`, `freeFrom`, and `modifications` at the same restaurant are considered the same dish for aggregation purposes. The log count increases rather than creating a new card
- Multiple dishes can be logged per user per restaurant
- Only positive, safe experiences are logged, there is no negative review or rating system

---

## Relationships

```
Users ------------- Dishes ------------- Restaurants
      (one to many)        (many to one)
```

**Users to Dishes (one to many):** one user can log many dishes, but each dish belongs to only one user. The Dish document stores a `userId` reference to track who logged it.

**Dishes to Restaurants (many to one):** many dishes can belong to the same restaurant, but each dish belongs to only one restaurant. The Dish document stores a `restaurantId` reference to track which restaurant the dish was logged at.

**Users to Restaurants:** there is no direct relationship between Users and Restaurants. They are only connected through Dishes.

---

## Allergen List (MVP)

The following allergens are supported in the MVP. Both `allergens` on Users and `freeFrom` on Dishes are constrained to these values:

- Gluten
- Dairy
- Eggs
- Peanuts
- Tree nuts
- Soy
- Sesame
- Fish
- Shellfish

---

## Modification Chip List (MVP)

The following modifications are available as chips on the log a dish form. The `modifications` field on Dishes is constrained to these values:

- No bun
- No cheese
- No sauce
- No dressing
- No butter
- No nuts
- No croutons
- No mayo
- No gravy
- No garnish
- GF substitution
- Dairy free substitution