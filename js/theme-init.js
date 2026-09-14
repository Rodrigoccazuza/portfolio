/* Run before styles paint. Never put service credentials in browser code. */
(function () {
  'use strict';
  var saved = null;
  try { saved = localStorage.getItem('portfolio-theme'); } catch (_) {}
  var preference = matchMedia('(prefers-color-scheme: dark)');
  function apply(value) { document.documentElement.classList.toggle('dark', value === 'dark'); }
  apply(saved === 'dark' || saved === 'light' ? saved : (preference.matches ? 'dark' : 'light'));
  preference.addEventListener('change', function (event) {
    if (saved !== 'dark' && saved !== 'light') { apply(event.matches ? 'dark' : 'light'); document.dispatchEvent(new Event('portfolio-theme-change')); }
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== 'portfolio-theme') return;
    saved = event.newValue;
    apply(saved === 'dark' || saved === 'light' ? saved : (preference.matches ? 'dark' : 'light'));
    document.dispatchEvent(new Event('portfolio-theme-change'));
  });
  document.addEventListener('portfolio-theme-select', function () { saved = document.documentElement.classList.contains('dark') ? 'dark' : 'light'; });
}());
