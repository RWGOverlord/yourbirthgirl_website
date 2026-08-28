/* Consultation form — validates, then posts to the Cloudflare Worker.
   The Worker holds the Resend key and re-validates everything server side;
   nothing here is trusted by the endpoint. */
(function () {
  'use strict';

  // Set this to the deployed Worker URL. See worker/README.md.
  var ENDPOINT = 'https://ybg-consult-form.rwgoverlord.workers.dev';

  var form = document.getElementById('consult-form');
  if (!form) return;

  var statusEl = document.getElementById('f-status');
  var doneEl = document.getElementById('f-done');
  var submitBtn = document.getElementById('f-submit');

  function setStatus(msg, state) {
    statusEl.textContent = msg;
    statusEl.hidden = !msg;
    if (state) statusEl.setAttribute('data-state', state);
    else statusEl.removeAttribute('data-state');
  }

  function clearErrors() {
    form.querySelectorAll('.form__field--invalid').forEach(function (el) {
      el.classList.remove('form__field--invalid');
    });
    form.querySelectorAll('.form__error').forEach(function (el) { el.remove(); });
    form.querySelectorAll('[aria-invalid]').forEach(function (el) {
      el.removeAttribute('aria-invalid');
    });
  }

  function fail(field, control, message) {
    field.classList.add('form__field--invalid');
    if (control) control.setAttribute('aria-invalid', 'true');
    var p = document.createElement('p');
    p.className = 'form__error';
    p.textContent = message;
    field.appendChild(p);
  }

  function fieldOf(control) {
    return control.closest('.form__field');
  }

  function validate() {
    clearErrors();
    var errors = [];

    [
      ['f-name', 'Please enter your name.'],
      ['f-email', 'Please enter your email address.'],
      ['f-phone', 'Please enter your phone number.'],
      ['f-due', 'Please enter your estimated due date.'],
      ['f-place', 'Please choose where you plan to have your baby.'],
      ['f-location', 'Please enter the name and address of your birth location.'],
      ['f-consult', 'Please choose a consultation preference.'],
      ['f-heard', 'Please let me know how you heard about my services.']
    ].forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      if (!el.value.trim()) { fail(fieldOf(el), el, pair[1]); errors.push(el); }
    });

    var email = document.getElementById('f-email');
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      fail(fieldOf(email), email, 'That email address does not look right.');
      errors.push(email);
    }

    var support = form.querySelectorAll('input[name="supportType"]:checked');
    if (support.length === 0) {
      var fs = form.querySelector('fieldset');
      fail(fs, null, 'Please choose at least one type of support.');
      errors.push(fs);
    }

    var consent = document.getElementById('f-consent');
    if (!consent.checked) {
      fail(fieldOf(consent), consent, 'Please check the box to continue.');
      errors.push(consent);
    }

    return errors;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var errors = validate();
    if (errors.length) {
      setStatus('Please check the highlighted fields above.', 'error');
      var first = errors[0];
      (first.querySelector ? first.querySelector('input,select,textarea') || first : first).focus();
      return;
    }

    var payload = {
      name: document.getElementById('f-name').value.trim(),
      email: document.getElementById('f-email').value.trim(),
      phone: document.getElementById('f-phone').value.trim(),
      dueDate: document.getElementById('f-due').value,
      birthPlace: document.getElementById('f-place').value,
      birthLocation: document.getElementById('f-location').value.trim(),
      supportType: Array.prototype.map.call(
        form.querySelectorAll('input[name="supportType"]:checked'),
        function (el) { return el.value; }
      ),
      consultPref: document.getElementById('f-consult').value,
      notes: document.getElementById('f-notes').value.trim(),
      heardFrom: document.getElementById('f-heard').value,
      consent: document.getElementById('f-consent').checked,
      website: document.getElementById('f-website').value // honeypot
    };

    submitBtn.disabled = true;
    setStatus('Sending your details…', 'sending');

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          return { ok: res.ok, body: body };
        });
      })
      .then(function (r) {
        if (!r.ok) throw new Error(r.body && r.body.error ? r.body.error : 'Send failed');
        form.hidden = true;
        doneEl.hidden = false;
        doneEl.focus();
        doneEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(function (err) {
        submitBtn.disabled = false;
        setStatus(
          'Sorry — that did not send. Please try again, or email Megan directly at megan.yourbirthgirl@gmail.com. (' + err.message + ')',
          'error'
        );
      });
  });
})();
