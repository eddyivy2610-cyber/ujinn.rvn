(() => {
  const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
  const supportsIO = "IntersectionObserver" in window;
  let observer = null;

  function markLoaded(img) {
    img.classList.add("is-loaded");
  }

  function loadImage(img) {
    const src = img.getAttribute("data-src");
    if (!src) return;
    img.classList.add("lazy-img");
    img.addEventListener(
      "load",
      () => {
        markLoaded(img);
      },
      { once: true }
    );
    img.src = src;
    img.removeAttribute("data-src");
    img.removeAttribute("data-lazy");
    if (img.complete) {
      markLoaded(img);
    }
  }

  function ensureObserver() {
    if (!supportsIO || observer) return;
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          observer.unobserve(img);
          loadImage(img);
        });
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );
  }

  function observeImage(img) {
    if (!img || img.getAttribute("data-lazy-observed") === "1") return;
    img.setAttribute("data-lazy-observed", "1");

    img.classList.add("lazy-img");
    if (!img.getAttribute("src")) {
      img.setAttribute("src", transparentPixel);
    }

    if (!supportsIO) {
      loadImage(img);
      return;
    }

    ensureObserver();
    observer.observe(img);
  }

  window.setupLazyImages = function(root = document) {
    const scope = root || document;
    const images = scope.querySelectorAll("img[data-src], img[data-lazy]");
    images.forEach(observeImage);
  };

  document.addEventListener("DOMContentLoaded", () => {
    window.setupLazyImages();
  });
})();
