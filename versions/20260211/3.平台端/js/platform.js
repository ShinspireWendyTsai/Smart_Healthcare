/* =============================================
   平台端後台管理系統 JavaScript
   全方位智慧貼身照護平台
   ============================================= */

// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', function() {
    initPlatform();
});

/**
 * 初始化平台管理系統
 */
function initPlatform() {
    initSidebar();
    initMenuToggle();
    initDropdowns();
    initModals();
    initTables();
    initTabs();
    initCharts();
    initCategoryTree();
    initViewToggle();
    initIconPicker();
    initPricingTabs();
}

/* =============================================
   側邊欄功能
   ============================================= */

/**
 * 初始化側邊欄選單
 */
function initSidebar() {
    const menuItems = document.querySelectorAll('.menu-item[data-submenu]');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const submenuId = this.dataset.submenu;
            const submenu = document.getElementById(submenuId);
            
            if (submenu) {
                // 切換展開狀態
                this.classList.toggle('expanded');
                submenu.classList.toggle('show');
                
                // 更新箭頭圖示
                const arrow = this.querySelector('.arrow');
                if (arrow) {
                    if (this.classList.contains('expanded')) {
                        arrow.classList.remove('fa-chevron-right');
                        arrow.classList.add('fa-chevron-down');
                    } else {
                        arrow.classList.remove('fa-chevron-down');
                        arrow.classList.add('fa-chevron-right');
                    }
                }
            }
        });
    });
}

/**
 * 初始化選單切換按鈕（行動裝置）
 */
function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
        
        // 點擊主內容區時關閉側邊欄
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.addEventListener('click', function() {
                if (sidebar.classList.contains('show')) {
                    sidebar.classList.remove('show');
                }
            });
        }
    }
}

/* =============================================
   下拉選單功能
   ============================================= */

/**
 * 初始化下拉選單
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // 關閉其他下拉選單
                document.querySelectorAll('.dropdown-menu.show').forEach(m => {
                    if (m !== menu) {
                        m.classList.remove('show');
                    }
                });
                
                menu.classList.toggle('show');
            });
        }
    });
    
    // 點擊其他地方關閉下拉選單
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
        });
    });
}

/* =============================================
   Modal 功能
   ============================================= */

/**
 * 初始化 Modal
 */
function initModals() {
    // 點擊背景關閉 Modal
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // ESC 鍵關閉 Modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

/**
 * 開啟 Modal
 * @param {string} modalId - Modal 的 ID
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * 關閉 Modal
 * @param {string} modalId - Modal 的 ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

/* =============================================
   資料表格功能
   ============================================= */

/**
 * 初始化資料表格
 */
function initTables() {
    // 全選功能
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const rowCheckboxes = document.querySelectorAll('.row-check');
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // 單選更新全選狀態
    document.querySelectorAll('.row-check').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectAllState();
        });
    });
}

/**
 * 更新全選勾選狀態
 */
function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('.row-check');
    const checkedCount = document.querySelectorAll('.row-check:checked').length;
    
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = checkedCount === rowCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < rowCheckboxes.length;
    }
}

/* =============================================
   標籤頁功能
   ============================================= */

/**
 * 初始化標籤頁
 */
function initTabs() {
    // 狀態標籤頁
    const statusTabs = document.querySelectorAll('.status-tab');
    statusTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除其他 active 狀態
            statusTabs.forEach(t => t.classList.remove('active'));
            // 設定當前 active
            this.classList.add('active');
            
            // 篩選資料（可根據需求實作）
            const status = this.dataset.status;
            filterByStatus(status);
        });
    });
}

/**
 * 依狀態篩選資料
 * @param {string} status - 狀態值
 */
function filterByStatus(status) {
    // TODO: 實作篩選邏輯
    console.log('篩選狀態:', status);
}

/* =============================================
   圖表功能
   ============================================= */

/**
 * 初始化圖表
 */
function initCharts() {
    // 訂單趨勢圖表
    initOrdersChart();
    // 服務類別分佈圖表
    initCategoryChart();
}

/**
 * 初始化訂單趨勢圖表
 */
function initOrdersChart() {
    const ctx = document.getElementById('ordersChart');
    if (!ctx) return;
    
    // 檢查是否已載入 Chart.js
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js 未載入');
        return;
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1/1', '1/5', '1/10', '1/15', '1/20', '1/25', '1/28'],
            datasets: [{
                label: '訂單數',
                data: [45, 62, 58, 89, 75, 95, 82],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }, {
                label: '營業額（萬）',
                data: [12, 18, 15, 28, 22, 32, 25],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * 初始化服務類別分佈圖表
 */
function initCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js 未載入');
        return;
    }
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['居家照護', '醫療陪伴', '復健服務', '營養餐飲', '輔具服務'],
            datasets: [{
                data: [35, 25, 20, 12, 8],
                backgroundColor: [
                    '#6366f1',
                    '#10b981',
                    '#f59e0b',
                    '#ec4899',
                    '#8b5cf6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '65%'
        }
    });
}

/* =============================================
   類別樹狀結構功能
   ============================================= */

/**
 * 初始化類別樹狀結構
 */
function initCategoryTree() {
    const treeNodes = document.querySelectorAll('.tree-node');
    
    treeNodes.forEach(node => {
        node.addEventListener('click', function(e) {
            const treeItem = this.closest('.tree-item');
            const toggle = this.querySelector('.tree-toggle');
            const children = treeItem.querySelector('.tree-children');
            
            // 如果點擊的是展開/收合按鈕
            if (toggle && children) {
                if (e.target.closest('.tree-toggle')) {
                    children.classList.toggle('collapsed');
                    const icon = toggle.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('fa-chevron-down');
                        icon.classList.toggle('fa-chevron-right');
                    }
                    return;
                }
            }
            
            // 選取類別，顯示詳情
            selectCategory(treeItem.dataset.id);
        });
    });
    
    // 全部展開/收合按鈕
    const expandAllBtn = document.getElementById('expandAll');
    const collapseAllBtn = document.getElementById('collapseAll');
    
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', function() {
            document.querySelectorAll('.tree-children').forEach(child => {
                child.classList.remove('collapsed');
            });
            document.querySelectorAll('.tree-toggle i').forEach(icon => {
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-down');
            });
        });
    }
    
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', function() {
            document.querySelectorAll('.tree-children').forEach(child => {
                child.classList.add('collapsed');
            });
            document.querySelectorAll('.tree-toggle i').forEach(icon => {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-right');
            });
        });
    }
}

/**
 * 選取類別並顯示詳情
 * @param {string} categoryId - 類別 ID
 */
function selectCategory(categoryId) {
    // 隱藏空狀態，顯示詳情
    const emptyState = document.getElementById('emptyState');
    const detailContent = document.getElementById('detailContent');
    
    if (emptyState) emptyState.style.display = 'none';
    if (detailContent) detailContent.style.display = 'block';
    
    // TODO: 根據 categoryId 載入實際資料
    console.log('選取類別:', categoryId);
}

/* =============================================
   檢視切換功能
   ============================================= */

/**
 * 初始化檢視切換
 */
function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const tableView = document.getElementById('tableView');
    const gridView = document.getElementById('gridView');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新按鈕狀態
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 切換檢視
            const view = this.dataset.view;
            if (view === 'table') {
                if (tableView) tableView.style.display = 'block';
                if (gridView) gridView.style.display = 'none';
            } else if (view === 'grid') {
                if (tableView) tableView.style.display = 'none';
                if (gridView) gridView.style.display = 'block';
            }
        });
    });
}

/* =============================================
   圖示選擇器功能
   ============================================= */

/**
 * 初始化圖示選擇器
 */
function initIconPicker() {
    const iconPickers = document.querySelectorAll('.icon-picker');
    
    iconPickers.forEach(picker => {
        const selectedIcon = picker.querySelector('.selected-icon');
        const iconOptions = picker.querySelectorAll('.icon-option');
        
        if (selectedIcon) {
            selectedIcon.addEventListener('click', function() {
                picker.classList.toggle('open');
            });
        }
        
        iconOptions.forEach(option => {
            option.addEventListener('click', function() {
                // 移除其他選取狀態
                iconOptions.forEach(o => o.classList.remove('selected'));
                // 設定當前選取
                this.classList.add('selected');
                
                // 更新顯示的圖示
                const iconClass = this.dataset.icon;
                const displayIcon = selectedIcon.querySelector('i');
                if (displayIcon && iconClass) {
                    displayIcon.className = 'fas ' + iconClass;
                }
                
                // 關閉選擇器
                picker.classList.remove('open');
            });
        });
    });
    
    // 點擊外部關閉選擇器
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.icon-picker')) {
            document.querySelectorAll('.icon-picker.open').forEach(picker => {
                picker.classList.remove('open');
            });
        }
    });
}

/* =============================================
   定價標籤頁功能
   ============================================= */

/**
 * 初始化定價標籤頁
 */
function initPricingTabs() {
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    
    pricingTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 更新標籤狀態
            pricingTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 顯示對應內容
            const tabName = this.dataset.tab;
            document.querySelectorAll('.pricing-content').forEach(content => {
                content.style.display = 'none';
            });
            
            const targetContent = document.getElementById(tabName + 'Tab');
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });
}

/* =============================================
   業務邏輯函式
   ============================================= */

/**
 * 檢視機構詳情
 * @param {number} orgId - 機構 ID
 */
function viewOrg(orgId) {
    openModal('viewOrgModal');
    // TODO: 載入機構資料
    console.log('檢視機構:', orgId);
}

/**
 * 編輯機構
 * @param {number} orgId - 機構 ID
 */
function editOrg(orgId) {
    closeModal('viewOrgModal');
    openModal('orgModal');
    // 更新 Modal 標題
    const modalTitle = document.querySelector('#orgModal .modal-title');
    if (modalTitle) {
        modalTitle.textContent = '編輯機構';
    }
    // TODO: 載入機構資料到表單
    console.log('編輯機構:', orgId);
}

/**
 * 切換機構狀態
 * @param {number} orgId - 機構 ID
 */
function toggleOrgStatus(orgId) {
    if (confirm('確定要變更此機構的狀態嗎？')) {
        // TODO: 發送 API 請求
        console.log('切換機構狀態:', orgId);
    }
}

/**
 * 檢視訂單詳情
 * @param {string} orderId - 訂單編號
 */
function viewOrder(orderId) {
    openModal('orderDetailModal');
    // TODO: 載入訂單資料
    console.log('檢視訂單:', orderId);
}

/**
 * 編輯訂單
 * @param {string} orderId - 訂單編號
 */
function editOrder(orderId) {
    // TODO: 實作編輯訂單邏輯
    console.log('編輯訂單:', orderId);
}

/**
 * 編輯類別
 * @param {number} categoryId - 類別 ID
 */
function editCategory(categoryId) {
    openModal('categoryModal');
    // 更新 Modal 標題
    const modalTitle = document.querySelector('#categoryModal .modal-title');
    if (modalTitle) {
        modalTitle.textContent = '編輯服務類別';
    }
    // TODO: 載入類別資料到表單
    console.log('編輯類別:', categoryId);
}

/**
 * 檢視服務詳情
 * @param {number} serviceId - 服務 ID
 */
function viewService(serviceId) {
    // TODO: 開啟服務詳情 Modal 或頁面
    console.log('檢視服務:', serviceId);
}

/**
 * 編輯服務
 * @param {number} serviceId - 服務 ID
 */
function editService(serviceId) {
    openModal('serviceModal');
    // 更新 Modal 標題
    const modalTitle = document.querySelector('#serviceModal .modal-title');
    if (modalTitle) {
        modalTitle.textContent = '編輯服務';
    }
    // TODO: 載入服務資料到表單
    console.log('編輯服務:', serviceId);
}

/**
 * 開啟定價設定
 * @param {number} serviceId - 服務 ID
 */
function openPricing(serviceId) {
    openModal('pricingModal');
    // TODO: 載入定價資料
    console.log('開啟定價設定:', serviceId);
}

/**
 * 新增規格
 */
function addSpec() {
    const specList = document.getElementById('specList');
    if (!specList) return;
    
    const specItem = document.createElement('div');
    specItem.className = 'spec-item';
    specItem.innerHTML = `
        <div class="spec-inputs">
            <input type="text" class="form-control" placeholder="規格名稱（如：時數）">
            <input type="text" class="form-control" placeholder="規格選項（如：4小時、8小時）">
        </div>
        <button type="button" class="btn-icon text-danger" onclick="removeSpec(this)">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;
    specList.appendChild(specItem);
}

/**
 * 移除規格
 * @param {HTMLElement} button - 刪除按鈕元素
 */
function removeSpec(button) {
    const specItem = button.closest('.spec-item');
    if (specItem) {
        specItem.remove();
    }
}

/* =============================================
   工具函式
   ============================================= */

/**
 * 顯示提示訊息
 * @param {string} message - 訊息內容
 * @param {string} type - 訊息類型 (success/error/warning/info)
 */
function showToast(message, type = 'info') {
    // TODO: 實作 Toast 通知
    console.log(`[${type.toUpperCase()}] ${message}`);
}

/**
 * 確認對話框
 * @param {string} message - 確認訊息
 * @returns {boolean} 使用者確認結果
 */
function confirmAction(message) {
    return confirm(message);
}

/**
 * 格式化金額
 * @param {number} amount - 金額
 * @returns {string} 格式化後的金額字串
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
        minimumFractionDigits: 0
    }).format(amount);
}

/**
 * 格式化日期
 * @param {Date|string} date - 日期
 * @returns {string} 格式化後的日期字串
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

/**
 * 格式化日期時間
 * @param {Date|string} datetime - 日期時間
 * @returns {string} 格式化後的日期時間字串
 */
function formatDateTime(datetime) {
    const d = new Date(datetime);
    return d.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}
