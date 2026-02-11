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
  const versionSelect = document.getElementById('version-switch');

  if (!preview) {
    return;
  }

  const getBasePath = () => (versionSelect ? versionSelect.value : '');

  const getInitialRole = () => {
    const activeTab = document.querySelector('.tab.is-active');
    return activeTab?.dataset.role || '1.客戶端/index.html';
  };

  const buildVersionOption = (version, isSelected) => {
    const option = document.createElement('option');
    option.value = version.path || '';
    option.textContent = version.label || version.path || '未命名版本';
    option.selected = isSelected;
    return option;
  };

  const populateVersionSelect = (versions) => {
    if (!versionSelect) return;
    versionSelect.innerHTML = '';
    let selectedSet = false;

    versions.forEach((version) => {
      const isSelected = Boolean(version.current) && !selectedSet;
      if (isSelected) {
        selectedSet = true;
      }
      versionSelect.appendChild(buildVersionOption(version, isSelected));
    });

    if (!selectedSet && versionSelect.options.length > 0) {
      versionSelect.options[0].selected = true;
    }
  };

  const loadVersions = async () => {
    if (!versionSelect) return getBasePath();

    try {
      const response = await fetch('versions.json', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to load versions');
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid versions');
      }

      populateVersionSelect(data);
      return getBasePath();
    } catch (error) {
      if (versionSelect.options.length === 0) {
        const fallback = document.createElement('option');
        fallback.value = '';
        fallback.textContent = '目前版本';
        fallback.selected = true;
        versionSelect.appendChild(fallback);
      }
      return getBasePath();
    }
  };

  // 設定初始目標
  let basePath = getBasePath();
  let currentRole = getInitialRole();
  let currentTarget = `${basePath}${currentRole}`;

  const setActiveTab = (role) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.role === role;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
  };

  const switchTarget = (role) => {
    if (!role) return;
    currentRole = role;
    currentTarget = `${basePath}${role}`;
    preview.setAttribute('src', currentTarget);
    setActiveTab(role);
  };

  const init = async () => {
    basePath = await loadVersions();
    switchTarget(currentRole);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      switchTarget(tab.dataset.role);
    });
  });

  if (versionSelect) {
    versionSelect.addEventListener('change', () => {
      basePath = getBasePath();
      switchTarget(currentRole);
    });
  }

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

  init();
})();
