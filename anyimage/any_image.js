(function () {

  function isBigImage(el) {
    const rect = el.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;
    const naturalWidth = el.naturalWidth || width;
    const naturalHeight = el.naturalHeight || height;

    return (
      width >= 200 &&
      height >= 200 &&
      naturalWidth >= 300 &&
      naturalHeight >= 300
    );
  }

  function isVisible(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0
    );
  }

  function addBtn(el, getUrl) {

    if (el.dataset.btnAdded) return;
    el.dataset.btnAdded = "true";

    const btn = document.createElement('div');
    btn.innerText = 'GET';

    btn.style.cssText = `
            position:absolute;
            top:8px;
            right:8px;
            z-index:9999;
            background:red;
            color:#fff;
            padding:5px 8px;
            font-size:12px;
            border-radius:5px;
            cursor:pointer;
        `;

    const parent = el.parentElement;
    if (!parent) return;

    if (getComputedStyle(parent).position === "static") {
      parent.style.position = "relative";
    }

    btn.onclick = () => {
      const url = getUrl();
      if (!url) return ;
      const urls = [url];
       JavaInterface.onPhotosClick(JSON.stringify(urls))
    };

    parent.appendChild(btn);
  }

  function scan() {


    document.querySelectorAll("img").forEach(img => {
      if (isVisible(img) && isBigImage(img)) {
        addBtn(img, () => img.currentSrc || img.src);
      }
    });


    document.querySelectorAll('[style*="background"]').forEach(el => {

      if (!isVisible(el)) return;

      const rect = el.getBoundingClientRect();
      if (rect.width < 200 || rect.height < 200) return;

      const bg = getComputedStyle(el).backgroundImage;
      if (!bg || bg === "none") return;

      const match = bg.match(/url\(["']?(.*?)["']?\)/);
      if (!match) return;

      addBtn(el, () => match[1]);
    });
  }

  let timeout;
  function triggerScan() {
    clearTimeout(timeout);
    timeout = setTimeout(scan, 300);
  }

  setTimeout(scan, 1000);

  window.addEventListener('scroll', triggerScan);

  new MutationObserver(triggerScan).observe(document.body, {
    childList: true,
    subtree: true
  });

})();