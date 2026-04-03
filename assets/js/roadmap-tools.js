(function(){
  function initChecklist() {
    const account = document.querySelector('[data-checklist-items="account"]');
    const payment = document.querySelector('[data-checklist-items="payment"]');
    const summary = document.querySelector('[data-checklist-summary]');
    if (!account || !payment || !summary) return;

    const data = {
      account: [
        'Reset password from official bookmark',
        'Sign out unknown sessions/devices',
        'Review recovery email/phone changes',
        'Enable stronger MFA'
      ],
      payment: [
        'Call bank/card provider via official number',
        'Request freeze/reversal where possible',
        'Preserve receipts/chats/screenshots',
        'Monitor for follow-up impersonation'
      ]
    };

    function renderList(el, key) {
      el.innerHTML = data[key].map((item, i) => '<label class="subtle"><input type="checkbox" data-check-item="'+key+'-'+i+'" /> '+item+'</label>').join('<br/>');
    }

    function updateSummary() {
      const all = document.querySelectorAll('[data-check-item]');
      const done = document.querySelectorAll('[data-check-item]:checked');
      summary.textContent = done.length + ' of ' + all.length + ' steps completed.';
    }

    renderList(account, 'account');
    renderList(payment, 'payment');
    document.addEventListener('change', function(e){ if (e.target && e.target.matches('[data-check-item]')) updateSummary(); });
    updateSummary();
  }

  function initSimCards() {
    const text = document.querySelector('[data-sim-card-text]');
    const draw = document.querySelector('[data-sim-draw]');
    const printBtn = document.querySelector('[data-sim-print]');
    if (!text || !draw || !printBtn) return;
    const cards = [
      'A parent gets a school payment QR in a group chat. What do you verify first?',
      'A coworker asks for urgent gift cards via a private message. What is your pause step?',
      'A delivery text asks for a small redelivery fee. What channel do you use instead?',
      'A match asks to move off-app and send emergency travel money. What are the red flags?',
      'A voice call from a relative asks for instant transfer. What verification rule do you use?'
    ];
    draw.addEventListener('click', function(){
      text.textContent = cards[Math.floor(Math.random() * cards.length)];
    });
    printBtn.addEventListener('click', function(){ window.print(); });
  }

  function initTriageDemo() {
    const el = document.querySelector('[data-triage-clusters]');
    if (!el) return;
    const samples = [
      'SMS: package delayed, pay small fee now',
      'Call: bank alert, confirm transfer code',
      'QR: parking sign payment page asks login',
      'Chat: urgent crypto investment from new match',
      'Popup: device infected, call support number'
    ];
    const buckets = {
      Payment: ['pay', 'fee', 'transfer', 'crypto'],
      Impersonation: ['bank', 'support', 'call'],
      LinkTrap: ['qr', 'login', 'page', 'popup', 'sms']
    };
    const grouped = { Payment: [], Impersonation: [], LinkTrap: [] };
    samples.forEach(function(s){
      Object.keys(buckets).forEach(function(k){
        if (buckets[k].some(function(w){ return s.toLowerCase().indexOf(w) !== -1; })) grouped[k].push(s);
      });
    });
    el.innerHTML = Object.keys(grouped).map(function(k){
      return '<h3>'+k+'</h3><ul>'+grouped[k].map(function(i){ return '<li>'+i+'</li>'; }).join('')+'</ul>';
    }).join('');
  }

  function initScenarioPacks() {
    const result = document.querySelector('[data-pack-results]');
    const buttons = document.querySelectorAll('[data-pack-filter]');
    if (!result || !buttons.length) return;
    const packs = {
      teen: ['Fake support popups', 'Gaming account phishing', 'Social giveaway scams'],
      'young-adult': ['Rental deposit scams', 'Job onboarding fraud', 'Dating app pressure scams'],
      parents: ['School payment QR scams', 'Family voice impersonation', 'Marketplace delivery scams'],
      builders: ['Prompt injection traps', 'Secrets in logs', 'Over-privileged agents']
    };
    function render(key){
      result.innerHTML = (packs[key] || []).map(function(item){ return '<article class="card"><h3>'+item+'</h3><p>Discussion prompt and safer response path included.</p></article>'; }).join('');
    }
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        buttons.forEach(function(b){ b.setAttribute('aria-pressed','false'); });
        btn.setAttribute('aria-pressed','true');
        render(btn.dataset.packFilter);
      });
    });
    render('teen');
    buttons[0].setAttribute('aria-pressed','true');
  }

  function initQuarterlyTimeline() {
    const el = document.querySelector('[data-quarterly-timeline]');
    if (!el) return;
    const rows = [
      ['2025 Q2', 'QR parking overlays increased in busy districts', 'Shift payments to official apps only.'],
      ['2025 Q3', 'Voice impersonation scripts became more polished', 'Use family/team verification phrases.'],
      ['2025 Q4', 'Micro-fee delivery scams scaled across SMS', 'Never pay from message links.'],
      ['2026 Q1', 'AI-generated lures improved personalization', 'Verify requests through independent channels.']
    ];
    el.innerHTML = '<h2>Timeline</h2>' + rows.map(function(r){ return '<section class="roadmap-item"><h3>'+r[0]+'</h3><p><strong>Pattern:</strong> '+r[1]+'</p><p><strong>Practical response:</strong> '+r[2]+'</p></section>'; }).join('');
  }

  initChecklist();
  initSimCards();
  initTriageDemo();
  initScenarioPacks();
  initQuarterlyTimeline();
})();
