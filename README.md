# Andrei Carillo – Portfolio

Static portfolio site (plain HTML, CSS and JavaScript). No build step.

## Structure

```
index.html          page content
css/styles.css      all styling and the light/dark color tokens
js/main.js          theme toggle, active nav link, footer year
assets/
  certifications/   certificate badge images
  profile/          profile photo
  projects/          project preview images
  skills/            skill logo SVGs
  Andrei_Carillo_CV.pdf
  favicon.svg
.nojekyll           tells GitHub Pages to serve files as-is
```

## Run locally

Open `index.html` in a browser, or run a local server:

```
python -m http.server 8000
```

then visit http://localhost:8000.

## Host with GitHub Pages

1. Commit and push the project files to your GitHub repository's `main` branch. Keep `index.html` at the repository root.
   In VS Code, open **Source Control**, stage the project files, enter a commit message, select **Commit**, then **Push** (or **Publish Branch** if prompted).
2. On GitHub, open the repository and go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch** as the source.
4. Choose branch **main** and folder **/(root)**, then click **Save**.
5. Open the **Actions** tab and wait for the Pages deployment workflow to finish successfully.
6. Visit `https://carilloandrei9264.github.io/my-portfolio/`. The first deployment may take a few minutes.

To update the live site later, commit and push changes to `main`; GitHub Pages will deploy them automatically. For a personal site at `https://<username>.github.io/`, the repository must be named `<username>.github.io`.

## Updating content

- Text, projects, skills, links: edit `index.html`.
- Colors: edit the variables at the top of `css/styles.css`.
- New CV: replace `assets/Andrei_Carillo_CV.pdf` (keep the same file name).
- Profile photo: replace `assets/profile/profile.jpg`.
- Project previews: add or replace files in `assets/projects/` and update their paths in `index.html`.
- Certification badges: add or replace files in `assets/certifications/` and update their paths in `index.html`.

## Skill icons

Skill logo SVGs are stored in `assets/skills/` and referenced by the Skills section in `index.html`. REST APIs and PHPUnit retain their existing inline icons.

## Loading, slow, offline and empty states

All handled in `js/main.js` with styles in `css/styles.css`:

- Images show a shimmer while loading, a "still loading" note after 4 seconds, and a "Try again" button if they fail.
- A banner appears when the visitor goes offline or is on a very slow connection, and retries failed images when they come back online.
- If you delete every item from the projects, skills or certifications lists, an empty-state message shows instead of a blank section.
