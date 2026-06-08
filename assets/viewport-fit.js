/* ============================================
   视口自适应缩放
   --------------------------------------------
   整套 UI 是按 1920×1080 固定画布、固定 px 绘制的。
   桌面浏览器会忽略 <meta viewport width=1920>，布局视口 = 实际窗口宽度，
   于是窗口窄于 1920 时（如 MacBook 默认分辨率）组件过大、布局挤压。

   方案：把整块画布按「窗口宽 / 1920」等比缩放（等价于自动浏览器缩放）。
   - 窗口 ≥ 1920：zoom = 1，保持 1:1（不放大），4K/大屏显示效果不变。
   - 窗口 < 1920：等比缩小，刚好铺满窗口宽度，布局与 1920 下完全一致。

   用 CSS `zoom` 而非 transform：会参与回流，position:fixed 的 .app 与
   动态追加到 body 的弹窗都会一并缩放，无需补偿宽高或居中。
   ============================================ */
(function () {
  var DESIGN_WIDTH = 1920;
  var MIN_ZOOM = 0.4;            // 极窄窗口下的下限，避免缩到不可用

  function applyZoom() {
    var z = window.innerWidth / DESIGN_WIDTH;
    if (z > 1) z = 1;            // 不放大：≥1920 保持原样
    if (z < MIN_ZOOM) z = MIN_ZOOM;
    document.documentElement.style.zoom = String(z);
  }

  applyZoom();                   // 在 <head> 内同步执行，首帧前即生效，避免闪烁

  var raf = 0;
  window.addEventListener('resize', function () {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(applyZoom);
  });
})();
