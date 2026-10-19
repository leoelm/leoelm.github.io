/* Light/dark toggle, shared by the homepage and the blog posts.
   The saved theme is applied before first paint by a script in each <head>. */
(function () {
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var toggle = document.querySelector('.theme-toggle');
  var label = toggle.querySelector('.theme-label');
  var icon = toggle.querySelector('.icon');

  function current() {
    return root.dataset.theme || (mq && mq.matches ? 'dark' : 'light');
  }
  function syncToggle() {
    var next = current() === 'dark' ? 'light' : 'dark';
    label.textContent = next;
    icon.className = 'fa-solid icon ' + (next === 'dark' ? 'fa-moon' : 'fa-sun');
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    document.dispatchEvent(new CustomEvent('themechange', { detail: current() }));
  }
  window.currentTheme = current;
  toggle.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncToggle();
  });
  if (mq) {
    if (mq.addEventListener) mq.addEventListener('change', syncToggle);
    else if (mq.addListener) mq.addListener(syncToggle);
  }
  syncToggle();
})();
