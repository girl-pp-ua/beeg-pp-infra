// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later

document.body.classList.add("can-test-connectivity");

const failures = new Map();
failures.set("default", { ok: 0, ko: 0 })
failures.set("ipv6", { ok: 0, ko: 0 });

function updateFailureState(failureMode) {
  // just like me frfr
  const isCompleteFailure =
    (failures.get(failureMode).ko > 0) &&
    (failures.get(failureMode).ok == 0) &&
    (failures.get("default").ko == 0);

  document.body.classList.toggle(
    "failure-" + failureMode,
    isCompleteFailure
  );
}

Array.from(document.getElementsByClassName("test-connectivity")).forEach(async elem => {
  elem.classList.add("wait");

  let ok = false;
  try {
    ok = (await fetch(elem.dataset.url, {
      signal: AbortSignal.timeout(5000) // Timeout after 5 seconds
    }).then(res => res.text())).includes("OK");
  } catch (e) {
    console.error(e);
  }
  elem.classList.add(ok ? "ok" : "ko");

  const failureMode = elem.dataset.anal ?? "default";
  failures.get(failureMode)[ok ? "ok" : "ko"]++;

  updateFailureState(failureMode);
});

// @license-end