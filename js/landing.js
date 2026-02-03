/*
  智慧照護平台入口互動
  - 切換 iframe 預覽
  - 新分頁開啟
  - 重新載入預覽
*/

(() => {
  const tabs = document.querySelectorAll('.tab');
  const preview = document.getElementById('preview');
  const openNewBtn = document.getElementById('open-new');
  const reloadBtn = document.getElementById('reload');

  if (!preview) {
    return;
  }

  // 設定初始目標
  let currentTarget = preview.getAttribute('src');

  const setActiveTab = (target) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.target === target;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
  };

  const switchTarget = (target) => {
    if (!target) return;
    currentTarget = target;
    preview.setAttribute('src', target);
    setActiveTab(target);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      switchTarget(tab.dataset.target);
    });
  });

  if (openNewBtn) {
    openNewBtn.addEventListener('click', () => {
      if (currentTarget) {
        window.open(currentTarget, '_blank', 'noopener');
      }
    });
  }

  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      preview.setAttribute('src', currentTarget);
    });
  }
})();
