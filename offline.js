/* Registers the offline cache when the browser supports Service Workers.
   Service Workers require HTTPS, or localhost; plain LAN HTTP may be rejected. */
(function () {
  var status = document.getElementById("offline-status");
  function say(message) {
    if (status) status.textContent = message;
  }

  window.__offlineReady = Promise.resolve();

  if (!("serviceWorker" in navigator)) {
    say("offline cache: unsupported by this browser");
    return;
  }

  var secure = window.isSecureContext ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";
  if (!secure) {
    say("offline cache: requires HTTPS (or localhost)");
    return;
  }

  say("offline cache: preparing files...");
  window.__offlineReady = navigator.serviceWorker.register("./sw.js")
    .then(function (registration) {
      return navigator.serviceWorker.ready.then(function () {
        say("offline cache: ready");
        return registration;
      });
    })
    .catch(function (error) {
      say("offline cache: unavailable (" + (error && error.message ? error.message : "registration failed") + ")");
    });
})();
