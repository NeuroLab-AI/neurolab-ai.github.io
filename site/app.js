(function () {
  "use strict";

  var VIEWS = {
    overview: null,
    roadmap: "https://neurolab-ai.github.io/roadmap/?embed=1",
    deck: "https://neurolab-ai.github.io/roadmap/deck/?embed=1",
    whitepaper: "https://neurolab-ai.github.io/whitepaper/?embed=1"
  };

  var TITLES = {
    overview: "NeuroLab — Launch Command Center",
    roadmap: "NeuroLab — Roadmap",
    deck: "NeuroLab — Project Deck",
    whitepaper: "NeuroLab — Whitepaper"
  };

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".view-tab"));
  var openButtons = Array.prototype.slice.call(document.querySelectorAll(".pub-open"));
  var loadingIndicator = document.getElementById("frame-loading");
  var mounted = {};
  var current = null;

  var EMBED_STYLES = [
    ":root {",
    "  --command-glass: linear-gradient(145deg, rgba(38, 34, 32, 0.78), rgba(12, 12, 13, 0.86));",
    "  --command-border: rgba(255, 255, 255, 0.16);",
    "  --command-text: #ffffff;",
    "  --command-muted: rgba(255, 255, 255, 0.72);",
    "}",
    "html[data-command-center='true'], html[data-command-center='true'] body { background: transparent !important; }",
    // Match the shell's scrollbar palette without changing each view's geometry.
    "html[data-command-center='true'] { scrollbar-color: #713b2b #050505; }",
    "html[data-command-center='true']::-webkit-scrollbar-track { background: #050505; }",
    "html[data-command-center='true']::-webkit-scrollbar-thumb { background: #713b2b; }",
    "html[data-command-center='true']::-webkit-scrollbar-thumb:hover { background: #bf6a45; }",
    "html[data-command-center='true'] body::before, html[data-command-center='true'] body::after { background: none !important; opacity: 0 !important; }",
    "body.command-center-embed :where(h1, h2) { text-wrap: balance; }",
    "body.command-center-embed h1 { font-weight: 500; text-shadow: 0 16px 56px rgba(0, 0, 0, 0.72); }",
    "body.command-center-embed :where(.button-secondary, .preview-download, .open-presentation, .expand-control, .carousel-arrow, .showcase-expand, .showcase-arrow, .legend-item, .mode-toggle button, .reset-filters) {",
    "  border-color: var(--command-border) !important;",
    "  background: var(--command-glass) !important;",
    "  color: var(--command-text) !important;",
    "  box-shadow: inset 0 1px rgba(255,255,255,0.11), 0 14px 34px rgba(0,0,0,0.42) !important;",
    "  -webkit-backdrop-filter: blur(18px) saturate(125%);",
    "  backdrop-filter: blur(18px) saturate(125%);",
    "}",
    "body.command-center-embed :where(.button-secondary, .preview-download, .open-presentation, .expand-control, .carousel-arrow, .showcase-expand, .showcase-arrow, .legend-item, .mode-toggle button, .reset-filters):hover {",
    "  border-color: rgba(191, 106, 69, 0.68) !important;",
    "  background: linear-gradient(145deg, rgba(191,106,69,0.25), rgba(20,18,18,0.88)) !important;",
    "}",
    "body.command-center-embed :where(.stat-card, .metric-card, .preview-card, .timeline-controls, .deck-toolbar, .preview-toolbar, .status-card) {",
    "  border-color: var(--command-border) !important;",
    "  background: var(--command-glass) !important;",
    "  box-shadow: inset 0 1px rgba(255,255,255,0.1), 0 22px 58px rgba(0,0,0,0.46) !important;",
    "}",
    "body.command-center-embed :where(.eyebrow, .section-kicker, .meta-label, .preview-label, .pub-kicker) { color: var(--command-muted) !important; }",
    "body.command-center-whitepaper .status-row { display: none !important; }",
    "body.command-center-whitepaper .page-shell { padding-top: clamp(0.75rem, 1.8vh, 1.35rem) !important; }",
    "body.command-center-whitepaper #whitepaper-title {",
    "  max-width: 14ch !important;",
    "  font-size: clamp(4.15rem, 5.7vw, 6.15rem) !important;",
    "  line-height: 0.92 !important;",
    "}",
    "body.command-center-whitepaper #whitepaper-title .command-whitepaper-name {",
    "  display: block;",
    "  color: var(--command-text) !important;",
    "}",
    "body.command-center-whitepaper #whitepaper-title em {",
    "  display: block;",
    "  margin-top: 0.05em;",
    "  background: linear-gradient(110deg, #e8c0ae 4%, #cf805f 48%, #a94f32 96%);",
    "  background-clip: text;",
    "  color: #cf805f;",
    "  font-size: 0.72em;",
    "  font-style: normal;",
    "  letter-spacing: -0.06em;",
    "  line-height: 1;",
    "  -webkit-background-clip: text;",
    "  -webkit-text-fill-color: transparent;",
    "}",
    "body.command-center-whitepaper .button-secondary { border-color: var(--command-border) !important; color: var(--command-text) !important; }",
    "body.command-center-deck main {",
    "  display: flex;",
    "  flex-direction: column;",
    "  width: min(100% - 1rem, 108rem) !important;",
    "  height: calc(100svh - 0.5rem);",
    "  min-height: 26rem;",
    "  padding-block: 0.2rem 0.35rem;",
    "}",
    "body.command-center-deck .deck-intro {",
    "  flex: none;",
    "  max-width: 78rem !important;",
    "  margin: 0.15rem auto 0.5rem !important;",
    "}",
    "body.command-center-deck #page-title {",
    "  display: flex;",
    "  flex-wrap: wrap;",
    "  align-items: baseline;",
    "  justify-content: center;",
    "  column-gap: 0.22em;",
    "  max-width: none !important;",
    "  margin-inline: auto !important;",
    "  text-align: center !important;",
    "  font-size: clamp(2.25rem, 3.8vw, 3.8rem) !important;",
    "  line-height: 1.03 !important;",
    "}",
    "body.command-center-deck #page-title .command-deck-name {",
    "  display: inline;",
    "  white-space: nowrap;",
    "  color: var(--command-text) !important;",
    "}",
    "body.command-center-deck #page-title em {",
    "  display: inline;",
    "  margin: 0;",
    "  white-space: nowrap;",
    "  background: linear-gradient(110deg, #e8c0ae 4%, #cf805f 48%, #a94f32 96%);",
    "  background-clip: text;",
    "  color: #cf805f;",
    "  font-size: 1em;",
    "  font-style: normal;",
    "  letter-spacing: -0.06em;",
    "  line-height: 1;",
    "  -webkit-background-clip: text;",
    "  -webkit-text-fill-color: transparent;",
    "}",
    "body.command-center-deck .deck-lead {",
    "  max-width: 66rem !important;",
    "  margin-top: 0.42rem !important;",
    "  font-size: clamp(1rem, 1.2vw, 1.15rem) !important;",
    "}",
    "body.command-center-deck .deck-experience {",
    "  flex: 1;",
    "  min-height: 0;",
    "  grid-template-rows: auto minmax(0, 1fr) auto !important;",
    "  width: min(100%, 106rem) !important;",
    "  row-gap: 0.45rem !important;",
    "  margin-bottom: 0.15rem !important;",
    "}",
    "body.command-center-deck .carousel-meta {",
    "  width: min(calc(100% - 2rem), 62rem) !important;",
    "  min-height: 3.35rem !important;",
    "  margin-bottom: 0 !important;",
    "}",
    "body.command-center-deck .carousel-viewport { height: auto !important; min-height: 0; container-type: size; }",
    // Leave room for the perspective enlargement and the slide's backing edge.
    "body.command-center-deck .deck-card { width: min(58.85%, 58.85rem, calc(165.85cqh - 3.317rem)) !important; }",
    "body.command-center-deck .command-deck-lower-rail {",
    "  position: relative !important;",
    "  z-index: 30 !important;",
    "  display: grid !important;",
    "  grid-area: caption !important;",
    "  grid-template-columns: minmax(0, 1fr) !important;",
    "  grid-template-rows: auto auto !important;",
    "  grid-template-areas: none !important;",
    "  justify-items: center !important;",
    "  gap: 0.55rem !important;",
    "  width: min(calc(100% - 2rem), 62rem) !important;",
    "  min-height: 4.1rem !important;",
    "  margin: 0 auto !important;",
    "  padding: 0 !important;",
    "}",
    "body.command-center-deck .command-deck-lower-rail .carousel-toolbar {",
    "  position: relative !important;",
    "  inset: auto !important;",
    "  transform: none !important;",
    "  grid-area: auto !important;",
    "  grid-column: 1 !important;",
    "  grid-row: 1 !important;",
    "  justify-self: center !important;",
    "  width: auto !important;",
    "  min-height: 0 !important;",
    "  margin: 0 !important;",
    "  padding: 0 !important;",
    "}",
    "body.command-center-deck .command-deck-lower-rail .carousel-caption {",
    "  position: relative !important;",
    "  inset: auto !important;",
    "  transform: none !important;",
    "  margin: 0 !important;",
    "  white-space: nowrap;",
    "}",
    "body.command-center-deck .command-deck-lower-rail .carousel-dots {",
    "  position: relative !important;",
    "  inset: auto !important;",
    "  transform: none !important;",
    "  grid-area: auto !important;",
    "  grid-column: 1 !important;",
    "  grid-row: 2 !important;",
    "  justify-self: center !important;",
    "  display: flex !important;",
    "  margin: 0 !important;",
    "}",
    "body.command-center-deck .site-footer { padding-top: 0.35rem !important; padding-bottom: 0.45rem !important; }",
    "@media (min-width: 901px) {",
    // Keep the viewport width steady when the progress dots extend below the fold.
    "  html[data-command-deck-fit-bound] { scrollbar-gutter: stable; }",
    "  body.command-center-deck { --command-deck-lift: clamp(1rem, calc(5svh + 0.25rem), 2.5rem); }",
    "  body.command-center-deck :is(.carousel-viewport, .command-deck-lower-rail) { top: calc(-1 * var(--command-deck-lift)); }",
    "  body.command-center-deck[data-command-deck-fit] .deck-card { width: var(--command-deck-fitted-width) !important; }",
    "  body.command-center-deck[data-command-deck-fit] .carousel-viewport { top: calc(var(--command-deck-center-shift) - var(--command-deck-lift)); }",
    "  body.command-center-deck[data-command-deck-fit] .command-deck-lower-rail { top: calc(var(--command-deck-caption-shift) - var(--command-deck-lift)); }",
    "  body.command-center-deck.command-deck-measuring .deck-card { transition: none !important; }",
    "}",
    "@media (max-height: 820px) and (min-width: 901px) {",
    "  body.command-center-deck #page-title { font-size: clamp(2rem, 3.4vw, 3.4rem) !important; }",
    "  body.command-center-deck .deck-card { width: min(55.64%, 52.43rem, calc(165.85cqh - 3.317rem)) !important; }",
    "  body.command-center-deck .command-deck-lower-rail { min-height: 3.65rem !important; gap: 0.4rem !important; }",
    "}",
    "@media (max-width: 900px) {",
    "  body.command-center-embed { min-width: 0 !important; overflow-x: hidden !important; }",
    "  body.command-center-embed :where(button:not(.carousel-dot), .button, .button-secondary, .preview-download, .open-presentation, .expand-control, .carousel-arrow, .showcase-expand, .showcase-arrow, .legend-item, .mode-toggle button, .reset-filters) { min-height: 2.75rem; }",
    "  body.command-center-whitepaper .page-shell {",
    "    width: min(calc(100% - 1.5rem), 42rem) !important;",
    "    gap: clamp(1.35rem, 4vw, 2rem) !important;",
    "    padding-top: clamp(0.45rem, 1.8vh, 0.9rem) !important;",
    "  }",
    "  body.command-center-whitepaper #whitepaper-title { font-size: clamp(3.15rem, 11vw, 5rem) !important; }",
    "  body.command-center-whitepaper .description { margin-top: 0.9rem !important; font-size: clamp(0.98rem, 3vw, 1.12rem) !important; }",
    "  body.command-center-whitepaper .actions { margin-top: 1.25rem !important; }",
    "  body.command-center-whitepaper .release-data { margin-top: 1.4rem !important; }",
    "  body.command-center-whitepaper .document-preview { width: min(100%, 29rem) !important; height: auto !important; min-height: 0 !important; margin-inline: auto !important; }",
    "  body.command-center-deck main { width: min(calc(100% - 1rem), 54rem) !important; height: auto; min-height: 0; }",
    "  body.command-center-deck .deck-intro { margin: 0.15rem auto 0.35rem !important; }",
    "  body.command-center-deck #page-title { font-size: clamp(1.9rem, 5vw, 2.8rem) !important; }",
    "  body.command-center-deck .deck-lead { max-width: 45rem !important; margin-top: 0.3rem !important; font-size: clamp(0.92rem, 2.7vw, 1.08rem) !important; }",
    "  body.command-center-deck .deck-experience { flex: none; width: 100% !important; row-gap: 0.3rem !important; }",
    "  body.command-center-deck .carousel-meta { width: min(calc(100% - 1rem), 48rem) !important; min-height: 3rem !important; }",
    "  body.command-center-deck .carousel-viewport { height: clamp(18rem, 55vw, 25rem) !important; }",
    "  body.command-center-deck .deck-card { width: min(72%, 40rem, calc(155cqh - 3.1rem)) !important; }",
    "  body.command-center-deck .command-deck-lower-rail { width: min(calc(100% - 1rem), 48rem) !important; min-height: 3.65rem !important; gap: 0.42rem !important; }",
    "  body.command-center-deck .command-deck-lower-rail .carousel-caption { max-width: calc(100vw - 2rem) !important; overflow: hidden; text-overflow: ellipsis; }",
    "  body.command-center-roadmap :where(.timeline-controls, .legend-shell, .filter-shell) { max-width: calc(100% - 1rem) !important; }",
    "  body.command-center-roadmap :where(.initiative-modal, .modal-panel) { max-width: calc(100% - 1rem) !important; max-height: calc(100svh - 1rem) !important; }",
    "}",
    "@media (max-width: 560px) {",
    "  body.command-center-whitepaper .page-shell { width: calc(100% - 1rem) !important; gap: 1.15rem !important; }",
    "  body.command-center-whitepaper #whitepaper-title { font-size: clamp(2.75rem, 14vw, 4rem) !important; }",
    "  body.command-center-whitepaper :where(.preview-toolbar, .preview-tools) { flex-wrap: wrap !important; }",
    "  body.command-center-whitepaper .actions :where(a, button) { min-height: 2.9rem !important; }",
    "  body.command-center-deck main { width: calc(100% - 0.65rem) !important; }",
    "  body.command-center-deck #page-title { font-size: clamp(1.65rem, 6vw, 2rem) !important; }",
    "  body.command-center-deck .deck-lead { padding-inline: 0.5rem !important; font-size: 0.9rem !important; line-height: 1.42 !important; }",
    "  body.command-center-deck .carousel-meta { width: calc(100% - 0.5rem) !important; min-height: 2.85rem !important; }",
    "  body.command-center-deck .carousel-viewport { height: clamp(15rem, 66vw, 20rem) !important; }",
    "  body.command-center-deck .deck-card { width: min(82%, 32rem, calc(155cqh - 3.1rem)) !important; }",
    "  body.command-center-deck .command-deck-lower-rail { width: calc(100% - 0.5rem) !important; min-height: 3.35rem !important; gap: 0.35rem !important; }",
    "  body.command-center-deck .command-deck-lower-rail .carousel-caption { max-width: calc(100vw - 1.25rem) !important; font-size: 0.82rem !important; }",
    "  body.command-center-deck .command-deck-lower-rail .carousel-dots { max-width: calc(100vw - 1.25rem) !important; gap: 0.28rem !important; }",
    "}",
    "@media (max-height: 560px) and (min-width: 641px) {",
    "  body.command-center-whitepaper .page-shell { gap: 1rem !important; padding-top: 0.35rem !important; }",
    "  body.command-center-whitepaper #whitepaper-title { font-size: clamp(2.8rem, 7vw, 4rem) !important; }",
    "  body.command-center-deck .deck-intro { margin-top: 0 !important; }",
    "  body.command-center-deck #page-title { font-size: clamp(1.9rem, 3.2vw, 2.6rem) !important; }",
    "  body.command-center-deck .deck-lead { margin-top: 0.2rem !important; font-size: 0.88rem !important; }",
    "  body.command-center-deck .command-deck-lower-rail { min-height: 3.1rem !important; }",
    "}",
    "body.command-center-roadmap :where(.showcase-section-title, .timeline-section-title) { color: var(--command-text) !important; }"
  ].join("\n");

  function normalize(name) {
    return Object.prototype.hasOwnProperty.call(VIEWS, name) ? name : "overview";
  }

  function sectionFor(name) {
    return document.getElementById("view-" + name);
  }

  function fitEmbeddedDeck(frame) {
    var doc = frame.contentDocument;
    var view = frame.contentWindow;
    var viewport = doc.querySelector(".carousel-viewport");
    if (!viewport || doc.documentElement.dataset.commandDeckFitBound) { return; }
    doc.documentElement.dataset.commandDeckFitBound = "true";
    var pending = 0;

    function updateFit() {
      pending = 0;
      var body = doc.body;
      try {
        if (view.innerWidth <= 900) { return; }
        var card = doc.querySelector('.deck-card[data-position="active"]');
        var caption = doc.querySelector(".carousel-caption");
        var rail = doc.querySelector(".command-deck-lower-rail");
        if (!card || !caption || !rail) { return; }

        // Measure the existing composition at rest before growing from its top edge.
        var cardBox = card.getBoundingClientRect();
        var railBox = rail.getBoundingClientRect();
        var baseWidth = parseFloat(view.getComputedStyle(card).width);
        var projectedScale = cardBox.width / baseWidth;
        if (!Number.isFinite(projectedScale) || projectedScale <= 0 || baseWidth < 10) { return; }

        var captionGap = 24; // Includes clearance for the decorative backing edge.
        var bottomClearance = 12;
        var top = cardBox.top + view.scrollY;
        var availableHeight = doc.documentElement.clientHeight - top
          - caption.getBoundingClientRect().height - captionGap - bottomClearance;
        var fittedWidth = Math.min(
          availableHeight * 16 / 9 / projectedScale,
          viewport.clientWidth * 0.8 / projectedScale
        );
        if (fittedWidth <= baseWidth) { return; }

        var fittedHeight = fittedWidth * projectedScale * 9 / 16;
        // Moving the perspective container avoids changing the slide's top edge.
        body.style.setProperty("--command-deck-fitted-width", fittedWidth + "px");
        body.style.setProperty("--command-deck-center-shift", ((fittedHeight - cardBox.height) / 2) + "px");
        body.style.setProperty("--command-deck-caption-shift", (cardBox.top + fittedHeight + captionGap - railBox.top) + "px");
        body.setAttribute("data-command-deck-fit", "true");
      } finally {
        body.classList.remove("command-deck-measuring");
      }
    }

    function scheduleFit() {
      if (pending) { view.cancelAnimationFrame(pending); }
      doc.body.removeAttribute("data-command-deck-fit");
      doc.body.classList.add("command-deck-measuring");
      // Let container units and perspective transforms return to their baseline
      // before measuring; otherwise a fresh load can retain the previous fit.
      pending = view.requestAnimationFrame(function () {
        pending = view.requestAnimationFrame(updateFit);
      });
    }

    view.addEventListener("resize", scheduleFit);
    // Container-query dimensions settle after the flex/grid layout completes.
    var observer = new view.ResizeObserver(scheduleFit);
    observer.observe(viewport);
    if (doc.fonts) { doc.fonts.ready.then(scheduleFit); }
    scheduleFit();
  }

  function normalizeEmbeddedView(frame, name) {
    try {
      var doc = frame.contentDocument;
      if (!doc || !doc.head || !doc.body) { return; }
      doc.documentElement.dataset.commandCenter = "true";
      doc.body.classList.add("command-center-embed", "command-center-" + name);
      if (name === "deck") {
        var deckTitle = doc.getElementById("page-title");
        if (deckTitle && !deckTitle.dataset.commandCenterTitle) {
          deckTitle.innerHTML = '<span class="command-deck-name">NeuroLab:</span> <em>Project Deck</em>';
          deckTitle.dataset.commandCenterTitle = "true";
        }
        var deckExperience = doc.querySelector(".deck-experience");
        var deckViewport = doc.querySelector(".carousel-viewport");
        var deckToolbar = doc.querySelector(".carousel-toolbar");
        var deckDots = doc.querySelector(".carousel-dots");
        if (deckExperience && deckViewport && deckToolbar && deckDots && !doc.querySelector(".command-deck-lower-rail")) {
          var deckLowerRail = doc.createElement("div");
          deckLowerRail.className = "command-deck-lower-rail";
          deckLowerRail.setAttribute("aria-label", "Current slide and presentation progress");
          deckViewport.insertAdjacentElement("afterend", deckLowerRail);
          deckLowerRail.appendChild(deckToolbar);
          deckLowerRail.appendChild(deckDots);
        }
      }
      if (name === "whitepaper") {
        var whitepaperTitle = doc.getElementById("whitepaper-title");
        if (whitepaperTitle && !whitepaperTitle.dataset.commandCenterTitle) {
          whitepaperTitle.innerHTML = '<span class="command-whitepaper-name">NeuroLab:</span> <em>The Whitepaper</em>';
          whitepaperTitle.dataset.commandCenterTitle = "true";
        }
      }
      if (!doc.getElementById("command-center-normalization")) {
        var style = doc.createElement("style");
        style.id = "command-center-normalization";
        style.textContent = EMBED_STYLES;
        doc.head.appendChild(style);
      }
      if (name === "deck") { fitEmbeddedDeck(frame); }
    } catch (error) {
      // The local preview loads production publications cross-origin. Once
      // deployed, all views share an origin and receive this visual layer.
    }
  }

  function mountFrame(name) {
    if (mounted[name]) { return; }
    var section = sectionFor(name);
    var frame = document.createElement("iframe");
    frame.src = VIEWS[name];
    frame.title = "NeuroLab " + name;
    frame.setAttribute("allow", "fullscreen");
    frame.setAttribute("allowfullscreen", "");
    loadingIndicator.hidden = false;
    frame.addEventListener("load", function () {
      normalizeEmbeddedView(frame, name);
      loadingIndicator.hidden = true;
    });
    section.appendChild(frame);
    mounted[name] = true;
  }

  function keepActiveTabVisible(tab) {
    var scroller = tab && tab.closest(".view-switch");
    if (!scroller || scroller.scrollWidth <= scroller.clientWidth) { return; }
    var target = tab.offsetLeft - ((scroller.clientWidth - tab.offsetWidth) / 2);
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({
      left: Math.max(0, target),
      behavior: reducedMotion ? "auto" : "smooth"
    });
  }

  function setView(name, push) {
    name = normalize(name);
    if (name === current) { return; }
    current = name;

    Object.keys(VIEWS).forEach(function (key) {
      var section = sectionFor(key);
      if (section) { section.hidden = key !== name; }
    });

    if (VIEWS[name]) { mountFrame(name); }
    else { loadingIndicator.hidden = true; }

    var activeTab = null;
    tabs.forEach(function (tab) {
      if (tab.dataset.view === name) {
        tab.setAttribute("aria-current", "page");
        activeTab = tab;
      } else {
        tab.removeAttribute("aria-current");
      }
    });

    if (activeTab) {
      window.requestAnimationFrame(function () { keepActiveTabVisible(activeTab); });
    }

    document.body.classList.toggle("frame-active", Boolean(VIEWS[name]));
    document.title = TITLES[name];

    if (push) {
      var url = name === "overview" ? "./" : "?view=" + name;
      history.pushState({ view: name }, "", url);
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setView(tab.dataset.view, true);
    });
  });

  openButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setView(button.dataset.view, true);
    });
  });

  document.getElementById("wordmark-home").addEventListener("click", function (event) {
    event.preventDefault();
    setView("overview", true);
  });

  window.addEventListener("popstate", function (event) {
    var name = event.state && event.state.view
      ? event.state.view
      : new URLSearchParams(location.search).get("view") || "overview";
    setView(name, false);
  });

  var initial = normalize(new URLSearchParams(location.search).get("view") || "overview");
  history.replaceState({ view: initial }, "", initial === "overview" ? "./" : "?view=" + initial);
  setView(initial, false);
}());
