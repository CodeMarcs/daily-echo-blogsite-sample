/* =========================================================
   DAILY ECHO — messages.js
   Chat page interactions
   ========================================================= */

(function () {
  document.addEventListener('DOMContentLoaded', () => {

    const contactItems  = document.querySelectorAll('.contact-item');
    const chatMessages  = document.getElementById('chatMessages');
    const chatInput     = document.getElementById('chatInput');
    const chatSendBtn   = document.getElementById('chatSendBtn');
    const chatAvatar    = document.getElementById('chatAvatar');
    const chatHeaderName   = document.getElementById('chatHeaderName');
    const chatHeaderHandle = document.getElementById('chatHeaderHandle');
    const chatSearch    = document.getElementById('chatSearch');
    const chatBackBtn   = document.getElementById('chatBackBtn');
    const chatSidebar   = document.getElementById('chatSidebar');
    const chatWindow    = document.getElementById('chatWindow');
    const chatEmpty     = document.getElementById('chatEmpty');
    const startChatBtn  = document.getElementById('startChatBtn');

    let activeUser = 'mer';
    const isMobile = () => window.innerWidth < 768;

    /* ---------- Helper: escape HTML ---------- */
    function esc(str) {
      const d = document.createElement('div');
      d.textContent = str;
      return d.innerHTML;
    }

    /* ---------- Helper: current time ---------- */
    function nowTime() {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /* ---------- Show conversation ---------- */
    function showConversation(user) {
      activeUser = user;

      /* Show/hide messages */
      chatMessages.querySelectorAll('[data-conv]').forEach(el => {
        el.style.display = el.dataset.conv === user ? '' : 'none';
      });

      /* Scroll to bottom */
      chatMessages.scrollTop = chatMessages.scrollHeight;

      /* Update header */
      const item = document.querySelector(`.contact-item[data-user="${user}"]`);
      if (item) {
        chatAvatar.textContent      = item.dataset.initials;
        chatHeaderName.textContent  = item.dataset.name;
        chatHeaderHandle.textContent = item.dataset.handle;
        /* Remove unread dot */
        const dot = item.querySelector('.unread-dot');
        if (dot) dot.remove();
      }

      /* Active state on list */
      contactItems.forEach(c => c.classList.toggle('active', c.dataset.user === user));

      /* Mobile: slide to chat window */
      if (isMobile()) {
        chatSidebar.classList.add('hidden');
        chatWindow.classList.add('visible');
        chatEmpty.classList.add('hidden');
      }
    }

    /* ---------- Contact click ---------- */
    contactItems.forEach(item => {
      item.addEventListener('click', () => showConversation(item.dataset.user));
    });

    /* ---------- Back button (mobile) ---------- */
    chatBackBtn?.addEventListener('click', () => {
      chatSidebar.classList.remove('hidden');
      chatWindow.classList.remove('visible');
    });

    /* ---------- Start Chat button (empty state) ---------- */
    startChatBtn?.addEventListener('click', () => {
      chatEmpty.classList.add('hidden');
      chatSidebar.classList.remove('hidden');
    });

    /* ---------- Send message ---------- */
    function sendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;

      /* Build bubble */
      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble outgoing';
      bubble.dataset.conv = activeUser;
      bubble.innerHTML = `
        <div class="msg-content">
          <p>${esc(text)}</p>
          <span class="msg-time">${nowTime()}</span>
        </div>`;
      chatMessages.appendChild(bubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      /* Update preview in contact list */
      const previewEl = document.querySelector(`.contact-item[data-user="${activeUser}"] .contact-preview`);
      const timeEl    = document.querySelector(`.contact-item[data-user="${activeUser}"] .contact-time`);
      if (previewEl) previewEl.textContent = text;
      if (timeEl)    timeEl.textContent = 'Now';

      chatInput.value = '';

      /* Demo: auto-reply after a short delay */
      const replies = {
        mer:     ["That's so cool! 😊', 'Can't wait to hear all about it!', 'You always have the best ideas 💜"],
        aiz:     ["Nice! I'll take a look 👀', 'Let me know if you need a code review!', 'CSS is life 😄"],
        janners: ["Haha yes! 😂', 'Food talk is always welcome here 🍞', 'I'll share the full recipe soon!"],
      };
      const pool = replies[activeUser] || ['Got it! 👍'];
      const reply = pool[Math.floor(Math.random() * pool.length)];

      setTimeout(() => {
        /* only reply if still on same convo */
        if (activeUser !== bubble.dataset.conv) return;

        const item = document.querySelector(`.contact-item[data-user="${activeUser}"]`);
        const inBubble = document.createElement('div');
        inBubble.className = 'msg-bubble incoming';
        inBubble.dataset.conv = activeUser;
        inBubble.innerHTML = `
          <div class="msg-avatar avatar">${item ? item.dataset.initials : '?'}</div>
          <div class="msg-content">
            <p>${esc(reply)}</p>
            <span class="msg-time">${nowTime()}</span>
          </div>`;
        chatMessages.appendChild(inBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const pEl = document.querySelector(`.contact-item[data-user="${activeUser}"] .contact-preview`);
        if (pEl) pEl.textContent = reply;
      }, 900 + Math.random() * 600);
    }

    chatSendBtn?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    /* ---------- Contact search filter ---------- */
    chatSearch?.addEventListener('input', () => {
      const q = chatSearch.value.toLowerCase();
      contactItems.forEach(item => {
        const name = item.dataset.name.toLowerCase();
        item.style.display = name.includes(q) ? '' : 'none';
      });
    });

    /* ---------- Initial state ---------- */
    if (isMobile()) {
      /* On mobile start at sidebar */
      chatWindow.classList.remove('visible');
      chatEmpty.classList.add('hidden');
    } else {
      /* Desktop: open first conversation */
      showConversation('mer');
      chatEmpty.classList.add('hidden');
    }

    /* Handle resize */
    window.addEventListener('resize', () => {
      if (!isMobile()) {
        chatSidebar.classList.remove('hidden');
        chatWindow.classList.remove('visible');
        chatEmpty.classList.add('hidden');
        if (!activeUser) showConversation('mer');
      }
    });
  });
})();