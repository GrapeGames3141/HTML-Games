/* Injected early into published arcade pages by tools/build-pages.py. */
(() => {
  'use strict';
  const game = window.__arcadeQuickHideGame || '';
  const destination = 'https://keytrainsecure.com/';
  let hiding = false;
  let hadPointerLock = false;

  function hide(event) {
    if (hiding) return;
    hiding = true;
    if (event) {
      if (event.cancelable) event.preventDefault();
      event.stopImmediatePropagation();
    }
    const cover = document.createElement('div');
    cover.id = 'arcade-quick-hide-cover';
    cover.setAttribute('aria-hidden', 'true');
    cover.style.cssText = 'position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;z-index:2147483647!important;background:#fff!important;display:block!important;';
    document.documentElement.appendChild(cover);
    window.location.assign(destination);
  }
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      document.getElementById('arcade-quick-hide-cover')?.remove();
      hiding = false;
      hadPointerLock = false;
    }
  });
  function editing(target) {
    return target instanceof Element && (target.isContentEditable || !!target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'));
  }
  window.addEventListener('keydown', event => {
    if (hiding || event.isComposing || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
    const escape = event.key === 'Escape';
    const pause = event.code === 'KeyP' || event.code === 'Backquote' || event.key === 'Pause';
    const eagleSpace = game === 'appalachian-eagle' && event.code === 'Space' && document.body && document.body.classList.contains('play') && !editing(event.target);
    if (escape || (pause && !editing(event.target)) || eagleSpace) hide(event);
  }, true);
  const selectors = [
    '[data-arcade-pause]', 'button[aria-label^="Pause" i]', '[role="button"][aria-label^="Pause" i]',
    'button[title^="Pause" i]', '[role="button"][title^="Pause" i]'
  ];
  if (game === 'prism-swarm') selectors.push('[data-b="p"]');
  if (game === 'appalachian-eagle') selectors.push('#tp');
  if (game === 'splat' || game === 'ashgrove') selectors.push('#bPause');
  if (game === 'broadside' || game === 'merlin') selectors.push('#tPause');
  if (game === 'splatcraft') selectors.push('[data-a="menu"]');
  if (game === 'castle-defense') selectors.push('button[onclick*="openWorkplaceReader"]');
  function onPointer(event) {
    if (hiding || document.hidden) return;
    if (game === 'castle-defense' && event.type === 'touchstart' && event.touches.length >= 2) return hide(event);
    const target = event.target;
    if (target instanceof Element && target.closest(selectors.join(','))) hide(event);
  }
  for (const type of ['pointerdown', 'touchstart', 'click']) window.addEventListener(type, onPointer, {capture:true, passive:false});
  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement) hadPointerLock = true;
    else if (hadPointerLock) {
      hadPointerLock = false;
      if (!document.hidden && document.hasFocus() && !hiding) hide();
    }
  }, true);
  if (game) {
    document.addEventListener('DOMContentLoaded', () => {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = 'arcade-quick-hide';
      button.setAttribute('data-arcade-pause', '');
      button.textContent = 'Quick hide';
      button.setAttribute('aria-label', 'Quick hide: open KeyTrain Secure');
      button.title = 'Quick hide (Escape, P, Pause or `)';
      button.style.cssText = 'position:fixed!important;right:max(8px,env(safe-area-inset-right))!important;top:max(8px,env(safe-area-inset-top))!important;z-index:2147483646!important;min-height:44px!important;min-width:80px!important;padding:8px 10px!important;border:1px solid #707070!important;border-radius:4px!important;background:#202621!important;color:#fff!important;font:600 12px Arial,sans-serif!important;cursor:pointer!important;';
      button.addEventListener('click', hide, true);
      document.body.appendChild(button);
    }, {once:true});
  }
})();
