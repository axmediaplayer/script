(function () {
  "use strict";

  const BTN_CLASS = "ig-url-btn";

  observe();

  function observe() {
    const observer = new MutationObserver(() => scan());
    observer.observe(document.body, { childList: true, subtree: true });
    scan();
  }

  function scan() {
    document.querySelectorAll("article, video").forEach((el) => {
      const container = el.closest("article") || el.closest("div");

      if (!container || container.querySelector("." + BTN_CLASS)) return;

      inject(container);
    });
  }

  function inject(container) {
    const btn = document.createElement("button");
    btn.className = BTN_CLASS;
    btn.innerText = "Get URL";

    Object.assign(btn.style, {
      position: "absolute",
      bottom: "10px",
      right: "10px",
      zIndex: "99999",
      padding: "6px 10px",
      background: "black",
      color: "#fff",
      borderRadius: "6px",
      fontSize: "12px",
      cursor: "pointer"
    });

    btn.onclick = async () => {
      let url = await getPostUrl(container);

      if (!url) {
        url = await getViaThreeDot(container);
      }

      if (url) {
        await navigator.clipboard.writeText(url);
        flash(btn, "Copied ✔");
      } else {
        flash(btn, "Fail ❌");
      }
    };

    container.style.position = "relative";
    container.appendChild(btn);
  }

  // =========================
  // 🎯 METHOD 1 (ANCHOR / OPEN)
  // =========================
  async function getPostUrl(container) {

    let link = container.querySelector("a[href*='/p/'], a[href*='/reel/']");
    if (link) return location.origin + link.getAttribute("href");

    const clickable = container.querySelector("a, div[role='button']");
    if (!clickable) return null;

    const oldUrl = location.href;

    forceClick(clickable);

    return new Promise((resolve) => {
      setTimeout(() => {
        const newUrl = location.href;

        if (newUrl !== oldUrl && (newUrl.includes("/p/") || newUrl.includes("/reel/"))) {

          document.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Escape",
            keyCode: 27
          }));

          resolve(newUrl);
        } else {
          resolve(null);
        }
      }, 800);
    });
  }

  // =========================
  // 🎯 METHOD 2 (3 DOT FORCE)
  // =========================
  async function getViaThreeDot(container) {

    try {
      // ✅ find exact 3-dot button
      let moreSvg = container.querySelector("svg[aria-label='More']");

      if (!moreSvg) {
        // fallback → visible one
        moreSvg = [...document.querySelectorAll("svg[aria-label='More']")]
          .find(el => isVisible(el));
      }

      if (!moreSvg) return null;

      const btn = moreSvg.closest("div[role='button']");
      if (!btn) return null;

      // 🔥 force click
      forceClick(btn);

      await wait(800);

      // ✅ find Copy link
      const options = [...document.querySelectorAll("div[role='button'], button")];

      let copyBtn = options.find(el => {
        const txt = (el.innerText || "").toLowerCase();
        return txt.includes("copy link");
      });

      if (!copyBtn) return null;

      forceClick(copyBtn);

      await wait(500);

      const text = await navigator.clipboard.readText();

      return text || null;

    } catch (e) {
      console.log("3-dot error", e);
      return null;
    }
  }

  // =========================
  // 🎯 FORCE CLICK (IMPORTANT)
  // =========================
  function forceClick(el) {
    el.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    }));
  }

  function isVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  function flash(btn, text) {
    const old = btn.innerText;
    btn.innerText = text;
    setTimeout(() => btn.innerText = old, 1500);
  }

})();