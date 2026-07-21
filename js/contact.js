// Submit the Formspree contact form without leaving the contact page.
(function () {
  var form = document.querySelector('[data-contact-form]');
  var status = document.querySelector('[data-contact-status]');

  if (!form || !status) return;

  var submitButton = form.querySelector('button[type="submit"]');
  var statusEyebrow = status.querySelector('[data-status-eyebrow]');
  var statusTitle = status.querySelector('[data-status-title]');
  var statusMessage = status.querySelector('[data-status-message]');
  var originalButtonContent = submitButton ? submitButton.innerHTML : '';

  function showStatus(eyebrow, title, message) {
    statusEyebrow.textContent = eyebrow;
    statusTitle.textContent = title;
    statusMessage.textContent = message;
    status.hidden = false;
    status.focus();
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    status.hidden = true;

    try {
      var response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Formspree rejected the submission.');
      }

      form.reset();
      form.hidden = true;
      showStatus(
        'Message sent',
        'Thanks! Your message was submitted successfully.',
        'I received your inquiry and will get back to you as soon as possible.'
      );
    } catch (error) {
      showStatus(
        'Something went wrong',
        'Your message could not be submitted.',
        'Please try again or email visualdesigner@rodrigocazuza.com directly.'
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonContent;
      }
    }
  });
})();