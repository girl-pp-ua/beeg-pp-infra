// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
document.body.classList.add("can-test-connectivity");
Array.from(document.getElementsByClassName("test-connectivity")).forEach(async elem => {
  elem.classList.add("wait");
  const ok = (await fetch(elem.dataset.url).then(res => res.text())).includes("OK");
  elem.classList.add(ok ? "ok" : "ko");
});
// @license-end