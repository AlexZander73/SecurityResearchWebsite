(function () {
  const content = window.PLAINTEXT_CONTENT || { entries: [] };
  const body = document.body;
  const root = body.dataset.root || '';
  const page = body.dataset.page || '';
  const brand = content.brand || 'Plaintext Security';
  const brandInitials = brand
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  const nav = [
    { key: 'home', label: 'Home', href: 'index.html' },
    { key: 'qr-safety', label: 'QR Safety', href: 'qr-safety/index.html' },
    { key: 'scams', label: 'Scam Library', href: 'scams/index.html' },
    { key: 'response', label: 'What To Do Now', href: 'response/index.html' },
    { key: 'basics', label: 'Security Basics', href: 'basics/index.html' },
    { key: 'developer-security', label: 'Developer Security', href: 'developer-security/index.html' },
    { key: 'ai-risks', label: 'AI & Automation Risks', href: 'ai-risks/index.html' },
    { key: 'blog', label: 'Blog', href: 'blog/index.html' },
    { key: 'roadmap', label: 'Roadmap', href: 'roadmap/index.html' },
    { key: 'about', label: 'About', href: 'about/index.html' },
    { key: 'submit', label: 'Submit a Scam', href: 'submit/index.html' }
  ];

  function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function makeHeader() {
    const wrap = document.querySelector('[data-site-header]');
    if (!wrap) return;
    const links = nav
      .map((item) => {
        const active = page === item.key ? 'true' : 'false';
        return `<li><a href="${root}${item.href}" data-active="${active}">${item.label}</a></li>`;
      })
      .join('');

    wrap.innerHTML = `
      <header class="site-header">
        <div class="container header-shell">
          <a class="brand" href="${root}index.html" aria-label="${brand} home">
            <span class="brand-mark" aria-hidden="true">${brandInitials}</span>
            <span>${brand}</span>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
          <nav id="site-nav" class="site-nav" aria-label="Main navigation">
            <ul>${links}</ul>
          </nav>
        </div>
      </header>
    `;

    const btn = wrap.querySelector('.nav-toggle');
    const menu = wrap.querySelector('.site-nav');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      menu.classList.toggle('open', !expanded);
    });
  }

  function makeFooter() {
    const wrap = document.querySelector('[data-site-footer]');
    if (!wrap) return;
    wrap.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <section>
            <h2>${brand}</h2>
            <p>Practical security guidance for everyday people and modern builders.</p>
            <p class="subtle">Calm, actionable, and built for real-world decisions.</p>
          </section>
          <section>
            <h2>Navigate</h2>
            <ul class="footer-list">
              <li><a href="${root}qr-safety/index.html">QR Safety</a></li>
              <li><a href="${root}scams/index.html">Scam Library</a></li>
              <li><a href="${root}response/index.html">What To Do Now</a></li>
              <li><a href="${root}developer-security/index.html">Developer Security</a></li>
              <li><a href="${root}ai-risks/index.html">AI & Automation Risks</a></li>
              <li><a href="${root}roadmap/index.html">Roadmap</a></li>
            </ul>
          </section>
          <section>
            <h2>Newsletter</h2>
            <div class="newsletter-placeholder">Newsletter placeholder: weekly practical updates and new scam patterns.</div>
            <p class="subtle"><a href="${root}about/index.html">Legal & privacy placeholder</a></p>
          </section>
        </div>
        <div class="container footer-bottom">
          <span>© <span data-year></span> ${brand}.</span>
        </div>
      </footer>
    `;

    const year = wrap.querySelector('[data-year]');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function entryCard(entry) {
    const label = (content.sections && content.sections[entry.section]) || entry.section;
    const tags = (entry.tags || []).slice(0, 3).map((tag) => `<li class="tag-pill">${tag}</li>`).join('');
    return `
      <article class="card article-card">
        <p class="kicker">${label}</p>
        <h3><a class="text-link" href="${root}${entry.url}">${entry.title}</a></h3>
        <p>${entry.summary}</p>
        <ul class="tag-list">${tags}</ul>
        <p class="meta">Updated ${formatDate(entry.date)}</p>
      </article>
    `;
  }

  function uniqueTags(entries) {
    const tags = new Set();
    entries.forEach((e) => (e.tags || []).forEach((t) => tags.add(t)));
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }

  function initFeeds() {
    const feeds = document.querySelectorAll('[data-feed]');
    feeds.forEach((feed) => {
      const section = feed.dataset.feedSection;
      const wantsSearch = feed.dataset.feedSearch === 'true';
      const limit = Number(feed.dataset.feedLimit || '0');
      let entries = (content.entries || []).filter((item) => !section || section === 'all' || item.section === section);
      entries = entries.sort((a, b) => b.date.localeCompare(a.date));
      if (limit > 0) entries = entries.slice(0, limit);

      let q = '';
      let activeTag = '';

      const controls = document.createElement('div');
      controls.className = 'feed-controls';
      if (wantsSearch) {
        const input = document.createElement('input');
        input.className = 'search-input';
        input.type = 'search';
        input.placeholder = 'Search by keyword, title, or tag';
        input.setAttribute('aria-label', 'Search guides');
        input.addEventListener('input', () => {
          q = input.value.trim().toLowerCase();
          render();
        });
        controls.appendChild(input);

        const tagWrap = document.createElement('div');
        tagWrap.className = 'filter-tags';

        const allBtn = document.createElement('button');
        allBtn.className = 'filter-chip';
        allBtn.type = 'button';
        allBtn.textContent = 'All';
        allBtn.setAttribute('aria-pressed', 'true');
        allBtn.addEventListener('click', () => {
          activeTag = '';
          refreshPressed(tagWrap, allBtn.textContent);
          render();
        });
        tagWrap.appendChild(allBtn);

        uniqueTags(entries).forEach((tag) => {
          const b = document.createElement('button');
          b.className = 'filter-chip';
          b.type = 'button';
          b.textContent = tag;
          b.setAttribute('aria-pressed', 'false');
          b.addEventListener('click', () => {
            activeTag = tag;
            refreshPressed(tagWrap, tag);
            render();
          });
          tagWrap.appendChild(b);
        });

        controls.appendChild(tagWrap);
      }

      const grid = document.createElement('div');
      grid.className = 'card-grid card-grid-3';

      function filterEntries() {
        return entries.filter((entry) => {
          const blob = `${entry.title} ${entry.summary} ${(entry.tags || []).join(' ')}`.toLowerCase();
          const queryOk = !q || blob.includes(q);
          const tagOk = !activeTag || (entry.tags || []).includes(activeTag);
          return queryOk && tagOk;
        });
      }

      function render() {
        const out = filterEntries();
        if (!out.length) {
          grid.innerHTML = `<article class="card"><h3>No matching guides</h3><p>Try a broader search term or clear your tag filters.</p></article>`;
          return;
        }
        grid.innerHTML = out.map(entryCard).join('');
      }

      if (controls.children.length) feed.appendChild(controls);
      feed.appendChild(grid);
      render();
    });
  }

  function refreshPressed(tagWrap, activeLabel) {
    tagWrap.querySelectorAll('.filter-chip').forEach((el) => {
      el.setAttribute('aria-pressed', el.textContent === activeLabel ? 'true' : 'false');
    });
  }

  function initLatest() {
    const latest = document.querySelector('[data-latest]');
    if (!latest) return;
    const count = Number(latest.dataset.latest || '6');
    const entries = (content.entries || [])
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, count);
    latest.innerHTML = `<div class="card-grid card-grid-3">${entries.map(entryCard).join('')}</div>`;
  }

  function initRelated() {
    const target = document.querySelector('[data-related]');
    if (!target) return;
    const slug = body.dataset.slug;
    const section = body.dataset.section;
    if (!slug || !section) return;

    const entries = (content.entries || [])
      .filter((entry) => entry.section === section && entry.slug !== slug)
      .slice(0, 3);

    if (!entries.length) return;

    target.innerHTML = `
      <header class="section-header"><h2>Related guides</h2></header>
      <div class="card-grid card-grid-3">${entries.map(entryCard).join('')}</div>
    `;
  }

  function initQrQuiz() {
    const quiz = document.querySelector('[data-qr-quiz]');
    if (!quiz) return;
    const result = quiz.querySelector('.quiz-result');
    quiz.querySelectorAll('button[data-answer]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const correct = btn.dataset.answer === 'correct';
        if (!result) return;
        if (correct) {
          result.textContent = 'Correct: close the page, verify the destination independently, and only continue on trusted domains.';
          result.style.color = '#0f766e';
        } else {
          result.textContent = 'Not quite. The safest response is to stop, verify, and avoid entering credentials or payment details from unknown QR links.';
          result.style.color = '#9a3412';
        }
      });
    });
  }

  function initDatingSim() {
    const shell = document.querySelector('[data-dating-sim]');
    if (!shell) return;

    const data = {
      start: {
        text:
          'You matched with Riley two days ago. Conversation feels easy and friendly. Tonight Riley says: "I got locked out of my account and need help urgently. Can you send $80 right now? I will pay you back tomorrow."',
        choices: [
          { label: 'Send the money now to be supportive', next: 'money_now' },
          { label: 'Pause and ask for a quick live verification call', next: 'verify_call' },
          { label: 'Ask for bank details and personal info to investigate', next: 'overshare' }
        ]
      },
      money_now: {
        text:
          'Riley immediately asks for another transfer, this time in crypto, and says not to tell anyone because it is "embarrassing."',
        debrief:
          'High risk pattern: urgency + secrecy + escalating payment request. Safe move: stop payments, verify identity on a trusted channel, and assume manipulation until confirmed.',
        risk: 'high'
      },
      verify_call: {
        text:
          'You ask for a 60-second video call and a pre-agreed challenge question. Riley refuses and sends a link saying: "Just verify here instead so I can unlock my account."',
        choices: [
          { label: 'Open the verification link and sign in quickly', next: 'phish_link' },
          { label: 'Decline link, keep communication in-app, and verify independently', next: 'safe_boundary' }
        ]
      },
      overshare: {
        text:
          'Riley thanks you and asks for your email, phone number, and date of birth to "prove trust."',
        debrief:
          'This is identity harvesting behavior. You do not need to provide personal data to help someone in a normal conversation. Keep boundaries and do not share sensitive details.',
        risk: 'high'
      },
      phish_link: {
        text:
          'The page looks like your social app login but the domain is misspelled. You notice after entering credentials.',
        debrief:
          'Likely phishing. Immediate steps: reset password from official app, revoke sessions, and enable stronger MFA.',
        risk: 'high'
      },
      safe_boundary: {
        text:
          'You decline off-platform links, refuse money transfer under pressure, and verify through known channels only.',
        debrief:
          'Strong response. You slowed the attacker timeline, avoided credential and payment exposure, and used independent verification.',
        risk: 'low'
      }
    };

    const text = shell.querySelector('[data-dating-text]');
    const choices = shell.querySelector('[data-dating-choices]');
    const status = shell.querySelector('[data-dating-status]');
    const reset = shell.querySelector('[data-dating-reset]');
    if (!text || !choices || !status || !reset) return;

    function render(nodeKey) {
      const node = data[nodeKey];
      if (!node) return;
      text.textContent = node.text;
      choices.innerHTML = '';
      status.textContent = '';
      status.classList.remove('is-risk-high', 'is-risk-low');

      if (node.debrief) {
        status.textContent = node.debrief;
        if (node.risk === 'high') status.classList.add('is-risk-high');
        if (node.risk === 'low') status.classList.add('is-risk-low');
      }

      (node.choices || []).forEach((choice) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'filter-chip';
        button.textContent = choice.label;
        button.addEventListener('click', () => render(choice.next));
        choices.appendChild(button);
      });
    }

    reset.addEventListener('click', () => render('start'));
    render('start');
  }

  makeHeader();
  makeFooter();
  initFeeds();
  initLatest();
  initRelated();
  initQrQuiz();
  initDatingSim();
})();
