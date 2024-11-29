// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT

const ONEKO = "https://cdn.jsdelivr.net/gh/adryd325/oneko.js@b323d71126726e4487c10f0d75fc47ac37ead11c";

const loader = () => {
  console.log("kibty :3");
  fetch(`${ONEKO}/oneko.js`)
    .then(response => response.text())
    .then(text => (new Function(
      // Fix image URL
      text.replace("./oneko.gif", `${ONEKO}/oneko.gif`)
    ))());
};

// wait until all other resources are loaded
window.addEventListener("load", loader);

// @license-end