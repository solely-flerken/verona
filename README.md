# Website for Pizzeria Verona · Weseke & Borken

## Todo

### UX
- [ ] Add smooth page transition animations across all route changes
- [x] Implement navigation back to the location gate via logo click and a dedicated UI element (e.g. `← Standort`)
- [x] Add a 404 / catch-all route — bad URLs currently show a blank white page
- [x] Make phone numbers `tel:` links
- [ ] Link addresses to Google Maps / Apple Maps for tap-to-navigate on mobile
- [x] Add keyboard support to the location lookup widget (Enter key does nothing)
- [x] Show feedback when a city search returns no match
- [x] Make Location-Gate hover animation not trigger on short mouse hovers

### SEO / Meta
- [x] Add per-page `<title>` tags (currently static "Pizzeria Verona" across all pages)
- [x] Add `<meta name="description">` tags
- [ ] Add Open Graph `<meta property="og:*">` tags for social sharing (blocked on SSR/SSG — client-injected tags aren't seen by link-preview bots)
- [x] Add `robots.txt` and `sitemap.xml`
- [ ] Replace Borken's placeholder photos (`src/shared/locationsData.ts` reuses Weseke's images) with real Borken photos
- [ ] Claim/verify Google Business Profile listings for both locations (outside the codebase)

### Accessibility
- [ ] Add `aria-label` to location card `<button>` elements
- [ ] Configure `font-display: swap` to avoid render-blocking fonts
