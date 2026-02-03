/* =============================================
   機構端後台管理系統 JavaScript
   全方位智慧貼身照護平台
   ============================================= */

// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', function() {
    initAdmin();
});

/**
 * 初始化後台管理系統
 */
function initAdmin() {
    initSidebar();
    initMenuToggle();
    initDropdowns();
    initDataTables();
    initCharts();
    initTooltips();
}

/* --- 側邊欄功能 --- */

/**
 * 初始化側邊欄
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
        document.querySelector('.main-content').addEventListener('click', function() {
            if (sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        });
    }
}

/* --- 下拉選單功能 --- */

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

/* --- 資料表格功能 --- */

/**
 * 初始化資料表格
 */
function initDataTables() {
    // 全選功能
    const selectAllCheckboxes = document.querySelectorAll('.select-all');
    
    selectAllCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const table = this.closest('table');
            const checkboxes = table.querySelectorAll('tbody input[type="checkbox"]');
            
            checkboxes.forEach(cb => {
                cb.checked = this.checked;
            });
            
            updateBulkActions();
        });
    });
    
    // 單一選擇
    const rowCheckboxes = document.querySelectorAll('.data-table tbody input[type="checkbox"]');
    
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBulkActions);
    });
}

/**
 * 更新批次操作按鈕狀態
 */
function updateBulkActions() {
    const checkedCount = document.querySelectorAll('.data-table tbody input[type="checkbox"]:checked').length;
    const bulkActions = document.querySelector('.bulk-actions');
    
    if (bulkActions) {
        if (checkedCount > 0) {
            bulkActions.style.display = 'flex';
            bulkActions.querySelector('.selected-count').textContent = `已選擇 ${checkedCount} 項`;
        } else {
            bulkActions.style.display = 'none';
        }
    }
}

/* --- 圖表功能 --- */

/**
 * 初始化圖表（示意用）
 */
function initCharts() {
    // 這裡可以整合 Chart.js 或其他圖表庫
    console.log('Charts initialized');
}

/* --- 工具提示功能 --- */

/**
 * 初始化工具提示
 */
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const text = this.dataset.tooltip;
            showTooltip(this, text);
        });
        
        element.addEventListener('mouseleave', hideTooltip);
    });
}

/**
 * 顯示工具提示
 */
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background-color: #333;
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 9999;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
    tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
}

/**
 * 隱藏工具提示
 */
function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

/* --- 訊息提示功能 --- */

/**
 * 顯示提示訊息
 * @param {string} message - 提示訊息
 * @param {string} type - 類型 (success/error/warning/info)
 */
function showToast(message, type = 'success') {
    // 移除現有的 toast
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const colorMap = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
        <i class="fas ${iconMap[type]}"></i>
        <span>${message}</span>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 30px;
        background-color: ${colorMap[type]};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(toast);
    
    // 3 秒後移除
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* --- 確認對話框 --- */

/**
 * 顯示確認對話框
 * @param {string} message - 確認訊息
 * @param {Function} onConfirm - 確認回調
 * @param {Function} onCancel - 取消回調
 */
function showConfirm(message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 30px; max-width: 400px; text-align: center;">
            <i class="fas fa-question-circle" style="font-size: 48px; color: #f39c12; margin-bottom: 20px;"></i>
            <p style="font-size: 16px; margin-bottom: 25px;">${message}</p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button class="btn btn-outline cancel-btn">取消</button>
                <button class="btn btn-primary confirm-btn">確認</button>
            </div>
        </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    dialog.querySelector('.confirm-btn').addEventListener('click', () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    });
    
    dialog.querySelector('.cancel-btn').addEventListener('click', () => {
        overlay.remove();
        if (onCancel) onCancel();
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (onCancel) onCancel();
        }
    });
}

/* --- 模態框功能 --- */

/**
 * 開啟模態框
 * @param {string} modalId - 模態框 ID
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * 關閉模態框
 * @param {string} modalId - 模態框 ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/* --- 表單功能 --- */

/**
 * 驗證表單
 * @param {HTMLFormElement} form - 表單元素
 * @returns {boolean} 是否驗證通過
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('is-invalid');
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

/**
 * 重置表單
 * @param {HTMLFormElement} form - 表單元素
 */
function resetForm(form) {
    form.reset();
    form.querySelectorAll('.is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });
}

/* --- 搜尋與篩選功能 --- */

/**
 * 搜尋表格資料
 * @param {string} tableId - 表格 ID
 * @param {string} keyword - 搜尋關鍵字
 */
function searchTable(tableId, keyword) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    const lowerKeyword = keyword.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(lowerKeyword) ? '' : 'none';
    });
}

/**
 * 篩選表格資料
 * @param {string} tableId - 表格 ID
 * @param {string} column - 欄位索引
 * @param {string} value - 篩選值
 */
function filterTable(tableId, column, value) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const cell = row.cells[column];
        if (!value || cell.textContent.includes(value)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/* --- 匯出功能 --- */

/**
 * 匯出表格為 CSV
 * @param {string} tableId - 表格 ID
 * @param {string} filename - 檔案名稱
 */
function exportTableToCSV(tableId, filename = 'export.csv') {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const rowData = [];
        
        cols.forEach(col => {
            // 跳過操作欄和核取方塊欄
            if (!col.querySelector('button') && !col.querySelector('input[type="checkbox"]')) {
                rowData.push('"' + col.textContent.trim().replace(/"/g, '""') + '"');
            }
        });
        
        csv.push(rowData.join(','));
    });
    
    const csvContent = '\ufeff' + csv.join('\n'); // 加入 BOM 支援中文
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    showToast('匯出成功！', 'success');
}

/* --- 頁面導航 --- */

/**
 * 導航到指定頁面
 * @param {string} url - 頁面 URL
 */
function navigateTo(url) {
    window.location.href = url;
}

/**
 * 返回上一頁
 */
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}

/* --- 格式化功能 --- */

/**
 * 格式化金額
 * @param {number} amount - 金額
 * @returns {string} 格式化後的金額
 */
function formatCurrency(amount) {
    return `NT$ ${amount.toLocaleString()}`;
}

/**
 * 格式化日期
 * @param {Date|string} date - 日期
 * @returns {string} 格式化後的日期
 */
function formatDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * 格式化日期時間
 * @param {Date|string} date - 日期時間
 * @returns {string} 格式化後的日期時間
 */
function formatDateTime(date) {
    const d = new Date(date);
    return `${formatDate(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// 添加 CSS 動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(50px);
        }
    }
    
    .form-control.is-invalid {
        border-color: #e74c3c;
    }
`;
document.head.appendChild(style);
