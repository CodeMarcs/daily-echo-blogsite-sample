/* =========================================================
   DAILY ECHO — main.js
   Theme toggle, mobile nav, shared interactions
   ========================================================= */

(function () {
  const root = document.documentElement;
  const STORAGE_KEY = 'daily-echo-theme';

  /* ---- Theme handling ---- */
  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    updateToggleIcons(theme);
  }

  function updateToggleIcons(theme) {
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      const icon = btn.querySelector('i');
      const label = btn.querySelector('span');
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
        if (label) label.textContent = 'Light mode';
      } else {
        icon.className = 'fa-solid fa-moon';
        if (label) label.textContent = 'Dark mode';
      }
    });
  }

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  /* Init theme immediately */
  applyTheme(getStoredTheme());

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-toggle');
    if (btn) toggleTheme();
  });

  /* ---- Mobile side nav toggle ---- */
  document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const sideNav = document.querySelector('.side-nav');
    const overlay = document.querySelector('.nav-overlay');

    function closeNav() {
      sideNav?.classList.remove('open');
      overlay?.classList.remove('show');
    }

    menuToggle?.addEventListener('click', () => {
      sideNav?.classList.toggle('open');
      overlay?.classList.toggle('show');
    });

    overlay?.addEventListener('click', closeNav);

    /* close nav on link click (mobile) */
    document.querySelectorAll('.side-nav .nav-links a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    /* ---- Like button toggle ---- */
    document.querySelectorAll('.action-btn.like').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('liked');
        const icon = btn.querySelector('i');
        const countSpan = btn.querySelector('.count');
        let count = parseInt(countSpan.textContent, 10);
        if (btn.classList.contains('liked')) {
          icon.className = 'fa-solid fa-heart';
          count += 1;
        } else {
          icon.className = 'fa-regular fa-heart';
          count -= 1;
        }
        countSpan.textContent = count;
      });
    });

    /* ---- Password visibility toggle ---- */
    document.querySelectorAll('.toggle-pass').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = btn.closest('.input-wrap').querySelector('input');
        const icon = btn.querySelector('i');
        if (input.type === 'password') {
          input.type = 'text';
          icon.className = 'fa-solid fa-eye-slash';
        } else {
          input.type = 'password';
          icon.className = 'fa-solid fa-eye';
        }
      });
    });

    /* ---- Composer simple post (demo only) ---- */
    const composerBtn = document.querySelector('.composer-actions .btn');
    const composerInput = document.querySelector('.composer textarea');
    const feed = document.querySelector('.feed');

    composerBtn?.addEventListener('click', () => {
      const text = composerInput.value.trim();
      if (!text) return;

      const card = document.createElement('article');
      card.className = 'post-card';
      card.innerHTML = `
        <div class="post-header">
          <div class="avatar">Ki</div>
          <div class="info">
            <div class="name">Kisha</div>
            <div class="meta">Just now</div>
          </div>
          <span class="post-tag">New</span>
        </div>
        <div class="post-body">
          <p>${escapeHtml(text)}</p>
        </div>
        <div class="post-actions">
          <button class="action-btn like"><i class="fa-regular fa-heart"></i><span class="count">0</span></button>
          <button class="action-btn"><i class="fa-regular fa-comment"></i><span>0</span></button>
          <button class="action-btn"><i class="fa-solid fa-share"></i><span>Share</span></button>
        </div>`;
      feed.prepend(card);

      /* re-bind like for new card */
      card.querySelector('.action-btn.like').addEventListener('click', function () {
        this.classList.toggle('liked');
        const icon = this.querySelector('i');
        const countSpan = this.querySelector('.count');
        let count = parseInt(countSpan.textContent, 10);
        if (this.classList.contains('liked')) {
          icon.className = 'fa-solid fa-heart';
          count += 1;
        } else {
          icon.className = 'fa-regular fa-heart';
          count -= 1;
        }
        countSpan.textContent = count;
      });

      composerInput.value = '';
    });
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();