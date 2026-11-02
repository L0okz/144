OX PS4 — Offline Cache update
================================

Changes:
- Added sw.js to precache the landing page, exploit page, JavaScript modules,
  image, and the three payload/patch binary assets.
- Added offline.js to register the Service Worker and display cache status.
- Updated index.html to load the registration helper.
- Updated launch.js so first-visit autostart waits for the cache registration
  attempt to finish.
- Updated serve.sh to send a revalidation policy for sw.js.

Important compatibility notes:
- Service Workers require a secure origin (HTTPS), with localhost as the
  usual development exception. A plain http://LAN-IP:8000 address may be
  rejected by the PS4 browser.
- The browser must visit the landing page online once and allow the cache
  installation to complete before disconnecting.
- Actual offline operation depends on Service Worker and Cache API support in
  the PS4 browser/firmware. This was source-checked, not console-tested.
- Do not assume the offline cache is ready unless the landing page displays
  "offline cache: ready".
- The original exploit source modules and .bin payload files were not changed.
- To refresh the cached files after an update, the cache version in sw.js
  should be incremented (ox-ps4-offline-v2, etc.).

Test checklist on the target console:
1. Open the project over HTTPS.
2. Wait for "offline cache: ready".
3. Reload once while still online.
4. Disconnect network access and reopen the same origin in the browser.
5. Confirm the landing page and required assets load. Test the exploit only
   in an environment and firmware for which the original project is intended.
