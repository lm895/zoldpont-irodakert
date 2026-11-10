/* ZöldPont Irodakert (fiktív) – progresszív kiegészítések.
   Az oldal JavaScript nélkül is teljesen olvasható; ez a fájl csak kényelmi funkciókat ad. */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initProjectFilter();
  initDemoForm();
  initYear();
});

/* ---------- Mobilmenü ---------- */
function initNav() {
  var button = document.querySelector('.nav-toggle');
  var nav = document.getElementById('fomenu');
  if (!button || !nav) return;
  var label = button.querySelector('.nav-toggle__label');

  function setOpen(open) {
    button.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    if (label) label.textContent = open ? 'Bezárás' : 'Menü';
  }

  button.addEventListener('click', function () {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false);
  });

  var wide = window.matchMedia('(min-width: 900px)');
  wide.addEventListener('change', function (event) {
    if (event.matches) setOpen(false);
  });
}

/* ---------- Projektszűrő ---------- */
function initProjectFilter() {
  var group = document.querySelector('[data-filter-group]');
  if (!group) return;
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-categories]'));
  var status = document.querySelector('[data-filter-status]');
  group.hidden = false;

  group.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-filter]');
    if (!button) return;
    var filter = button.getAttribute('data-filter');

    group.querySelectorAll('button[data-filter]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b === button));
    });

    var visible = 0;
    items.forEach(function (item) {
      var cats = item.getAttribute('data-categories').split(' ');
      var show = filter === 'osszes' || cats.indexOf(filter) !== -1;
      item.hidden = !show;
      if (show) visible++;
    });

    if (status) status.textContent = visible + ' projekt látható: ' + button.textContent.trim() + '.';
  });
}

/* ---------- Bemutató ajánlatkérő űrlap ----------
   Az űrlap SEMMILYEN adatot nem küld el és nem tárol: beküldéskor csak ellenőrzés és visszajelzés történik. */
function initDemoForm() {
  var form = document.querySelector('[data-demo-form]');
  if (!form) return;
  form.noValidate = true;

  var submit = form.querySelector('[type="submit"]');
  if (submit) submit.disabled = false;
  var status = document.getElementById('urlap-allapot');

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var phonePattern = /^\+?[0-9 ()\/-]{7,20}$/;

  var rules = {
    nev: function (el) {
      return el.value.trim().length >= 2 || 'Kérjük, adja meg a nevét (legalább 2 karakter).';
    },
    ceg: function (el) {
      return el.value.trim().length > 0 || 'Kérjük, adja meg a cég nevét.';
    },
    email: function (el) {
      var v = el.value.trim();
      if (!v) return 'Kérjük, adja meg az e-mail-címét.';
      return emailPattern.test(v) || 'Az e-mail-cím formátuma nem megfelelő (például: nev@ceg.hu).';
    },
    telefon: function (el) {
      var v = el.value.trim();
      return !v || phonePattern.test(v) || 'A telefonszám csak számjegyet, szóközt és + - / ( ) jelet tartalmazhat.';
    },
    letszam: function (el) {
      var v = el.value.trim();
      if (!v) return true;
      var n = Number(v);
      return (Number.isInteger(n) && n >= 1 && n <= 500) || 'A létszám 1 és 500 közötti egész szám legyen.';
    },
    adatkezeles: function (el) {
      return el.checked || 'A beküldéshez el kell fogadnia az adatkezelési tájékoztatót.';
    }
  };

  function validate(name) {
    var el = form.elements[name];
    var result = rules[name](el);
    var ok = result === true;
    var error = document.getElementById(name + '-hiba');
    el.setAttribute('aria-invalid', String(!ok));
    if (error) error.textContent = ok ? '' : result;
    return ok;
  }

  // A már hibásként jelölt mezőt gépelés közben újraellenőrizzük.
  form.addEventListener('input', function (event) {
    var name = event.target.name;
    if (rules[name] && event.target.getAttribute('aria-invalid') === 'true') validate(name);
  });
  form.addEventListener('change', function (event) {
    var name = event.target.name;
    if (rules[name] && event.target.getAttribute('aria-invalid') === 'true') validate(name);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var invalid = Object.keys(rules).filter(function (name) { return !validate(name); });

    if (invalid.length) {
      status.className = 'form-status form-status--error';
      status.textContent = 'Az ajánlatkérés nem küldhető be: ' + invalid.length +
        ' mezőt javítani kell. A hibákat a mezők alatt jeleztük.';
      form.elements[invalid[0]].focus();
      return;
    }

    form.reset();
    Object.keys(rules).forEach(function (name) { form.elements[name].removeAttribute('aria-invalid'); });
    status.className = 'form-status form-status--success';
    status.textContent = 'Köszönjük az érdeklődését! Ez egy bemutató oldal egy fiktív vállalkozásról, ' +
      'ezért üzenetét nem továbbítottuk, és semmilyen adatot nem tároltunk.';
    status.focus();
  });
}

/* ---------- Aktuális év a láblécben ---------- */
function initYear() {
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = year; });
}
