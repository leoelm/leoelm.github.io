/* Renders a post's Markdown (data-src on .post-body, usually text.md) into the page.
   - A leading heading in the Markdown becomes the page title.
   - An image alone in its paragraph becomes a figure; give it a caption with
     the Markdown title syntax: ![alt text](figures/x.png "Caption.")
     Captioned figures are numbered Figure 1, 2, … in order.
   - A figure named *_light.* or *_dark.* is swapped for its sibling to match
     the theme, so both versions must exist.
   - An .mp4 or .webm "image" plays as a silent looping video, like a GIF. */
(function () {
  var body = document.querySelector('.post-body');
  var titleEl = document.querySelector('.post-title');
  var themed = /_(light|dark)(\.\w+)$/;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function syncThemedImages(root) {
    var theme = window.currentTheme();
    root.querySelectorAll('img, video').forEach(function (img) {
      var src = img.getAttribute('src');
      if (themed.test(src)) img.setAttribute('src', src.replace(themed, '_' + theme + '$2'));
    });
  }
  document.addEventListener('themechange', function () { syncThemedImages(body); });

  function render(md) {
    // Build the post in a template first: images there don't load until they
    // are in the page, so only the right themed version is ever fetched.
    var tpl = document.createElement('template');
    tpl.innerHTML = marked.parse(md);
    var doc = tpl.content;

    doc.querySelectorAll('img').forEach(function (img) {
      if (!/\.(mp4|webm)$/i.test(img.getAttribute('src'))) return;
      var v = document.createElement('video');
      v.setAttribute('src', img.getAttribute('src'));
      v.muted = v.defaultMuted = true;   // the attribute too: iOS autoplays only muted videos
      v.loop = true; v.playsInline = true;
      // Reduced motion: don't start on its own, offer play controls instead
      if (reduceMotion) v.controls = true; else v.autoplay = true;
      if (img.alt) v.setAttribute('aria-label', img.alt);
      if (img.title) v.title = img.title;
      img.replaceWith(v);
    });
    syncThemedImages(doc);

    var first = doc.firstElementChild;
    if (first && /^H[1-3]$/.test(first.tagName)) {
      titleEl.textContent = first.textContent;
      document.title = first.textContent + ' · Leo Elmecker-Plakolm';
      first.remove();
    }

    var n = 0;
    doc.querySelectorAll('p > img:only-child, p > video:only-child').forEach(function (img) {
      var p = img.parentElement;
      if (p.textContent.trim()) return;   // the image sits inside running text
      var fig = document.createElement('figure');
      if (img.tagName === 'IMG') img.loading = 'lazy';
      fig.appendChild(img);
      if (img.title) {
        n++;
        var cap = document.createElement('figcaption');
        var lbl = document.createElement('span');
        lbl.className = 'lbl';
        lbl.textContent = 'Figure ' + n + ':';
        cap.appendChild(lbl);
        cap.appendChild(document.createTextNode(' ' + img.title));
        fig.appendChild(cap);
        img.removeAttribute('title');
      }
      p.replaceWith(fig);
    });

    body.replaceChildren(doc);
  }

  fetch(body.dataset.src)
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    })
    .then(render)
    .catch(function () {
      body.innerHTML = '<p class="post-error">This post could not be loaded. ' +
        'You can read the <a href="' + body.dataset.src + '">plain-text version</a> instead.</p>';
    });
})();
