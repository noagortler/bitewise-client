# Bitewise - Project Summary

## Goal

Bitewise is a community-driven web app that helps people with food allergies find safe dishes at restaurants near them. Users log dishes they have eaten safely, and others with the same allergies can find those restaurants on a map and see what to order. The goal is to give people with food allergies more confidence when dining out, backed by real experiences from a real community.

---

## Problem it Solves

I recently developed food allergies, and dining out has not been the same since. Many of us look at a restaurant menu before deciding whether to dine there. That used to be me too, but now instead of looking for what sounds good, I am looking for what is safe. And even after reviewing the menu ahead of time, you cannot know for sure until you confirm with the staff, because menus do not list every ingredient. Showing up to a restaurant unsure whether they can accommodate your allergies without a fuss is an uncomfortable feeling.

With food allergies on the rise, I know I am not alone in this. Bitewise is the app I wanted: a place where people can share the dishes they have eaten safely, so others with the same allergies can dine out with a little more confidence.

---

## Why it's a Good Project

Bitewise is a well-rounded capstone project that touches every layer of full stack development.

**UI and frontend skills** are at the center of this project. A community-driven app lives or dies by how approachable and intuitive it feels to use. Building an interactive map with filterable pins, restaurant pages with dynamic dish cards, a structured dish logging form, and a clean profile page gives a strong opportunity to demonstrate thoughtful, user-centered frontend work, which is the area I most want to highlight coming out of this bootcamp.

**Backend and full stack skills** are equally present. The app requires a RESTful API built with Node.js and Express, a MongoDB database with multiple related collections, and server-side logic for filtering, aggregating dish counts, and managing user-specific data.

**Authentication** is built in via Passport.js, with user sessions and protected routes that ensure data is only accessible to the right people.

**API integration** The app uses the Google Maps JavaScript API for map rendering and the Google Places API for restaurant search, both of which require proper key management, error handling, and thoughtful integration into the frontend.

Together these make Bitewise a project that is personal, technically well-rounded, and a strong reflections of 
everything we learned throughout the bootcamp.

---

## Target Audience

- Adults with food allergies
- Parents managing a child's food allergy
- People who are newly diagnosed and learning how to navigate dining out safely

---

## Key Features

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

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Material UI |
| Backend | Node.js, Express, JavaScript |
| Database | MongoDB |
| Authentication | Passport.js |
| Map rendering | Google Maps JavaScript API |
| Restaurant search | Google Places API |
| Fonts | Nunito, Outfit (Google Fonts) |