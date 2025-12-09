# Circley Frontend

This is a build-free React prototype for the Circley application. Everything runs directly in the browser from a single JSX entry file—no Vite or bundler required.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Running the Application

There is no build step. You can open `index.html` directly in your browser, or run a tiny static server if you prefer:

```bash
npm start   # uses `npx serve .`
# or
python3 -m http.server 3000
```

All dependencies (React, ReactDOM, Leaflet) are pulled from CDNs.

## Project Structure

The project now uses a minimal structure:

* `index.html` – Loads CDN scripts, styles, and the JSX entry.
* `src/index.jsx` – Contains the app, lightweight hash routing, and UI components.
* `src/*.css` – Styles used by the JSX.

There are no remaining Vite or bundler configs. Everything should stay readable and hackable in-place.
