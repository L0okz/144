/* Landing-page diagnostics only. Never included by jb.html. */
(function () {
  "use strict";
  var KEY = "afterglow.choice";
  function byId(id) { return document.getElementById(id); }
  function set(id, value, state) {
    var el = byId(id);
    if (!el) return;
    el.textContent = value;
    el.className = "diag-value" + (state ? " " + state : "");
  }
  function cacheState() {
    var ac = window.applicationCache;
    if (!ac) return { value: "Not supported", state: "warn", note: "This browser does not expose the legacy offline cache API." };
    try {
      var names = ["UNCACHED", "IDLE", "CHECKING", "DOWNLOADING", "UPDATEREADY", "OBSOLETE"];
      var labels = ["Not installed", "Ready", "Checking", "Downloading", "Update ready", "Obsolete"];
      for (var i = 0; i < names.length; i++) {
        if (typeof ac[names[i]] === "number" && ac.status === ac[names[i]]) {
          var state = (i === 1 || i === 4) ? "ok" : (i === 0 || i === 5) ? "warn" : "pending";
          return { value: labels[i], state: state, note: i === 1 ? "Offline cache reports ready." : i === 4 ? "A cache update is ready; reload the launcher to apply it." : "Cache state is reported by the browser." };
        }
      }
      return { value: "Unknown state", state: "warn", note: "The browser returned an unrecognized cache status." };
    } catch (e) {
      return { value: "Unavailable", state: "warn", note: "The browser blocked access to cache status." };
    }
  }
  function storageState() {
    try {
      if (!window.localStorage) return { value: "Unavailable", state: "warn" };
      var saved = localStorage.getItem(KEY);
      if (!saved) return { value: "Available · defaults", state: "ok" };
      var parsed = JSON.parse(saved);
      if (!parsed || (parsed.payload !== "hen" && parsed.payload !== "goldhen") || typeof parsed.autostart !== "boolean") {
        return { value: "Saved data invalid", state: "warn" };
      }
      return { value: "Available · saved", state: "ok" };
    } catch (e) { return { value: "Blocked", state: "warn" }; }
  }
  function run() {
    var cache = cacheState();
    var storage = storageState();
    var payload = "GoldHEN";
    var auto = "Enabled";
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved && (saved.payload === "hen" || saved.payload === "goldhen")) payload = saved.payload === "hen" ? "PS4 HEN" : "GoldHEN";
        if (saved && typeof saved.autostart === "boolean") auto = saved.autostart ? "Enabled" : "Disabled";
      }
    } catch (e) { payload = "Defaults"; auto = "Unavailable"; }
    set("diag-cache", cache.value, cache.state);
    set("diag-storage", storage.value, storage.state);
    set("diag-payload", payload, "");
    set("diag-auto", auto, auto === "Enabled" ? "ok" : "");
    var note = byId("diag-note");
    if (note) note.textContent = cache.note + " Diagnostics are read-only and do not test or execute payload files.";
  }
  var button = byId("diag-refresh");
  if (button) button.addEventListener("click", run);
  run();
})();
