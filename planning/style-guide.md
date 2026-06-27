# Bitewise - Style Guide

---

## Brand

**App name:** Bitewise

The logo is the wordmark "Bitewise" set in Nunito Bold. The wordmark appears in Charcoal Blue on light backgrounds and Old Lace on dark or colored backgrounds.

---

## Color Palette

| Name | Hex | Usage |
|---|---|---|
| Old Lace | `#FAF3E0` | Page background, toolbar background, form backgrounds |
| Sandy Brown | `#F4A261` | Navbar background |
| Verdigris | `#2A9D8F` | Allergen tags, active allergen chips on filter panel, teal map pins, links |
| Burnt Peach | `#E76F51` | Buttons, map pins (general), date text on cards |
| Charcoal Blue | `#264653` | All body text, headings, active modification chips, active allergen chips on forms, filled buttons |

### Usage rules

- **Old Lace** is the default background for all pages, sidebars, toolbars, and form areas
- **Sandy Brown** is used exclusively for the navbar
- **Verdigris** is used for allergen tags on dish cards, the active state of allergen filters, links, and map pins for restaurants matching the user's allergen profile
- **Burnt Peach** is used for buttons, map pins for general restaurants, and date/last logged text on dish cards
- **Charcoal Blue** is used for all text throughout the app. It is the only text color used on Sandy Brown, Old Lace, and white backgrounds

### Accessibility

All text uses Charcoal Blue `#264653`. White text is never used on any brand color. The following combinations have been verified to meet WCAG AA contrast requirements:

- Charcoal Blue on Old Lace - passes
- Charcoal Blue on Sandy Brown - passes
- Charcoal Blue on white - passes
- Black on Verdigris - passes
- Black on Burnt Peach - passes

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
- Background: Burnt Peach `#E76F51`
- Text: Charcoal Blue `#264653`, Outfit Medium, 14px
- Border: none
- Border radius: 8px
- Height: 40px
- Full width in modals and forms, auto width in sidebars

**Secondary button** (Cancel, Save restaurant)
- Background: Old Lace `#FAF3E0`
- Text: Charcoal Blue `#264653`, Outfit Regular, 14px
- Border: 0.5px solid, muted warm grey
- Border radius: 8px
- Height: 40px

**Danger button** (Delete account)
- Background: Burnt Peach `#E76F51`
- Text: Charcoal Blue `#264653`, Outfit Medium, 14px
- Border: none
- Border radius: 8px
- Height: 40px

**Filled dark button** (navbar icons active state)
- Background: Charcoal Blue `#264653`
- Text: Old Lace `#FAF3E0`, Outfit Medium, 14px
- Border: none
- Border radius: 8px
- Height: 40px

---

### Chips

**Allergen chips on forms and filter panel (inactive)**
- Background: Old Lace `#FAF3E0`
- Text: Charcoal Blue `#264653`, Outfit Medium, 12px
- Border: 0.5px solid, muted warm grey
- Border radius: 20px
- Height: 28px

**Allergen chips on forms and filter panel (active/selected)**
- Background: Charcoal Blue `#264653`
- Text: Old Lace `#FAF3E0`, Outfit Medium, 12px
- Border: none
- Border radius: 20px
- Height: 28px

**Allergen tags on dish cards**
- Background: Verdigris at low opacity
- Text: Verdigris `#2A9D8F`, Outfit Medium, 12px
- Border: none
- Border radius: 20px
- Height: 24px

---

### Cards

Dish cards appear on the restaurant page and profile page.

- Background: white
- Border: 0.5px solid, muted warm grey
- Border radius: 12px
- Padding: 16px
- Shadow: none

**Card content order:**
1. Dish name (Nunito Bold, 16px, Charcoal Blue)
2. Log count ("X people logged this dish", Outfit Regular, 12px, secondary text)
3. Allergen tags (Verdigris chips)
4. Modifications (Outfit Italic, 12px, secondary text). Displays "Modifications: none" when empty
5. Last logged line (Outfit Regular, 12px, Burnt Peach)

---

### Inputs

- Background: white
- Border: 0.5px solid, muted warm grey
- Border radius: 8px
- Height: 36px (text inputs), auto height (textareas)
- Text: Charcoal Blue `#264653`, Outfit Regular, 14px
- Placeholder text: lighter warm grey, Outfit Regular, 14px
- Padding: 0 12px

---

### Navbar

- Background: Sandy Brown `#F4A261`
- Height: 56px
- Logo: Nunito Bold, 20px, Charcoal Blue
- Search bar: white at 35% opacity background, Outfit Regular, 13px, dark brown text
- Icon buttons: white at 30% opacity background, Charcoal Blue icons

---

### Toolbar (map page)

- Background: Old Lace `#FAF3E0`
- Border bottom: 0.5px solid, muted warm grey
- Height: 44px
- All text and icons: Charcoal Blue `#264653`
- City button: Old Lace background, Charcoal Blue border, chevron icon to indicate it is interactive
- Filter panel: dropdown on the right side with checkbox list of user's allergens

---

### Sidebar

- Background: Old Lace `#FAF3E0`
- Border right: 0.5px solid, muted warm grey
- Width: 260px (restaurant page), 240px (profile page), 200px (settings page)
- Section labels: Outfit Medium, 11px, uppercase, letter-spacing 0.5px, secondary text color

---

### Map pins

- **Burnt Peach pin**: restaurant has dishes logged but none match the user's active allergen filter
- **Verdigris pin**: restaurant has at least one dish matching the user's active allergen filter
- Pin shape: teardrop (circle with pointed bottom)
- Border: 2px solid white

---

### Popup (map pin click)

- Background: white
- Border: 0.5px solid, muted warm grey
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

- All text uses Charcoal Blue `#264653` on light backgrounds, verified to meet WCAG AA
- White text is never used on any brand color
- Interactive elements (buttons, chips, dropdowns) have visible borders or background changes to indicate state
- Placeholder text uses a lighter warm grey and is never the only indicator of a field's purpose. All inputs have visible labels
- Chip active states use a filled dark background (Charcoal Blue) with light text (Old Lace) to clearly communicate selection