# Bitewise - Style Guide

---

## Brand

**App name:** Bitewise

The logo is the wordmark "Bitewise" set in Nunito Bold. The wordmark appears in Verdigris 500 on the dark navbar, with the "i" in "wise" rendered in Cerulean 500 as a secondary brand accent. On light backgrounds the wordmark uses Neutral 900.

---

## Color Palette

Bitewise uses a systematic HSB-based palette with seven color scales, each containing nine shades from 100 (lightest) to 900 (darkest). The 500 value is the base color for each scale.

| Scale | 500 Base | Role |
|---|---|---|
| Verdigris | `#25A691` | Brand primary |
| Cerulean | `#2481A6` | Brand secondary |
| Intense Cherry | `#B53339` | Error |
| Copper | `#B87A33` | Warning |
| Medium Jungle | `#2EA65A` | Success |
| Ocean Deep | `#3169A8` | Info |
| Neutral | `#8FA09E` | Text, backgrounds, borders |

**Full scales:**

| Shade | Verdigris | Cerulean | Intense Cherry | Copper | Medium Jungle | Ocean Deep | Neutral |
|---|---|---|---|---|---|---|---|
| 100 | `#F0FAFA` | `#F0F8FA` | `#FDF0F0` | `#FDF6ED` | `#F0FAF3` | `#EFF4FB` | `#F5FAFA` |
| 200 | `#BDE8E3` | `#BDDAE8` | `#F0BDBD` | `#F0D9B8` | `#BDE8CB` | `#BBCFF0` | `#E0EBEA` |
| 300 | `#84CECC` | `#84BACE` | `#E08484` | `#E0B87D` | `#84CE9F` | `#84A8E0` | `#C5D6D4` |
| 400 | `#54BDB1` | `#509EBD` | `#CC5757` | `#CC9854` | `#54BD79` | `#5487CC` | `#AABCBA` |
| 500 | `#25A691` | `#2481A6` | `#B53339` | `#B87A33` | `#2EA65A` | `#3169A8` | `#8FA09E` |
| 600 | `#148576` | `#136485` | `#8C2028` | `#8C5A20` | `#1A8542` | `#1D4F85` | `#728180` |
| 700 | `#09665B` | `#074D66` | `#6B1219` | `#6B4012` | `#0D6630` | `#0E3866` | `#556362` |
| 800 | `#054840` | `#033547` | `#470A10` | `#472A09` | `#074820` | `#072647` | `#394443` |
| 900 | `#022E29` | `#01202E` | `#2C050A` | `#2C1A05` | `#032E13` | `#03172C` | `#212828` |

### Usage rules

- **Neutral 100** is the default background for all pages, sidebars, toolbars, and form areas
- **Verdigris 900** is used exclusively for the navbar background
- **Verdigris 500** is used for primary buttons, active allergen chips, matching map pins, and links
- **Cerulean 500** is used for general map pins and the "i" in the wordmark
- **Neutral 900** is used for all body text throughout the app. It is the only text color used on light backgrounds and white
- **Neutral 200** is the default border color. Neutral 300 is used for stronger borders
- Supporting colors (Intense Cherry, Copper, Medium Jungle, Ocean Deep) are reserved for semantic use only and are never used decoratively

---

## Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| Headings | Nunito | Bold (700) | App name/logo, page titles, restaurant names on cards, dish names on cards, section headings |
| Body | Outfit | Regular (400) | All body text, labels, button text, placeholder text, allergen tags, chip labels, addresses, dates |
| Body emphasis | Outfit | Medium (500) | Subheadings, filter labels, nav items, form labels |

Both fonts are loaded from Google Fonts.

### Type scale

| Element | Font | Size |
|---|---|---|
| Logo / wordmark | Nunito Bold | 20px |
| Page title | Nunito Bold | 22px |
| Section heading | Nunito Bold | 18px |
| Card title (dish name, restaurant name) | Nunito Bold | 16px |
| Body text | Outfit Regular | 14px |
| Labels and form labels | Outfit Medium | 12px |
| Tags, chips, dates, secondary info | Outfit Regular | 12px |
| Hint text, placeholders | Outfit Regular | 12px |

---

## Components

### Buttons

**Primary button** (Log a dish, Save Changes, Create account, Log in)
- Background: Verdigris 500
- Text: white, Outfit Medium, 14px
- Border: none
- Border radius: 8px
- Height: 40px
- Full width in modals and forms, auto width in sidebars

**Secondary button** (Cancel, Save restaurant)
- Background: white
- Text: Neutral 900, Outfit Regular, 14px
- Border: 0.5px solid Neutral 300
- Border radius: 8px
- Height: 40px

**Danger button** (Delete account)
- Background: white
- Text: Intense Cherry 500, Outfit Medium, 14px
- Border: 0.5px solid Intense Cherry 500
- Border radius: 8px
- Height: 40px

---

### Chips

**Allergen chips on forms and filter panel (inactive)**
- Background: Neutral 100
- Text: Neutral 900, Outfit Medium, 12px
- Border: 0.5px solid Neutral 300
- Border radius: 20px
- Height: 28px

**Allergen chips on forms and filter panel (active/selected)**
- Background: Verdigris 500
- Text: white, Outfit Medium, 12px
- Border: none
- Border radius: 20px
- Height: 28px

**Allergen tags on dish cards**
- Background: Verdigris 100
- Text: Verdigris 600, Outfit Medium, 12px
- Border: none
- Border radius: 20px
- Height: 24px

---

### Cards

Dish cards appear on the restaurant page and profile page.

- Background: white
- Border: 0.5px solid Neutral 200
- Border radius: 12px
- Padding: 16px
- Shadow: none

**Card content order:**
1. Dish name (Nunito Bold, 16px, Neutral 900)
2. Log count ("X people logged this dish", Outfit Regular, 12px, secondary text)
3. Allergen tags (Verdigris chips)
4. Modifications (Outfit Italic, 12px, secondary text). Displays "Modifications: none" when empty
5. Last logged line (Outfit Regular, 12px, Neutral 600)

---

### Inputs

- Background: white
- Border: 0.5px solid Neutral 200, Verdigris 500 when focused
- Border radius: 8px
- Height: 36px (text inputs), auto height (textareas)
- Text: Neutral 900, Outfit Regular, 14px
- Placeholder text: Neutral 400, Outfit Regular, 14px
- Padding: 0 12px

---

### Navbar

- Background: Verdigris 900
- Height: 56px
- Logo: Nunito Bold, 20px, Verdigris 500 with Cerulean 500 on the "i" in "wise"
- Search bar: white at 8% opacity background, Outfit Regular, 13px, Neutral 400 text
- Icon buttons: white at 8% opacity background, Neutral 100 icons

---

### Toolbar (map page)

- Background: Neutral 100
- Border bottom: 0.5px solid Neutral 200
- Height: 44px
- All text and icons: Neutral 900
- City button: Neutral 100 background, Neutral 300 border, chevron icon to indicate it is interactive
- Allergen filter chips sit to the right of the city button

---

### Sidebar

- Background: Neutral 100
- Border right: 0.5px solid Neutral 200
- Width: 260px (restaurant page), 240px (profile page), 200px (settings page)
- Section labels: Outfit Medium, 11px, uppercase, letter-spacing 0.5px, Neutral 500

---

### Map pins

- **Cerulean pin**: restaurant has dishes logged but none match the user's active allergen filter
- **Verdigris pin**: restaurant has at least one dish matching the user's active allergen filter
- Pin shape: teardrop (circle with pointed bottom)
- Border: 2px solid white

---

### Popup (map pin click)

- Background: white
- Border: 0.5px solid Neutral 200
- Border radius: 12px
- Padding: 14px
- Width: 220px
- Contents: restaurant name (Nunito Bold), address (Outfit Regular, secondary text), allergen tags, More info button

---

## Spacing

- Base unit: 4px
- Common spacing values: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px
- Page padding: 20-32px
- Card padding: 16px
- Section gaps: 28-32px
- Component gaps: 8-12px

---

## Border radius

| Element | Radius |
|---|---|
| Buttons | 8px |
| Inputs | 8px |
| Cards | 12px |
| Popups and modals | 12px |
| Chips and tags | 20px (fully rounded) |
| Navbar | 0px |
| Avatar | 50% (circle) |

---

## Accessibility

- All text uses Neutral 900 on light backgrounds, verified to meet WCAG AA
- Interactive elements (buttons, chips, dropdowns) have visible borders or background changes to indicate state
- Placeholder text uses Neutral 400 and is never the only indicator of a field's purpose. All inputs have visible labels