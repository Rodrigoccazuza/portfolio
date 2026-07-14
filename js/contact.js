// Keep the FormSubmit success redirect on the domain currently serving the site.
(function () {
  var form = document.querySelector('[data-contact-form]');
  if (!form) return;
  var next = form.querySelector('input[name="_next"]');
  if (next && window.location.origin.indexOf('http') === 0) {
    next.value = window.location.origin + '/portfolio/contact/thanks/';
  }
})();
