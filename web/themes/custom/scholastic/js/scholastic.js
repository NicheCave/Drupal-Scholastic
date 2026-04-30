/**
 * @file
 * scholastic.js — Behavioural enhancements for the Scholastic theme.
 */
(function (Drupal) {
  'use strict';

  /**
   * Bento card image zoom on hover.
   */
  Drupal.behaviors.scholasticBentoHover = {
    attach: function (context) {
      context.querySelectorAll('.bento-card-img').forEach(function (el) {
        var card = el.closest('[class*="col-"]');
        if (!card) return;
        card.addEventListener('mouseenter', function () { el.style.transform = 'scale(1.035)'; });
        card.addEventListener('mouseleave', function () { el.style.transform = ''; });
      });
    }
  };

  /**
   * Navbar scroll shadow.
   */
  Drupal.behaviors.scholasticNavShadow = {
    attach: function (context, settings) {
      if (context !== document) return;
      var header = document.querySelector('header.sticky-top');
      if (!header) return;
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    }
  };

  /**
   * Auto-submit prevention for Views exposed filter forms.
   */
  Drupal.behaviors.scholasticPreventAutoSubmit = {
    attach: function (context) {
      context.querySelectorAll('.views-exposed-form').forEach(function (formEl) {
        if (formEl.dataset.schPatched) return;
        formEl.dataset.schPatched = '1';
        var input = formEl.querySelector('input.form-autocomplete, input[data-autocomplete-path]');
        if (!input) return;
        var blocked = false;
        input.addEventListener('autocompleteselect', function () {
          blocked = true;
          setTimeout(function () { blocked = false; }, 600);
        });
        input.addEventListener('change', function (e) {
          if (blocked) { e.stopImmediatePropagation(); e.preventDefault(); }
        }, true);
        formEl.addEventListener('submit', function (e) {
          if (blocked) { e.stopImmediatePropagation(); e.preventDefault(); blocked = false; }
        }, true);
        formEl.querySelectorAll('input[type="submit"], button[type="submit"]').forEach(function (btn) {
          btn.addEventListener('click', function () { blocked = false; });
        });
      });
    }
  };

  /**
   * Logout confirmation modal.
   *
   * Intercepts clicks on any [data-logout-confirm] link and shows a
   * Bootstrap-styled modal overlay asking the user to confirm before
   * proceeding to the Drupal logout URL.
   */
  Drupal.behaviors.scholasticLogoutConfirm = {
    attach: function (context, settings) {
      // Inject the modal once into the document body
      if (!document.getElementById('sc-logout-modal')) {
        var modal = document.createElement('div');
        modal.id = 'sc-logout-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'sc-logout-title');
        modal.innerHTML = [
          '<div id="sc-logout-backdrop"></div>',
          '<div id="sc-logout-dialog">',
          '  <div id="sc-logout-icon">',
          '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"',
          '         stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">',
          '      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
          '      <polyline points="16 17 21 12 16 7"/>',
          '      <line x1="21" y1="12" x2="9" y2="12"/>',
          '    </svg>',
          '  </div>',
          '  <h2 id="sc-logout-title">Sign out?</h2>',
          '  <p>You\'ll need to sign back in to access your account.</p>',
          '  <div id="sc-logout-actions">',
          '    <button id="sc-logout-cancel" type="button">Cancel</button>',
          '    <a id="sc-logout-confirm-btn" href="#" class="sc-logout-primary">Sign out</a>',
          '  </div>',
          '</div>'
        ].join('\n');
        document.body.appendChild(modal);

        // Close on backdrop click or Cancel
        document.getElementById('sc-logout-backdrop').addEventListener('click', closeModal);
        document.getElementById('sc-logout-cancel').addEventListener('click', closeModal);

        // Close on Escape
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && document.getElementById('sc-logout-modal').classList.contains('sc-modal-open')) {
            closeModal();
          }
        });
      }

      function closeModal() {
        var m = document.getElementById('sc-logout-modal');
        m.classList.remove('sc-modal-open');
        document.body.classList.remove('sc-modal-active');
      }

      // Attach to all [data-logout-confirm] triggers in this context
      context.querySelectorAll('[data-logout-confirm]').forEach(function (el) {
        if (el.dataset.schLogoutBound) return;
        el.dataset.schLogoutBound = '1';
        el.addEventListener('click', function (e) {
          e.preventDefault();
          var logoutUrl = el.getAttribute('href');
          document.getElementById('sc-logout-confirm-btn').setAttribute('href', logoutUrl);
          document.getElementById('sc-logout-modal').classList.add('sc-modal-open');
          document.body.classList.add('sc-modal-active');
          // Focus the cancel button for accessibility
          setTimeout(function () {
            document.getElementById('sc-logout-cancel').focus();
          }, 50);
        });
      });
    }
  };

})(Drupal);
