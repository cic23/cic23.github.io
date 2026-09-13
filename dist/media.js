/* Start media only after text has painted and the element is near the viewport. */
(() => {
  'use strict';
  let observer, queue = [], active = new Set(), generation = 0;
  function pump() {
    while (active.size < 3 && queue.length) {
      const el = queue.shift();
      if (!el.isConnected || !el.dataset.mediaSrc) continue;
      const url = el.dataset.mediaSrc;
      delete el.dataset.mediaSrc;
      // Videos retain their controls but download only when the reader plays them.
      if (el.tagName === 'VIDEO') { el.src = url; continue; }
      let timer;
      const finish = () => {
        clearTimeout(timer);
        el.removeEventListener('load', finish);
        el.removeEventListener('error', finish);
        active.delete(cancel);
        el.classList.remove('media-pending');
        pump();
      };
      const cancel = () => { el.removeAttribute('src'); finish(); };
      active.add(cancel);
      el.addEventListener('load', finish);
      el.addEventListener('error', finish);
      timer = setTimeout(cancel, 15000);
      el.src = url;
    }
  }
  function observe(root) {
    const stamp = generation;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (stamp !== generation || !root.isConnected) return;
      if (!observer && window.IntersectionObserver) observer = new IntersectionObserver(entries => {
        entries.forEach(({target, isIntersecting}) => {
          if (!isIntersecting) return;
          observer.unobserve(target);
          queue.push(target);
        });
        pump();
      }, {rootMargin:'160px'});
      root.querySelectorAll('[data-media-src]').forEach(el => {
        if (el.dataset.mediaObserved) return;
        el.dataset.mediaObserved = 'true';
        if (observer) observer.observe(el);
        else queue.push(el);
      });
      pump();
    }));
  }
  function reset() {
    generation++;
    observer?.disconnect(); observer = null; queue = [];
    [...active].forEach(cancel => cancel());
  }
  window.CIC_MEDIA = {observe, reset};
})();
