# Personal website

A single static page with no build step. Its styles and scripts are inline in `index.html`.

```
index.html   the whole site: bio, news, publications, CV summary, contact
assets/      profile.jpg, cv.pdf, and figures/ (headline figures for publications)
```

## Editing
- **Photo / CV**: replace `assets/profile.jpg` (square) or `assets/cv.pdf`.
- **Colours**: the tokens at the top of the `<style>` block. Light values are on `:root`, and the dark values appear twice, once for the system setting and once for the toggle.
- **News**: add an `<li>` to `.news`. Items with `class="news-extra"` stay hidden behind "Show older news". To cite a paper, link it with `href="#pub-N"`; clicking the link briefly highlights that paper.
- **Publications**: copy a `<li class="pub">` into the right year group and renumber `[N]`, `id="pub-N"` and the `bib-N` / `figcap-N` ids.
  Set `data-type` to `conference`, `journal`, `workshop` or `preprint`, and wrap your name in `<span class="me">`.
  A filter chip hides itself when no paper has its type.
- **Headline figure**: add `has-fig` to the `<li class="pub">`, put a `<figure class="pub-fig">` after `.pub-text` (copy an existing one), and save the image in `assets/figures/`.
  Use a white-background image; the page blends it into the paper colour and inverts it for dark mode.

## Preview
Open `index.html` in a browser, or run `python3 -m http.server` and go to http://localhost:8000.

## Deploy (GitHub Pages)
1. Create a repo named `<username>.github.io` and push these files to it.
2. In the repo's Settings → Pages, choose "Deploy from branch", then `main` / root.
3. The site goes live at `https://<username>.github.io`.
