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
    document.querySelectorAll("video").forEach((el) => {
      const container = el.closest("article") || el.closest("div");

      if (!container || container.querySelector("." + BTN_CLASS)) return;

      inject(container);
    });
  }

  function inject(container) {
   const btn = document.createElement("button");
   btn.className = BTN_CLASS;

   const svgIcon = `
    <svg viewBox="0 0 24 24" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C11.4477 2 11 2.44772 11 3V13.5858L8.70711 11.2929C8.31658 10.9024 7.68342 10.9024 7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L16.7071 12.7071C17.0976 12.3166 17.0976 11.6834 16.7071 11.2929C16.3166 10.9024 15.6834 10.9024 15.2929 11.2929L13 13.5858V3C13 2.44772 12.5523 2 12 2Z"></path>
        <path d="M4 18C3.44772 18 3 18.4477 3 19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19C21 18.4477 20.5523 18 20 18H4Z"></path>
    </svg>`;

   btn.innerHTML = svgIcon;

   Object.assign(btn.style, {
     position: "absolute",
     bottom: "150px",
     right: "15px",
     zIndex: "99999",
     width: "50px",
     height: "50px",
     backgroundColor: "#FF0000",
     borderRadius: "50%",
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
     cursor: "pointer",
     border: "2px solid white",
     boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
   });

    btn.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      let url = await getPostUrl(container);

      if (!url) {
        url = await getViaThreeDot(container);
        if(url==null){
        JavaInterface.onCopyClick();
        }
      }

      if (url) {

        JavaInterface.onUrlClick(url);

      }
    };

    container.style.position = "relative";
    container.appendChild(btn);
  }


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

  async function getViaThreeDot(container) {
    try {
      let moreSvg = container.querySelector("svg[aria-label='More']");
      if (!moreSvg) {
        moreSvg = [...document.querySelectorAll("svg[aria-label='More']")]
          .find(el => isVisible(el));
      }
      if (!moreSvg) return null;

      const btn = moreSvg.closest("div[role='button']");
      if (!btn) return null;

      forceClick(btn);
      await wait(800);

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

})();