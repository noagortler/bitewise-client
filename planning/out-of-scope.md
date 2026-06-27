# Bitewise - Out of Scope and Assumptions

## Assumptions

**Location access**
The app requests browser location access on load via `navigator.geolocation`. The browser only asks for permission the first time the user loads the map and remembers their choice after that. If the user grants access, the map centers on their current location. If the user denies access, the map defaults to a hardcoded starting location. A city or area search field sits above the map so users can manually set their location context at any time. The navbar search is for finding restaurants only. Users can also save a default city in settings, which gets converted to lat/lng coordinates via Google Places API and stored on their profile so the map always opens somewhere relevant to them.

**Positive experiences only**
Bitewise is not a review platform. The intention is for users to share positive, allergy-aware dining experiences with the community.

**Safety disclaimer**
Users are assumed to always communicate their allergies to restaurant staff before ordering. A dish logged in Bitewise means someone ate it safely, it does not guarantee safety for every user in every circumstance.

**Allergen confirmation**
Users only tag allergens they personally confirmed with restaurant staff. They are not expected to tag all allergens a dish may naturally be free from. If someone with a gluten and dairy allergy confirmed those two allergens, they only tag gluten free and dairy free, regardless of what other allergens the dish may not contain.

**Modification standardization**
Modification descriptions are free text but users are nudged toward brief, consistent language via a UI hint. A fixed set of common modification chips is provided to encourage consistency. A free text field is available for modifications not covered by the chips. Standardized modification tags beyond the current chip list are a future feature.

**Dish logging timing**
Users are assumed to log dishes shortly after their visit. There is no date of visit field - the `createdAt` timestamp on the dish document is used as the proxy for when the experience occurred.

**Restaurant data**
Restaurant information (name, address, phone, website, coordinates) is sourced from Google Places API at the time of first dish log and stored in MongoDB. Bitewise does not sync with Google Places after that point, so restaurant details may become outdated over time.

**Allergen list**
The allergen list is fixed for MVP. Users cannot add custom allergens. The list can be expanded in a future release.

---

## Out of Scope (Future Features)

**Forgot password**
Password reset via email is not supported in MVP. This would require an email service such as SendGrid or Nodemailer. Users who forget their password will need to create a new account.

**Photo uploads**
Users cannot upload photos with their dish entries in MVP. This would require a file storage service and adds meaningful complexity outside the scope of this build.

**Extended allergen list**
The full list of recognized allergens including mustard, celery, lupin, molluscs, and sulphites is not supported in MVP. These can be added in a future release.

**Mobile app**
Bitewise is a web app only for MVP. A React Native mobile version is a natural next step given the on-the-go nature of the use case.

**Verified restaurant accounts**
Restaurant owners cannot claim or manage their listing in MVP. A verified account system would allow owners to add accurate menu and allergen information directly.

**Notifications**
Users cannot receive notifications when a new dish is logged at a restaurant in MVP. This would be useful for users who want to know when a place they visit gets new community entries.