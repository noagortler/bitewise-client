# Bitewise - Testing Edge Cases

## Auth

**Registration**
- User submits the form with a missing required field (firstName, lastName, email, password) - returns 400
- User registers with an email that is already in use - returns 409
- User registers with a password shorter than 8 characters - returns 400
- User registers with an invalid email format (e.g. "notanemail") - returns 400
- User registers with no allergens selected - account created successfully, returns 201
- User submits the registration form twice quickly - no duplicate accounts created, second request returns 409

**Login**
- User logs in with the correct email but wrong password - returns 401
- User logs in with an email that does not exist - returns 401
- User logs in with missing email or password fields - returns 400
- User attempts to access a protected route without being logged in - returns 401

**Logout**
- User logs out and then attempts to access a protected route - returns 401
- User logs out and then logs back in - returns 200

**Change password**
- User submits with missing current password, new password, or confirm password - returns 400
- User submits incorrect current password - returns 401
- User submits a new password shorter than 8 characters - returns 400
- User submits a new password and confirm password that do not match - returns 400
- User successfully changes their password and logs in with the new password - returns 200

---

## Users

**Profile fetch**
- User fetches their own profile - returns full profile data
- User fetches a profile with an ID that does not exist - returns 404

**Profile update**
- User updates their email to one that is already in use by another account - returns 409
- User updates their email to an invalid format - returns 400
- User updates their allergens with a value not in the fixed allergen list - returns 400
- User updates their `defaultLocation` with only `lat` and no `lng` - returns 400
- User updates their profile with no fields provided - returns 400 or ignore gracefully
- User attempts to update another user's profile - returns 403

**Favourites**
- User saves a restaurant to favourites
- User saves the same restaurant to favourites twice - returns 409
- User removes a restaurant from favourites that is not in their favourites - returns 404
- User attempts to update another user's favourites - returns 403
- User saves a restaurant ID that does not exist - returns 404

---

## Restaurants

**Map query**
- Request is missing `lat` or `lng` - returns 400
- Request is made with a `radius` of 0 - returns an empty array, not an error
- Request returns no restaurants within the radius - returns an empty array
- User denies location access and has no `defaultLocation` set - map falls back to hardcoded default

**Restaurant fetch**
- Restaurant ID does not exist - returns 404
- Restaurant has no dishes logged yet - returns the restaurant document with no dishes

---

## Dishes

**Logging a dish**
- User submits the form with no `dishName` - returns 400
- User submits the form with an empty `freeFrom` array - returns 400
- User submits a `freeFrom` value not in the fixed allergen list - returns 400
- User submits a `modifications` value not in the fixed modification chip list - returns 400
- User logs a dish at a restaurant that does not yet exist in MongoDB - restaurant created automatically
- User logs a dish at a restaurant that already exists in MongoDB - restaurant not duplicated
- Two users log a dish at the same restaurant at the same time - both dishes saved, restaurant only created once
- `dishName` is submitted with extra whitespace or mixed capitalisation (e.g. " Mushroom Burger ") - normalized to "mushroom burger" before saving

**Dish count aggregation**
- Two users log the same dish name, same freeFrom, and same modifications at the same restaurant - `logCount` returns 2
- Two users log the same dish name but different modifications at the same restaurant - treated as separate entries
- Two users log slightly different capitalisations of the same dish (e.g. "mushroom burger" and "Mushroom Burger") - counts as the same dish after normalization
- Two users log the same dish name at different restaurants - counts separate per restaurant

**Editing a dish**
- User edits a dish they did not log - returns 403
- User edits a dish with an invalid `freeFrom` value - returns 400
- User edits a dish with an invalid `modifications` value - returns 400
- User edits a dish that does not exist - returns 404
- User submits an edit with no fields provided - returns 400 or ignore gracefully
- User edits `dishName` with mixed capitalisation - normalized before saving

**Deleting a dish**
- User deletes a dish they did not log - returns 403
- User deletes a dish that does not exist - returns 404
- User deletes a dish - dish count for that dish name at that restaurant decreases

**Fetching dishes**
- Request is missing both `restaurantId` and `userId` - returns 400
- Restaurant has dishes logged by multiple users - all dishes returned sorted by most recent
- User has logged no dishes yet - returns an empty array
- Allergen filter is applied with an allergen not in the fixed list - returns 400 or empty array
- Dish with no modifications selected - card displays "None" in the modifications area

---

## Data Integrity

- A restaurant is deleted from MongoDB manually - dishes referencing that restaurant handled gracefully (out of scope for MVP but worth noting)
- A user account is deleted - dishes logged by that user handled gracefully (out of scope for MVP but worth noting)
- `googlePlaceId` is submitted with leading or trailing whitespace - trimmed before the duplicate check runs
- Two simultaneous requests to create the same restaurant (same `googlePlaceId`) - only one restaurant document created