/**
 * ABDULRHMAN REZK — ML ENGINEER PORTFOLIO
 * Application logic — renders everything from data.js (SITE_DATA)
 * and powers navigation, modals, ticker, theming, and the mobile menu.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════════════════════
  // 1. RENDER — build all sections from SITE_DATA
  // ═══════════════════════════════════════════════════════════════
  const D = window.SITE_DATA;
  const esc = (s) => String(s ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

  function fillHead(id, heading, sub) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<h2>${esc(heading)}</h2><p>${esc(sub)}</p>`;
  }

  // ── Profile (header, hero, contact) ───────────────────────────
  function renderProfile() {
    const p = D.profile;
    document.title = `${p.name} — ${p.roleTitle}`;
    document.getElementById('brand-name').textContent = p.name;

    // Hero name in the inverted box: "Abdulrhman Rezk." → two lines
    const nameHtml = esc(p.name.replace('.', '')).replace(' ', '<br>') + '.';
    document.getElementById('hero-name').innerHTML = nameHtml;
    document.getElementById('hero-role-title').textContent = p.roleTitle;
    document.getElementById('hero-role-tags').textContent = '// ' + p.roleTags;
    document.getElementById('hero-lead').textContent = p.lead;

    const photo = document.getElementById('profile-photo');
    photo.src = p.photo;
    // Small deterrent against casual right-click saving of the photo
    photo.setAttribute('oncontextmenu', 'return false');
    photo.setAttribute('draggable', 'false');

    document.getElementById('social-linkedin').href = p.linkedin;
    document.getElementById('social-github').href = p.github;
    document.getElementById('contact-email').textContent = p.email;
    document.getElementById('mail-direct-link').href = `mailto:${p.email}`;
  }

  // ── About ──────────────────────────────────────────────────────
  function renderAbout() {
    const a = D.about;
    document.getElementById('about-facts').innerHTML = a.facts.map(f => `
      <div class="about-fact">
        <div class="fact-label">${esc(f.label)}</div>
        <p>${esc(f.text)}</p>
      </div>`).join('');
    document.getElementById('about-story').innerHTML =
      `The driving question — <strong>"${esc(a.storyQuestion || "Why can't software just think?")}"</strong> — became a method: learn by building, every day.`;
    document.getElementById('about-numbers').textContent = a.numbersNote;
  }

  // ── USP ────────────────────────────────────────────────────────
  function renderUsp() {
    const u = D.usp;
    fillHead('usp-head', u.heading, u.sub);
    document.getElementById('usp-cards').innerHTML = u.cards.map(c => `
      <div class="usp-card">
        <div class="usp-num">${esc(c.num)}</div>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.text)}</p>
      </div>`).join('');
    document.getElementById('usp-proof-title').textContent = u.proofTitle;
    document.getElementById('usp-proof').innerHTML = u.proof.map(t => `<li>${esc(t)}</li>`).join('');
  }

  // ── Education / Experience (timelines) ────────────────────────
  function renderTimeline(containerId, items) {
    document.getElementById(containerId).innerHTML = items.map(it => `
      <div class="timeline-item">
        <div class="timeline-body">
          <h3>${esc(it.title)}</h3>
          <div class="timeline-meta">${esc(it.meta)}</div>
          <p>${esc(it.text)}</p>
        </div>
      </div>`).join('');
  }

  function renderEducation() {
    fillHead('education-head', D.education.heading, D.education.sub);
    renderTimeline('education-items', D.education.items);
  }

  function renderExperience() {
    fillHead('experience-head', D.experience.heading, D.experience.sub);
    renderTimeline('experience-items', D.experience.items);
    const badge = document.getElementById('experience-badge');
    badge.innerHTML = `
      <svg class="no-exp-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.8">
        <circle cx="12" cy="12" r="9"/><line x1="5.8" y1="18.2" x2="18.2" y2="5.8"/>
      </svg>
      <p>${esc(D.experience.badge)}</p>`;
  }

  // ── Skills ─────────────────────────────────────────────────────
  function renderSkills() {
    fillHead('skills-head', D.skills.heading, D.skills.sub);
    document.getElementById('skills-cards').innerHTML = D.skills.cards.map(card => `
      <div class="skill-card">
        <div class="skill-card-num">${esc(card.num)}</div>
        <h3>${esc(card.title)}</h3>
        <p>${esc(card.desc)}</p>
        <div class="skill-pill-list">
          ${card.pills.map(p =>
            `<span class="skill-pill" data-level="${p.level}" style="--level:${p.level}%">${esc(p.name)}</span>`
          ).join('')}
        </div>
      </div>`).join('');
  }

  // ── Projects ───────────────────────────────────────────────────
  function projectCard(p) {
    const img = p.image
      ? `<img class="project-card-image" src="${esc(p.image)}" alt="${esc(p.title)}">`
      : '';
    const demo = p.demo ? `<a class="demo-btn" href="${esc(p.demo)}" aria-label="Open project demo">DEMO →</a>` : '';
    return `
      <article class="project-card" data-project-id="${esc(p.id)}">
        <div class="project-card-header">
          <span>${esc(p.code)}</span>
          <span class="project-badge">${esc(p.badge)}</span>
        </div>
        ${img}
        <div class="project-card-body">
          <h3 class="project-card-title">${esc(p.title)}</h3>
          <p class="project-card-desc">${esc(p.desc)}</p>
          <div class="project-roi-strip">${esc(p.highlight)}</div>
          <div class="project-tech-tags">
            ${p.tech.map(t => `<span class="tech-tag">${esc(t)}</span>`).join('')}
          </div>
        </div>
        <div class="project-card-footer">
          <button class="case-study-btn open-case-study" data-project="${esc(p.id)}">READ MORE →</button>
          ${demo}
        </div>
      </article>`;
  }

  function renderProjects() {
    const grid = document.getElementById('projects-grid');
    // Keep the ">" strip: it lives inside the grid, re-append after rendering
    const moreBtn = document.getElementById('projects-more-btn');
    grid.innerHTML = D.projects.map(projectCard).join('');
    if (moreBtn) grid.appendChild(moreBtn);
  }

  // ── Services ───────────────────────────────────────────────────
  function renderServices() {
    fillHead('services-head', D.services.heading, D.services.sub);
    document.getElementById('services-cards').innerHTML = D.services.cards.map(c => `
      <div class="service-card">
        <div class="service-num">${esc(c.num)}</div>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.text)}</p>
      </div>`).join('');
  }

  // ── Certificates ───────────────────────────────────────────────
  function certCard(c) {
    const media = c.image
      ? `<img class="cert-image" src="${esc(c.image)}" alt="${esc(c.title)}">`
      : `<div class="cert-image">
           <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="12" cy="9" r="5"/><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5"/></svg>
           <span>IMAGE SLOT</span>
         </div>`;
    return `
      <div class="cert-card">
        ${media}
        <div class="cert-body">
          <h3>${esc(c.title)}</h3>
          <div class="cert-meta">${esc(c.meta)}</div>
        </div>
      </div>`;
  }

  function renderCertificates() {
    // Grid: the first 5 certificates — the dashed "+" tile only appears
    // when there are MORE than 5 (it opens the moving certificates popup)
    const shown = D.certificates.slice(0, 5);
    let html = shown.map(certCard).join('');
    if (D.certificates.length > 5) {
      html += `
        <button class="certs-more-tile" id="certs-more-btn" aria-label="View all certificates">
          <span class="certs-more-plus">+</span>
          <span>VIEW ALL CERTIFICATES</span>
        </button>`;
    }
    document.getElementById('certs-grid').innerHTML = html;
    // Popup ticker: every certificate, moving like the testimonials strip
    document.getElementById('certs-ticker-track').innerHTML = D.certificates.map(certCard).join('');
  }

  // ── Testimonials ───────────────────────────────────────────────
  function renderTestimonials() {
    document.getElementById('testi-track').innerHTML = D.testimonials.map(t => `
      <div class="testi-card ${t.dim ? 'testi-card-dim' : ''}">
        <p class="testi-quote">${esc(t.quote)}</p>
        <div class="testi-author">${esc(t.author)}</div>
      </div>`).join('');
  }

  // ── Render everything, then wire the behaviors ─────────────────
  renderProfile();
  renderAbout();
  renderUsp();
  renderEducation();
  renderSkills();
  renderProjects();
  renderExperience();
  renderServices();
  renderCertificates();
  renderTestimonials();

  // ═══════════════════════════════════════════════════════════════
  // 2. SECTION NAVIGATION (desktop controller)
  // ═══════════════════════════════════════════════════════════════
  const sections = Array.from(document.querySelectorAll('.screen-section'));

  // Side dot tracker — generated from the sections, hover shows the name
  const tracker = document.getElementById('side-tracker');
  tracker.innerHTML = '';
  sections.forEach((s, i) => {
    const dot = document.createElement('button');
    dot.className = 'screen-dot';
    dot.setAttribute('data-index', i);
    dot.setAttribute('data-label', s.id);
    dot.setAttribute('aria-label', 'Go to ' + s.id);
    tracker.appendChild(dot);
  });

  const screenDots = document.querySelectorAll('.screen-dot');
  const navLinks = document.querySelectorAll('.site-nav a');
  let currentSectionIndex = 0;
  let isThrottling = false;

  // Mobile gets a dedicated layout: natural scrolling + burger menu.
  const isMobileLayout = () => window.matchMedia('(max-width: 990px)').matches;

  function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    if (index === currentSectionIndex) { updateActiveUI(index); return; }
    currentSectionIndex = index;
    sections[index].scrollIntoView({ behavior: 'smooth' });
    updateActiveUI(index);
    flashDotLabel(index);
  }

  // Scroll to a section by id — used on mobile where the custom controller
  // is off. Programmatic on purpose: a native anchor jump can silently fail
  // right after a fullscreen overlay (mobile menu) closes on some browsers.
  function scrollToId(id) {
    const target = document.getElementById(id);
    if (!target) return false;
    const startY = window.scrollY;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    // Last-resort net: if nothing moved after ~0.6s, jump straight there.
    setTimeout(() => {
      if (Math.abs(window.scrollY - startY) < 8) {
        target.scrollIntoView({ block: 'start' });
      }
    }, 600);
    return true;
  }

  function updateActiveUI(index) {
    screenDots.forEach((dot, idx) => dot.classList.toggle('active', idx === index));
    const currentId = sections[index]?.id;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`));
  }

  // Flash the section name next to its dot whenever a new section becomes
  // active while scrolling — the name appears, then hides by itself.
  let dotLabelTimer = null;
  function flashDotLabel(index) {
    const dot = screenDots[index];
    if (!dot) return;
    screenDots.forEach((d) => d.classList.remove('show-label'));
    clearTimeout(dotLabelTimer);
    dot.classList.add('show-label');
    dotLabelTimer = setTimeout(() => dot.classList.remove('show-label'), 2000);
  }

  // ─── Reveal on view (IntersectionObserver) ─────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
        if (entry.target.classList.contains('reveal-step')) updateStepHints();
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-item:not(.reveal-step)').forEach((el) => revealObserver.observe(el));
  if (isMobileLayout()) {
    document.querySelectorAll('.reveal-step').forEach((el) => revealObserver.observe(el));
  }

  function revealNextStep(sectionEl) {
    if (!sectionEl) return false;
    const step = sectionEl.querySelector('.reveal-step:not(.revealed)');
    if (!step) return false;
    step.classList.add('revealed');
    updateStepHints();
    return true;
  }

  function updateStepHints() {
    document.querySelectorAll('.scroll-hint').forEach((hint) => {
      const section = hint.closest('.screen-section');
      const left = section ? section.querySelectorAll('.reveal-step:not(.revealed)').length : 0;
      if (left === 0) { hint.style.display = 'none'; }
      else {
        hint.style.display = 'block';
        hint.textContent = `▼ KEEP SCROLLING — ${left} MORE ${left === 1 ? 'ENTRY' : 'ENTRIES'} BELOW`;
      }
    });
  }
  updateStepHints();

  function syncIndexToScroll() {
    const idx = Math.min(sections.length - 1, Math.max(0, Math.round(window.scrollY / window.innerHeight)));
    currentSectionIndex = idx;
    updateActiveUI(idx);
  }
  syncIndexToScroll();

  // ─── Wheel snapping (desktop only) ─────────────────────────────
  window.addEventListener('wheel', (e) => {
    if (isMobileLayout()) return;
    if (document.querySelector('.modal-overlay.active')) return;
    if (e.target.closest('textarea, input')) return;
    e.preventDefault();
    if (isThrottling) return;
    if (Math.abs(e.deltaY) > 20) {
      isThrottling = true;
      const direction = e.deltaY > 0 ? 1 : -1;
      if (direction === 1 && revealNextStep(sections[currentSectionIndex])) {
        setTimeout(() => { isThrottling = false; }, 550);
        return;
      }
      if (direction === 1) {
        if (currentSectionIndex < sections.length - 1) scrollToSection(currentSectionIndex + 1);
      } else {
        if (currentSectionIndex > 0) scrollToSection(currentSectionIndex - 1);
      }
      setTimeout(() => { isThrottling = false; }, 750);
    }
  }, { passive: false });

  // ─── Touch swipe (desktop-width touch devices only) ────────────
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (isMobileLayout()) return;
    if (isThrottling) return;
    if (document.querySelector('.modal-overlay.active')) return;
    if (e.target.closest('.testi-viewport')) return;
    const diff = touchStartY - e.changedTouches[0].screenY;
    if (Math.abs(diff) > 40) {
      isThrottling = true;
      const direction = diff > 0 ? 1 : -1;
      if (direction === 1 && revealNextStep(sections[currentSectionIndex])) {
        setTimeout(() => { isThrottling = false; }, 550);
        return;
      }
      if (direction === 1) {
        if (currentSectionIndex < sections.length - 1) scrollToSection(currentSectionIndex + 1);
      } else {
        if (currentSectionIndex > 0) scrollToSection(currentSectionIndex - 1);
      }
      setTimeout(() => { isThrottling = false; }, 750);
    }
  }, { passive: true });

  // ─── Keyboard navigation (desktop layout only) ─────────────────
  window.addEventListener('keydown', (e) => {
    if (isMobileLayout()) return;
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (document.querySelector('.modal-overlay.active')) return;
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      if (revealNextStep(sections[currentSectionIndex])) return;
      if (currentSectionIndex < sections.length - 1) scrollToSection(currentSectionIndex + 1);
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      if (currentSectionIndex > 0) scrollToSection(currentSectionIndex - 1);
    }
  });

  // ─── Dot & nav link clicks ─────────────────────────────────────
  screenDots.forEach((dot) => {
    dot.addEventListener('click', () => scrollToSection(parseInt(dot.getAttribute('data-index'), 10)));
  });

  document.querySelectorAll('.site-nav a, .nav-jump').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = (link.getAttribute('href') || '').replace('#', '');
      if (!document.getElementById(id)) return;
      e.preventDefault();
      if (isMobileLayout()) {
        // Mobile: scroll programmatically — don't rely on native anchor jumps.
        scrollToId(id);
        return;
      }
      const idx = sections.findIndex((s) => s.id === id);
      if (idx !== -1) scrollToSection(idx);
    });
  });

  // ─── Mobile menu ───────────────────────────────────────────────
  const mobileMenu = document.getElementById('mobile-menu');
  const menuBtn = document.getElementById('menu-btn');
  if (mobileMenu) {
    sections.forEach((s, i) => {
      const a = document.createElement('a');
      a.href = '#' + s.id;
      a.textContent = String(i + 1).padStart(2, '0') + ' / ' + s.id;
      mobileMenu.appendChild(a);
    });
    const setMenu = (open) => {
      mobileMenu.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
    };
    menuBtn?.addEventListener('click', () => setMenu(true));
    document.getElementById('menu-close-btn')?.addEventListener('click', () => setMenu(false));
    mobileMenu.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      e.preventDefault();
      const id = (link.getAttribute('href') || '').replace('#', '');
      setMenu(false);
      scrollToId(id);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. THEME SWITCHER
  // ═══════════════════════════════════════════════════════════════
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeText = themeToggleBtn?.querySelector('.theme-text');
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark-mode');
    if (themeText) themeText.textContent = 'turn on the light';
  }
  themeToggleBtn?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (themeText) themeText.textContent = isDark ? 'turn on the light' : 'turn off the light';
  });

  // ═══════════════════════════════════════════════════════════════
  // 4. LIVE TERMINAL LOG
  // ═══════════════════════════════════════════════════════════════
  const logLines = [
    { tag: '[STATUS]', val: D.profile.logStatus, cls: 'log-val' },
    { tag: '[FOCUS]', val: D.profile.logFocus, cls: 'log-val' },
    { tag: '[LOCATION]', val: 'Remote — open to remote & on-site', cls: 'log-val' },
    { tag: '[RESPONSE_TIME]', val: 'Usually within 24 hours', cls: 'log-val' },
    { tag: '[NOTE]', val: 'Hit the COPY button next to my email below', cls: 'log-dim' },
  ];
  const logBody = document.getElementById('log-body');
  if (logBody) {
    let delay = 200;
    logLines.forEach((line) => {
      setTimeout(() => {
        const row = document.createElement('div');
        row.className = 'log-line';
        row.innerHTML = `<span class="log-tag">${line.tag}</span><span class="${line.cls}">${esc(line.val)}</span>`;
        logBody.appendChild(row);
      }, delay);
      delay += 350;
    });
  }

  // ─── Copy email ────────────────────────────────────────────────
  document.getElementById('copy-email-btn')?.addEventListener('click', function () {
    navigator.clipboard.writeText(D.profile.email).then(() => {
      const orig = this.textContent;
      this.textContent = 'COPIED!';
      setTimeout(() => { this.textContent = orig; }, 2000);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 5. PROJECT DETAILS MODAL
  // ═══════════════════════════════════════════════════════════════
  const projectModal = document.getElementById('project-modal');
  const projectsModal = document.getElementById('projects-modal');

  function syncPageLock() {
    document.body.classList.toggle('modal-open', !!document.querySelector('.modal-overlay.active'));
  }

  // Delegated: works for grid cards AND clones inside the all-projects popup
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-case-study');
    if (!btn) return;
    const p = D.projects.find(x => x.id === btn.getAttribute('data-project'));
    if (!p) return;
    document.getElementById('modal-badge').textContent = p.code;
    document.getElementById('modal-title-text').textContent = p.title;

    // Project image (fallback placeholder if none)
    const modalImage = document.getElementById('modal-image');
    const fallbackSvg = document.getElementById('modal-image-fallback');
    const fallbackLabel = document.getElementById('modal-image-fallback-label');
    if (p.image) {
      modalImage.src = p.image;
      modalImage.alt = p.title;
      modalImage.style.display = 'block';
      fallbackSvg.style.display = 'none';
      fallbackLabel.style.display = 'none';
    } else {
      modalImage.style.display = 'none';
      fallbackSvg.style.display = '';
      fallbackLabel.style.display = '';
    }

    document.getElementById('modal-overview').textContent = p.overview;
    document.getElementById('modal-hard').textContent = p.hardPart;
    document.getElementById('modal-learned').textContent = p.learned;

    const stepsEl = document.getElementById('modal-steps');
    stepsEl.innerHTML = '';
    (p.steps || []).forEach((txt, i) => {
      const step = document.createElement('div');
      step.className = 'flow-step';
      const num = document.createElement('span');
      num.className = 'step-num';
      num.textContent = i + 1;
      step.appendChild(num);
      step.appendChild(document.createTextNode(txt));
      stepsEl.appendChild(step);
    });

    const techEl = document.getElementById('modal-tech');
    techEl.innerHTML = '';
    (p.tech || []).forEach((t) => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = t;
      techEl.appendChild(tag);
    });

    // Demo button only appears when the project really has a demo URL
    const demoBtn = document.getElementById('modal-demo');
    if (p.demo) {
      demoBtn.setAttribute('href', p.demo);
      demoBtn.style.display = '';
    } else {
      demoBtn.style.display = 'none';
    }

    projectModal.classList.add('active');
    syncPageLock();
  });

  // ─── All Projects Modal (thin ">" strip in the grid) ───────────
  document.getElementById('projects-more-btn')?.addEventListener('click', () => {
    const body = document.getElementById('projects-modal-body');
    body.innerHTML = '';
    D.projects.forEach((p) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = projectCard(p);
      body.appendChild(wrapper.firstElementChild);
    });
    projectsModal.classList.add('active');
    syncPageLock();
  });

  // ─── All Certificates Modal (dashed tile in the grid) ──────────
  document.getElementById('certs-more-btn')?.addEventListener('click', () => {
    document.getElementById('certs-modal').classList.add('active');
    syncPageLock();
  });

  // Close buttons + click on the dark overlay
  document.querySelectorAll('.modal-close-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay')?.classList.remove('active');
      syncPageLock();
    });
  });

  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        syncPageLock();
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 6. MOVING STRIPS (ticker engine — shared)
  //    Auto-scrolls slowly, pauses on hover, drag to move by hand.
  // ═══════════════════════════════════════════════════════════════
  function startTicker(viewport, track, speed = 0.5) {
    track.innerHTML += track.innerHTML; // duplicate the set for a seamless loop
    let offset = 0, hovering = false, dragging = false, dragStartX = 0, dragStartOffset = 0;

    viewport.addEventListener('mouseenter', () => { hovering = true; });
    viewport.addEventListener('mouseleave', () => {
      hovering = false; dragging = false; viewport.classList.remove('dragging');
    });
    viewport.addEventListener('pointerdown', (e) => {
      dragging = true;
      dragStartX = e.clientX;
      dragStartOffset = offset;
      viewport.classList.add('dragging');
    });
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      offset = dragStartOffset + (e.clientX - dragStartX);
    });
    window.addEventListener('pointerup', () => {
      dragging = false;
      viewport.classList.remove('dragging');
    });

    (function tick() {
      const half = track.scrollWidth / 2;
      if (half > 0) {
        if (!hovering && !dragging) offset -= speed;
        if (offset <= -half) offset += half;
        if (offset > 0) offset -= half;
        track.style.transform = `translateX(${offset}px)`;
      }
      requestAnimationFrame(tick);
    })();
  }

  const testiViewport = document.getElementById('testi-viewport');
  const testiTrack = document.getElementById('testi-track');
  if (testiViewport && testiTrack) startTicker(testiViewport, testiTrack, 0.5);

  const certsViewport = document.getElementById('certs-ticker-viewport');
  const certsTrack = document.getElementById('certs-ticker-track');
  if (certsViewport && certsTrack) startTicker(certsViewport, certsTrack, 0.5);

  // ═══════════════════════════════════════════════════════════════
  // 7. CONTACT FORM — real delivery via FormSubmit.co
  // ═══════════════════════════════════════════════════════════════
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const CONTACT_EMAIL = D.profile.email;

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    if (formStatus) formStatus.style.display = 'none';

    const payload = Object.fromEntries(new FormData(contactForm));
    payload._subject = `Portfolio message — ${payload.name || 'visitor'}`;
    payload._template = 'table';
    payload._captcha = 'false';

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Send failed');
      if (formStatus) {
        formStatus.style.display = 'block';
        formStatus.style.color = '#22c55e';
        formStatus.textContent = '✓ Message sent — I will get back to you within 24 hours.';
      }
      contactForm.reset();
    } catch (err) {
      if (formStatus) {
        formStatus.style.display = 'block';
        formStatus.style.color = '#ef4444';
        formStatus.textContent = '✕ Automatic send failed — send it yourself in one click: ';
        const mailBtn = document.createElement('a');
        const body = encodeURIComponent(`${payload.message || ''}\n\n— ${payload.name || ''} (${payload.email || ''})`);
        mailBtn.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(payload.subject || 'Portfolio message')}&body=${body}`;
        mailBtn.className = 'mail-fallback-btn';
        mailBtn.textContent = 'OPEN YOUR MAIL APP →';
        formStatus.appendChild(mailBtn);
      }
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
});
