// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later

document.body.classList.add("can-test-connectivity");

const failures = new Map();
// default is the control group (if any tests fail, we wont check other groups)
failures.set("default", { ok: 0, ko: 0 });
failures.set("ipv4", { ok: 0, ko: 0 });
failures.set("ipv6", { ok: 0, ko: 0 });

function updateFailureState() {
  for (const failureMode of failures.keys()) {
    // do not probe the control group
    if (failureMode == "default") continue;

    // just like me frfr
    const isCompleteFailure =
      (failures.get(failureMode).ko > 0) &&
      (failures.get(failureMode).ok == 0) &&
      (failures.get("default").ok > 0) &&
      (failures.get("default").ko == 0);

    if (isCompleteFailure) {
      console.warn(`Probably "${failureMode}" failure mode`);
    }

    document.body.classList.toggle(
      "failure-" + failureMode,
      isCompleteFailure
    );
  }
}

function testConnectivity() {
  if (window._GLOBAL_LOCK) {
    window.warn("testConnectivity skipped due to a global lock");
    return;
  }
  window._GLOBAL_LOCK = true;

  console.log("Testing connectivity...");

  const selected = Array.from(document.getElementsByClassName("test-connectivity"));
  let remaining = selected.length;
  selected.forEach(async elem => {
    elem.classList.add("wait");

    let ok = false;
    try {
      ok = (await fetch(elem.dataset.url, {
        signal: AbortSignal?.timeout(5000) // Timeout after 5 seconds
      }).then(res => res.text())).includes("OK");
    } catch (e) {
      console.error(e);
    }
    elem.classList.add(ok ? "ok" : "ko");

    const failureMode = elem.dataset.anal ?? "default";
    failures.get(failureMode)[ok ? "ok" : "ko"]++;

    console.log(ok ? "OK" : "KO", elem.dataset.url, failureMode);
    updateFailureState();

    elem.classList.remove("wait");
    if (--remaining === 0) {
      console.log("Connectivity test completed, failures:", failures);
      window._GLOBAL_LOCK = false;
    }
  });
}

// wait until all other resources are loaded
if (document.readyState === "complete") {
  testConnectivity();
} else {
  console.log("Waiting for the page to fully load...");
  window.addEventListener("load", testConnectivity);
}

// @license-end