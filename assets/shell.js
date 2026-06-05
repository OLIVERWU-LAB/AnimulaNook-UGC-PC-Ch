/* ============================================
   代号Life PC · 共用 shell 脚本
   ============================================ */

const NAV_ITEMS = [
  { key:'recommend', label:'官方推荐', href:'index.html' },
  { key:'weekly',    label:'每周推荐', href:'weekly.html' },
  { key:'dream',     label:'家装方案', href:'dream.html' },
  { key:'rp',        label:'直播间',  href:'rp.html' },
  { key:'mine',      label:'我的',    href:'mine.html' },
  { key:'message',   label:'消息中心', href:'message.html' },
];

function renderSidebar(activeKey) {
  const html = NAV_ITEMS.map(n => `
    <a class="nav-item ${n.key === activeKey ? 'active' : ''}" data-key="${n.key}" href="${n.href}" title="${n.label}">
      <div class="nav-icon-wrap">
        <div class="icon-off" style="background-image:url('assets/icons/nav-${n.key}-off.png');"></div>
        <div class="icon-on"  style="background-image:url('assets/icons/nav-${n.key}-on.png');"></div>
      </div>
      <span class="nav-label">${n.label}</span>
    </a>
  `).join('');
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.innerHTML = html;
}

function renderTopRow(opts = {}) {
  const {
    showFilter = true,
    showSort   = true,
    showSearch = true,
    showHistory = false,
    sortLabel  = '最新排序',
  } = opts;

  const top = document.querySelector('.top-row');
  if (!top) return;

  const home = `
    <div class="system-title">
      <span class="home-icon" aria-hidden="true">
        <img src="assets/img/icon-home.png" alt="">
      </span>
      <span>家装方案 &amp; 直播间</span>
    </div>
    <div class="spacer"></div>
  `;

  const groupParts = [];
  if (showFilter) {
    groupParts.push(`
      <button class="topbar-btn btn-filter" id="filterBtn" title="筛选">
        <img src="assets/img/btn-filter-default.png" alt="筛选">
      </button>
    `);
  }
  if (showSort) {
    groupParts.push(`
      <button class="topbar-btn sort-dropdown" id="sortBtn" title="排序">
        <span id="sortLabel">${sortLabel}</span>
        <span class="caret"></span>
      </button>
    `);
  }
  if (showSort && showSearch) {
    groupParts.push('<span class="combo-divider"></span>');
  }
  if (showSearch) {
    groupParts.push(`
      <div class="topbar-btn search-box" id="searchBox">
        <svg class="icon-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="21" y1="21" x2="16.5" y2="16.5"></line>
        </svg>
        <input type="text" placeholder="搜索" readonly>
      </div>
    `);
  }

  const group = groupParts.length
    ? `<div class="toolbar-group">${groupParts.join('')}</div>`
    : '';

  const history = showHistory ? `
    <button class="history-entry" onclick="location.href='history.html'" title="浏览记录">
      <span class="ic"></span>
      <span>浏览记录</span>
    </button>
  ` : '';

  const close = `
    <button class="topbar-btn btn-close" title="关闭">
      <img src="assets/img/btn-close.png" alt="关闭">
    </button>
  `;

  top.innerHTML = home + group + history + close;

  // 搜索框点击 → 进入搜索页
  const sb = document.getElementById('searchBox');
  if (sb) sb.onclick = () => location.href = 'search.html';

  // 筛选按钮：仅触发弹窗，图标状态由 modal 内部控制
  const fb = document.getElementById('filterBtn');
  if (fb) {
    fb.onclick = () => {
      if (typeof window.openFilter === 'function') window.openFilter();
    };
  }

  // 排序按钮点击展开下拉
  const sBtn = document.getElementById('sortBtn');
  if (sBtn) sBtn.onclick = (e) => {
    e.stopPropagation();
    if (typeof window.openSortPanel === 'function') window.openSortPanel(sBtn);
  };
}

/* ============================================
   渲染卡片
   ============================================ */
function renderCard(it) {
  const stats = it.kind === 'live'
    ? `
      <div class="card-stats">
        <span class="stat">在线人数9999</span>
        <span class="stat-right">
          <span class="stat"><img src="assets/img/stat-people.png" alt=""> ${it.online || '0/6'}</span>
        </span>
      </div>
    `
    : `
      <div class="card-stats">
        <span class="stat">当前在玩${it.current ?? 9999}</span>
        <span class="stat-right">
          <span class="stat"><img src="assets/img/stat-like.png" alt=""> ${it.likes ?? 9999}</span>
          <span class="stat"><img src="assets/img/stat-star.png" alt=""> ${it.stars ?? 9999}</span>
        </span>
      </div>
    `;

  const titleBar = it.author
    ? `
      <div class="card-title-bar">
        <div class="avatar"></div>
        <div>
          <div class="title">${it.title}</div>
          <div class="author-row">${it.author}</div>
        </div>
      </div>
    `
    : `
      <div class="card-title-bar">
        <div class="avatar"></div>
        <div class="title">${it.title}</div>
      </div>
    `;

  return `
    <article class="card ${it.author ? 'with-author' : ''}">
      <div class="card-cover" style="background-image:url('${it.cover}');">
        <div class="card-tag-left">${it.label || '玩法标签'}</div>
        ${stats}
      </div>
      <div class="card-tag-featured">精选</div>
      ${titleBar}
    </article>
  `;
}

function makeMixedCards(n = 9) {
  return Array.from({ length: n }, (_, i) => i % 2 === 0
    ? { kind:'live',  cover:'assets/img/card-cover-live.png',  online:'0/6', title:'直播标题支持最长十二个字' }
    : { kind:'dream', cover:'assets/img/card-cover-dream.png', current:9999, likes:9999, stars:9999, title:'家装标题支持最长十二个字' }
  );
}

function makeDreamCards(n = 9) {
  return Array.from({ length: n }, () => ({
    kind:'dream', cover:'assets/img/card-cover-dream.png',
    current:9999, likes:9999, stars:9999, title:'家装标题支持最长十二个字'
  }));
}

function makeLiveCards(n = 9, withAuthor = false) {
  return Array.from({ length: n }, (_, i) => ({
    kind:'live', cover:'assets/img/card-cover-live.png',
    online:'0/6', title:'梦境标题支持最长十二个字',
    author: withAuthor ? (i % 3 === 0 ? '作者昵称七个字' : '作者昵称') : null
  }));
}

/* ============================================
   自定义滚动条
   ============================================ */
function setupScrollbar() {
  const area = document.getElementById('cardsArea');
  const bar  = document.getElementById('scrollbar');
  const thumb = document.getElementById('scrollThumb');
  if (!area || !bar || !thumb) return;

  function updateThumb() {
    const visible = area.clientHeight;
    const total   = area.scrollHeight;
    if (total <= visible) {
      bar.style.display = 'none';
      return;
    }
    bar.style.display = 'block';
    const barH = bar.clientHeight;
    const thumbH = Math.max(40, barH * (visible / total));
    const maxScroll = total - visible;
    const top = (area.scrollTop / maxScroll) * (barH - thumbH);
    thumb.style.height = thumbH + 'px';
    thumb.style.top = top + 'px';
  }

  area.addEventListener('scroll', updateThumb, { passive: true });
  window.addEventListener('resize', updateThumb);
  setTimeout(updateThumb, 100);
  setTimeout(updateThumb, 600);
  updateThumb();

  let dragging = false, startY = 0, startTop = 0;
  thumb.addEventListener('mousedown', (e) => {
    dragging = true;
    startY = e.clientY;
    startTop = parseFloat(thumb.style.top || 0);
    thumb.classList.add('dragging');
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dy = e.clientY - startY;
    const barH = bar.clientHeight;
    const thumbH = thumb.offsetHeight;
    const newTop = Math.max(0, Math.min(barH - thumbH, startTop + dy));
    const total = area.scrollHeight;
    const visible = area.clientHeight;
    const ratio = newTop / (barH - thumbH);
    area.scrollTop = ratio * (total - visible);
  });
  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      thumb.classList.remove('dragging');
      document.body.style.userSelect = '';
    }
  });
}

/* ============================================
   排序下拉面板（通用）- 修复：state 闭包 + 关闭后能再次打开
   ============================================ */
function buildSortPanel(items, currentLabel) {
  const state = { panel: null, mask: null, items, currentLabel };

  function close() {
    state.panel?.remove();
    state.mask?.remove();
    state.panel = null;
    state.mask  = null;
    document.getElementById('sortBtn')?.classList.remove('open');
  }

  window.openSortPanel = function(anchor) {
    // 已打开 → 关闭
    if (state.panel) { close(); return; }

    document.getElementById('sortBtn')?.classList.add('open');
    state.mask = document.createElement('div');
    state.mask.className = 'dropdown-mask';
    state.mask.onclick = close;
    document.body.appendChild(state.mask);

    state.panel = document.createElement('div');
    state.panel.className = 'sort-panel';
    state.panel.innerHTML = state.items.map(it => `
      <div class="sort-item ${it.label === state.currentLabel ? 'active' : ''}" data-label="${it.label}">${it.label}</div>
    `).join('');
    document.body.appendChild(state.panel);

    // 定位
    const r = anchor.getBoundingClientRect();
    state.panel.style.left = (r.left) + 'px';
    state.panel.style.top  = (r.bottom + 8) + 'px';
    state.panel.style.minWidth = r.width + 'px';

    state.panel.querySelectorAll('.sort-item').forEach(el => {
      el.onclick = () => {
        state.currentLabel = el.dataset.label;
        // 文案 = "选项 + 排序"，让按钮宽度变化但稳定
        const lbl = document.getElementById('sortLabel');
        if (lbl) lbl.textContent = state.currentLabel + '排序';
        close();
      };
    });
  };
}

/* ============================================
   通用 confirm 弹窗
   showConfirm(title, desc, [{label, cls, cb}], maskOpacity?)
   ============================================ */
window.showConfirm = function(title, desc, actions, maskOpacity = 60) {
  const mask = document.createElement('div');
  mask.className = 'modal-mask mask-' + maskOpacity;

  const popup = document.createElement('div');
  popup.className = 'confirm-popup';
  popup.onclick = (e) => e.stopPropagation();
  popup.innerHTML = `
    <div class="confirm-title">${title}</div>
    <div class="confirm-desc">${desc}</div>
    <div class="confirm-actions"></div>
  `;
  const actionsBox = popup.querySelector('.confirm-actions');
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'btn-mini ' + (a.cls || 'btn-green');
    btn.textContent = a.label;
    btn.onclick = () => {
      mask.remove();
      a.cb && a.cb();
    };
    actionsBox.appendChild(btn);
  });

  mask.appendChild(popup);
  mask.onclick = () => mask.remove();
  document.body.appendChild(mask);
};

/* 直播卡片一级页统一文案 */
makeMixedCards = function(n = 9) {
  return Array.from({ length: n }, (_, i) => i % 2 === 0
    ? { kind:'live',  cover:'assets/img/card-cover-live.png',  online:'0/6', title:'直播标题最长支持十二个字' }
    : { kind:'dream', cover:'assets/img/card-cover-dream.png', current:9999, likes:9999, stars:9999, title:'家装标题支持最长十二个字' }
  );
};

makeLiveCards = function(n = 9, withAuthor = false) {
  return Array.from({ length: n }, (_, i) => ({
    kind:'live',
    cover:'assets/img/card-cover-live.png',
    online:'0/6',
    title:'直播标题最长支持十二个字',
    author: withAuthor ? (i % 3 === 0 ? '作者昵称七个字' : '作者昵称') : null
  }));
};

function normalizeLiveCardTitles(root = document) {
  root.querySelectorAll('.card').forEach(card => {
    const cover = card.querySelector('.card-cover');
    const title = card.querySelector('.card-title, .card-title-bar .title, .title');
    if (!cover || !title) return;
    if (/card-cover-live/.test(cover.style.backgroundImage || '')) {
      if (title.textContent.trim() !== '直播标题最长支持十二个字') {
        title.textContent = '直播标题最长支持十二个字';
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  normalizeLiveCardTitles();
  let liveTitleTimer = null;
  const liveTitleObserver = new MutationObserver(() => {
    clearTimeout(liveTitleTimer);
    liveTitleTimer = setTimeout(() => normalizeLiveCardTitles(), 60);
  });
  liveTitleObserver.observe(document.body, { childList: true, subtree: true });
});
