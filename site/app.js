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
    deck: "NeuroLab — Slide Deck",
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
    "  max-width: 11ch !important;",
    "  font-size: clamp(4.4rem, 7.6vw, 7.35rem) !important;",
    "  line-height: 0.91 !important;",
    "}",
    "body.command-center-whitepaper .button-secondary { border-color: var(--command-border) !important; color: var(--command-text) !important; }",
    "body.command-center-deck main { width: min(100% - 1rem, 108rem) !important; }",
    "body.command-center-deck .deck-intro {",
    "  max-width: 78rem !important;",
    "  margin: clamp(0.25rem, 0.8vh, 0.65rem) auto clamp(0.4rem, 0.9vh, 0.75rem) !important;",
    "}",
    "body.command-center-deck #page-title {",
    "  font-size: clamp(4.15rem, 5.7vw, 6.15rem) !important;",
    "  line-height: 0.92 !important;",
    "}",
    "body.command-center-deck #page-title .command-deck-name { color: var(--command-text) !important; }",
    "body.command-center-deck .deck-lead {",
    "  max-width: 66rem !important;",
    "  margin-top: 0.42rem !important;",
    "  font-size: clamp(1rem, 1.2vw, 1.15rem) !important;",
    "}",
    "body.command-center-deck .deck-experience {",
    "  width: min(100%, 106rem) !important;",
    "  row-gap: 0.45rem !important;",
    "  margin-bottom: 0.15rem !important;",
    "}",
    "body.command-center-deck .carousel-meta {",
    "  width: min(calc(100% - 2rem), 72rem) !important;",
    "  min-height: 3.35rem !important;",
    "}",
    "body.command-center-deck .carousel-viewport { height: clamp(27rem, 31vw, 33rem) !important; }",
    "body.command-center-deck .deck-card { width: min(58%, 58rem) !important; }",
    "body.command-center-deck .carousel-toolbar { width: min(calc(100% - 2rem), 72rem) !important; }",
    "body.command-center-deck .site-footer { padding-top: 0.35rem !important; padding-bottom: 0.45rem !important; }",
    "@media (max-height: 820px) and (min-width: 901px) {",
    "  body.command-center-deck #page-title { font-size: clamp(3.75rem, 5vw, 5.35rem) !important; }",
    "  body.command-center-deck .carousel-viewport { height: clamp(23rem, calc(100svh - 17rem), 28rem) !important; }",
    "  body.command-center-deck .deck-card { width: min(56%, 52rem) !important; }",
    "}",
    "body.command-center-roadmap :where(.showcase-section-title, .timeline-section-title) { color: var(--command-text) !important; }"
  ].join("\n");

  function normalize(name) {
    return Object.prototype.hasOwnProperty.call(VIEWS, name) ? name : "overview";
  }

  function sectionFor(name) {
    return document.getElementById("view-" + name);
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
          deckTitle.innerHTML = '<span class="command-deck-name">NeuroLab:</span> <em>Slide Deck</em>';
          deckTitle.dataset.commandCenterTitle = "true";
        }
      }
      if (!doc.getElementById("command-center-normalization")) {
        var style = doc.createElement("style");
        style.id = "command-center-normalization";
        style.textContent = EMBED_STYLES;
        doc.head.appendChild(style);
      }
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

    tabs.forEach(function (tab) {
      if (tab.dataset.view === name) {
        tab.setAttribute("aria-current", "page");
      } else {
        tab.removeAttribute("aria-current");
      }
    });

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
