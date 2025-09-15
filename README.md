# Full‑Stack Developer Portfolio

Clean, responsive, and accessible portfolio site with dark mode. Built using vanilla HTML, CSS, and JS so it deploys anywhere with zero build steps.

## Features
- Semantic sections: Hero, About, Skills, Projects, Experience, Contact
- Responsive layout with CSS Grid/Flexbox
- Dark/light theme with system preference and persistence
- Accessible navigation and skip link
- Minimal JS for theme toggle, mobile menu, copy‑email

## Getting Started
Open `index.html` in your browser, or serve locally for better caching and routing.

### Local dev server (Node)
```bash
npx serve .
```

Or with Python:
```bash
python -m http.server 5173
```

Then visit `http://localhost:5173`.

## Customize
- Update your name, role, and bio in `index.html` (Hero and About sections).
- Replace project cards in the `Projects` section with your real work.
- Update social links and email in the `Contact` section and `data-email` attribute.
- Adjust colors, spacing, and typography in `styles.css`.

## Deploy
- GitHub Pages: push to a repo and enable Pages (root). Your site will be at `https://<username>.github.io/<repo>`.
- Vercel/Netlify: import the repo, select root directory, and deploy as a static site.
- Any static host works since there is no build step.

## License
MIT


