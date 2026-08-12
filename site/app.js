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

  function normalize(name) {
    return Object.prototype.hasOwnProperty.call(VIEWS, name) ? name : "overview";
  }

  function sectionFor(name) {
    return document.getElementById("view-" + name);
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
      loadingIndicator.hidden = true;
    }, { once: true });
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
