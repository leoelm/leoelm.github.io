# Personal website

A static site with no build step. The homepage's own styles and scripts are inline in `index.html`; what the homepage and the blog posts share lives in `assets/`.

```
index.html     the homepage: bio, news, publications (incl. blog posts), CV summary, contact
assets/        profile.jpg, cv.pdf, figures/ (headline figures for publications), and
               base.css + theme.js (shared), post.css + post.js (blog posts)
blogs/<slug>/  one folder per blog post: index.html, text.md, figures/
.nojekyll      stops GitHub Pages running Jekyll, which would otherwise swallow the text.md files
```

## Editing
- **Photo / CV**: replace `assets/profile.jpg` (square) or `assets/cv.pdf`.
- **Colours**: the tokens at the top of `assets/base.css`. Light values are on `:root`, and the dark values appear twice, once for the system setting and once for the toggle.
- **News**: add an `<li>` to `.news`. Items with `class="news-extra"` stay hidden behind "Show older news". To cite a paper, link it with `href="#pub-N"`; clicking the link briefly highlights that paper.
- **Publications**: copy a `<li class="pub">` into the right year group and renumber `[N]`, `id="pub-N"` and the `bib-N` / `figcap-N` ids.
  Set `data-type` to `conference`, `journal`, `workshop` or `preprint`, and wrap your name in `<span class="me">`.
  A filter chip hides itself when no paper has its type.
- **Headline figure**: add `has-fig` to the `<li class="pub">`, put a `<figure class="pub-fig">` after `.pub-text` (copy an existing one), and save the image in `assets/figures/`.
  Use a white-background image; the page blends it into the paper colour and inverts it for dark mode.

## Blog posts
1. Copy an existing `blogs/<slug>/` folder and rename it. Write the post in `text.md` and put its images in `figures/`.
2. In the folder's `index.html`, update the `<title>`, description, `og:` tags, date and the "Accompanies" line (or delete that line).
   The title shown on the page comes from the first heading in `text.md`.
3. On the homepage, copy the `<li class="pub">` in "3.3 Blog Posts", put it at the top of that list, and number it `[B2]`, `id="blog-2"`, `figcap-b2`, and so on.

In `text.md`:
- An image on its own line becomes a figure. Add a caption with the Markdown title syntax, `![alt text](figures/x.png "Caption.")`. Captioned figures are numbered Figure 1, 2, … in order.
- Math is LaTeX, typeset with KaTeX: `$…$` inline, and `$$…$$` on lines of its own for a displayed equation. Write `\$` for a literal dollar sign.
  A post with math needs the KaTeX stylesheet and script in its `index.html` (copy the two `KaTeX` lines from an existing post).
- An `.mp4` or `.webm` referenced like an image plays as a silent looping video, like a GIF but much smaller. Export it as H.264 MP4 so every browser can play it.
- White-background figures are inverted for dark mode. To use your own light and dark versions instead, save both as `name_light.ext` and `name_dark.ext` and reference either one; the page shows the one matching the theme and switches when the theme changes.

## Preview
Run `python3 -m http.server` and go to http://localhost:8000. You can open the homepage as a file, but a blog post has to come from a server, because the page fetches its `text.md`.

## Deploy (GitHub Pages)
1. Create a repo named `<username>.github.io` and push these files to it.
2. In the repo's Settings → Pages, choose "Deploy from branch", then `master` / root.
3. The site goes live at `https://<username>.github.io`.
