/* =============================================
   供應商訂單管理頁面 JavaScript
   全方位智慧貼身照護平台
   ============================================= */

// =============================================
// 全域狀態
// =============================================
const state = {
    isAuthenticated: false,
    authAttempts: 0,
    maxAuthAttempts: 5,
    orderStatus: 'notified' // notified → confirmed → shipped → delivered | rejected
};

// =============================================
// 密碼驗證相關
// =============================================

/**
 * 處理密碼驗證表單送出
 * 注意：實際系統中密碼驗證必須在後端完成
 * 此處為前端 Prototype 模擬用途
 */
function handleAuth(event) {
    event.preventDefault();

    const password = document.getElementById('supplierPassword').value;
    const errorEl = document.getElementById('authError');
    const errorMsg = document.getElementById('authErrorMsg');
    const submitBtn = document.getElementById('authSubmitBtn');

    // 檢查是否已超過嘗試次數上限
    if (state.authAttempts >= state.maxAuthAttempts) {
        errorEl.style.display = 'flex';
        errorMsg.textContent = '嘗試次數過多，請稍後再試或聯絡平台客服。';
        submitBtn.disabled = true;
        return false;
    }

    // Prototype 模擬：密碼為 "supplier123"
    // 實際環境中，此處應發送 API 請求至後端驗證
    if (password === 'supplier123') {
        state.isAuthenticated = true;
        errorEl.style.display = 'none';
        showOrderPage();
    } else {
        state.authAttempts++;
        errorEl.style.display = 'flex';

        const remaining = state.maxAuthAttempts - state.authAttempts;
        if (remaining > 0) {
            errorMsg.textContent = `密碼錯誤，您還有 ${remaining} 次嘗試機會。`;
        } else {
            errorMsg.textContent = '嘗試次數過多，請稍後再試或聯絡平台客服。';
            submitBtn.disabled = true;
        }
    }

    return false;
}

/**
 * 切換密碼顯示/隱藏
 */
function togglePassword() {
    const input = document.getElementById('supplierPassword');
    const icon = document.getElementById('passwordToggleIcon');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

/**
 * 顯示訂單管理頁面（驗證成功後）
 */
function showOrderPage() {
    const authGate = document.getElementById('authGate');
    const orderPage = document.getElementById('orderPage');

    // 淡出驗證頁
    authGate.style.transition = 'opacity 0.3s ease';
    authGate.style.opacity = '0';

    setTimeout(() => {
        authGate.style.display = 'none';
        orderPage.style.display = 'block';

        // 淡入訂單頁
        orderPage.style.opacity = '0';
        orderPage.style.transition = 'opacity 0.3s ease';
        requestAnimationFrame(() => {
            orderPage.style.opacity = '1';
        });
    }, 300);
}

/**
 * 登出（離開頁面）
 */
function handleLogout() {
    if (confirm('確定要離開供應商訂單管理頁面嗎？')) {
        state.isAuthenticated = false;
        document.getElementById('orderPage').style.display = 'none';
        document.getElementById('authGate').style.display = 'flex';
        document.getElementById('authGate').style.opacity = '1';
        document.getElementById('supplierPassword').value = '';
    }
}

// =============================================
// 訂單操作相關
// =============================================

/**
 * 步驟 1：確認接單
 */
function confirmOrder() {
    const shipDate = document.getElementById('estimatedShipDate').value;
    const note = document.getElementById('confirmNote').value;

    if (!shipDate) {
        showToast('請選擇預計出貨日期', 'warning');
        return;
    }

    // 更新狀態
    state.orderStatus = 'confirmed';

    // 更新步驟 1 外觀
    const stepConfirm = document.getElementById('stepConfirm');
    stepConfirm.classList.add('completed-step');
    document.getElementById('stepConfirmStatus').textContent = '已確認';
    document.getElementById('stepConfirmStatus').classList.add('done');

    // 隱藏步驟 1 按鈕
    stepConfirm.querySelector('.action-buttons').style.display = 'none';
    stepConfirm.querySelector('.action-card-body').innerHTML = `
        <div class="action-desc" style="color: var(--success-color); display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-check-circle"></i>
            已於 ${formatNow()} 確認接單，預計出貨日：${shipDate}
            ${note ? '<br>備註：' + escapeHtml(note) : ''}
        </div>
    `;

    // 啟用步驟 2
    const stepShipping = document.getElementById('stepShipping');
    stepShipping.classList.remove('disabled');
    stepShipping.querySelector('.step-status').textContent = '待處理';

    // 更新時間軸
    updateTimeline('confirmed');

    // 新增操作歷程
    addHistory('supplier', 'fas fa-check', `供應商已確認接單，預計 ${shipDate} 出貨${note ? '（' + escapeHtml(note) + '）' : ''}`);

    // 更新訂單狀態標籤
    updateOrderBadge('confirmed');

    showToast('已成功確認接單！');
}

/**
 * 步驟 2：確認出貨
 */
function submitShipping() {
    const carrier = document.getElementById('shippingCarrier').value;
    const tracking = document.getElementById('trackingNumber').value;
    const shipDate = document.getElementById('actualShipDate').value;
    const note = document.getElementById('shippingNote').value;

    if (!carrier) {
        showToast('請選擇物流公司', 'warning');
        return;
    }
    if (!tracking) {
        showToast('請輸入貨運追蹤編號', 'warning');
        return;
    }
    if (!shipDate) {
        showToast('請選擇實際出貨日期', 'warning');
        return;
    }

    // 更新狀態
    state.orderStatus = 'shipped';

    // 更新步驟 2 外觀
    const stepShipping = document.getElementById('stepShipping');
    stepShipping.classList.add('completed-step');
    stepShipping.querySelector('.step-status').textContent = '已出貨';
    stepShipping.querySelector('.step-status').classList.add('done');

    stepShipping.querySelector('.action-card-body').innerHTML = `
        <div class="action-desc" style="color: var(--success-color); display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-check-circle"></i>
            已於 ${formatNow()} 確認出貨
        </div>
        <div class="tracking-info" style="margin-top: 12px;">
            <div class="tracking-row">
                <span class="tracking-label">物流公司</span>
                <span class="tracking-value">${escapeHtml(carrier)}</span>
            </div>
            <div class="tracking-row">
                <span class="tracking-label">追蹤編號</span>
                <span class="tracking-value">${escapeHtml(tracking)}</span>
            </div>
            <div class="tracking-row">
                <span class="tracking-label">出貨日期</span>
                <span class="tracking-value">${shipDate}</span>
            </div>
            ${note ? `<div class="tracking-row"><span class="tracking-label">備註</span><span class="tracking-value">${escapeHtml(note)}</span></div>` : ''}
        </div>
    `;

    // 啟用步驟 3
    const stepDelivery = document.getElementById('stepDelivery');
    stepDelivery.classList.remove('disabled');
    stepDelivery.querySelector('.step-status').textContent = '配送中';

    // 顯示追蹤資訊
    document.getElementById('deliveryInfo').style.display = 'block';
    document.getElementById('displayCarrier').textContent = carrier;
    document.getElementById('displayTracking').textContent = tracking;

    // 更新時間軸
    updateTimeline('shipped');

    // 新增操作歷程
    addHistory('success', 'fas fa-truck', `供應商已出貨｜物流：${escapeHtml(carrier)}｜追蹤編號：${escapeHtml(tracking)}`);

    // 更新訂單狀態標籤
    updateOrderBadge('shipped');

    showToast('出貨資訊已送出！');
}

/**
 * 步驟 3：確認送達
 */
function confirmDelivery() {
    if (!confirm('確認貨物已送達客戶手中？')) return;

    state.orderStatus = 'delivered';

    // 更新步驟 3 外觀
    const stepDelivery = document.getElementById('stepDelivery');
    stepDelivery.classList.add('completed-step');
    stepDelivery.querySelector('.step-status').textContent = '已送達';
    stepDelivery.querySelector('.step-status').classList.add('done');

    stepDelivery.querySelector('.action-card-body').innerHTML = `
        <div class="action-desc" style="color: var(--success-color); display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-check-circle"></i>
            已於 ${formatNow()} 確認送達
        </div>
    `;

    // 更新時間軸
    updateTimeline('delivered');

    // 新增操作歷程
    addHistory('success', 'fas fa-box-open', '供應商確認貨物已送達');

    // 更新訂單狀態標籤
    updateOrderBadge('delivered');

    showToast('訂單已完成配送！感謝您的配合。');
}

// =============================================
// 無法接單 / 回報異常
// =============================================

/**
 * 顯示無法接單 Modal
 */
function showRejectModal() {
    document.getElementById('rejectModal').style.display = 'flex';
}

/**
 * 提交拒絕接單
 */
function rejectOrder() {
    const reason = document.getElementById('rejectReason').value;
    const detail = document.getElementById('rejectDetail').value;

    if (!reason) {
        showToast('請選擇無法接單原因', 'warning');
        return;
    }

    state.orderStatus = 'rejected';

    // 關閉 Modal
    closeModal('rejectModal');

    // 更新步驟 1
    const stepConfirm = document.getElementById('stepConfirm');
    stepConfirm.style.borderColor = 'var(--danger-color)';
    stepConfirm.style.background = '#fef2f2';
    document.getElementById('stepConfirmStatus').textContent = '已拒絕';
    document.getElementById('stepConfirmStatus').style.background = '#fee2e2';
    document.getElementById('stepConfirmStatus').style.color = '#991b1b';

    stepConfirm.querySelector('.action-card-body').innerHTML = `
        <div class="action-desc" style="color: var(--danger-color); display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-times-circle"></i>
            已於 ${formatNow()} 回報無法接單
            <br>原因：${escapeHtml(reason)}
            ${detail ? '<br>說明：' + escapeHtml(detail) : ''}
        </div>
    `;

    // 新增操作歷程
    addHistory('danger', 'fas fa-times-circle', `供應商回報無法接單｜原因：${escapeHtml(reason)}${detail ? '｜' + escapeHtml(detail) : ''}`);

    // 更新訂單狀態標籤
    updateOrderBadge('rejected');

    showToast('已回報無法接單，平台將另行處理。', 'error');
}

/**
 * 顯示回報異常 Modal
 */
function showIssueModal() {
    document.getElementById('issueModal').style.display = 'flex';
}

/**
 * 提交配送異常
 */
function reportIssue() {
    const type = document.getElementById('issueType').value;
    const detail = document.getElementById('issueDetail').value;

    if (!type) {
        showToast('請選擇異常類型', 'warning');
        return;
    }

    closeModal('issueModal');

    // 新增操作歷程
    addHistory('warning', 'fas fa-exclamation-triangle', `供應商回報配送異常｜類型：${escapeHtml(type)}${detail ? '｜' + escapeHtml(detail) : ''}`);

    showToast('已送出異常回報，平台客服將協助處理。', 'warning');

    // 清空表單
    document.getElementById('issueType').value = '';
    document.getElementById('issueDetail').value = '';
}

// =============================================
// Modal 控制
// =============================================

/**
 * 關閉指定 Modal
 */
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// =============================================
// 時間軸更新
// =============================================

/**
 * 更新訂單進度時間軸
 */
function updateTimeline(status) {
    const steps = document.querySelectorAll('.timeline-step');
    const connectors = document.querySelectorAll('.timeline-connector');
    const now = formatNow();

    // 狀態到步驟索引的映射
    const statusMap = {
        'confirmed': 3, // 供應商確認
        'shipped': 4,   // 已出貨
        'delivered': 5  // 已送達
    };

    const activeIndex = statusMap[status];
    if (activeIndex === undefined) return;

    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index <= activeIndex) {
            step.classList.add('completed');
            // 更新時間文字
            if (index === activeIndex) {
                step.querySelector('.step-time').textContent = now;
            }
        }
        if (index === activeIndex && status !== 'delivered') {
            // 下一步設為 active
        }
    });

    // 如果不是最後一步，設定下一步為 active
    if (activeIndex + 1 < steps.length && status !== 'delivered') {
        steps[activeIndex + 1].classList.add('active');
    }

    // 更新連接線
    connectors.forEach((conn, index) => {
        if (index < activeIndex) {
            conn.classList.add('completed');
        }
    });
}

/**
 * 更新訂單狀態標籤
 */
function updateOrderBadge(status) {
    const badge = document.querySelector('.order-status-badge');
    if (!badge) return;

    const config = {
        'confirmed': { text: '供應商已確認', class: 'status-confirmed' },
        'shipped': { text: '已出貨', class: 'status-shipped' },
        'delivered': { text: '已送達', class: 'status-delivered' },
        'rejected': { text: '供應商拒絕', class: 'status-rejected' }
    };

    const c = config[status];
    if (!c) return;

    badge.textContent = c.text;
    badge.className = 'order-status-badge ' + c.class;
}

// =============================================
// 操作歷程
// =============================================

/**
 * 新增一筆操作歷程
 */
function addHistory(iconType, iconClass, title) {
    const list = document.getElementById('historyList');
    const now = formatNow();

    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
        <div class="history-icon ${iconType}"><i class="${iconClass}"></i></div>
        <div class="history-content">
            <div class="history-title">${title}</div>
            <div class="history-time">${now}</div>
        </div>
    `;

    // 插入到最前面
    list.insertBefore(item, list.firstChild);
}

// =============================================
// Toast 通知
// =============================================

/**
 * 顯示 Toast 通知
 * @param {string} message - 訊息內容
 * @param {string} type - 類型：success / error / warning
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');

    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? '' : type}`;
    toast.innerHTML = `
        <div class="toast-icon"><i class="${iconMap[type] || iconMap.success}"></i></div>
        <div class="toast-message">${escapeHtml(message)}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toast);

    // 自動移除
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// =============================================
// 工具函式
// =============================================

/**
 * 取得目前時間格式化字串
 */
function formatNow() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${y}/${m}/${d} ${h}:${min}`;
}

/**
 * HTML 跳脫（防止 XSS）
 */
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// =============================================
// URL 參數處理（從通知信連結取得訂單編號）
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order');

    // 如果 URL 帶有訂單編號，更新預覽區的顯示
    if (orderId) {
        const previewEl = document.getElementById('previewOrderId');
        if (previewEl) {
            previewEl.textContent = '#' + escapeHtml(orderId);
        }
    }

    // 設定預計出貨日期的預設最小值為今天
    const shipDateInput = document.getElementById('estimatedShipDate');
    if (shipDateInput) {
        const today = new Date().toISOString().split('T')[0];
        shipDateInput.min = today;
        shipDateInput.value = '';
    }

    const actualShipDateInput = document.getElementById('actualShipDate');
    if (actualShipDateInput) {
        const today = new Date().toISOString().split('T')[0];
        actualShipDateInput.min = today;
    }
});

// =============================================
// 訂單列表頁功能
// =============================================

/**
 * 依狀態篩選訂單列表
 */
function filterOrders(status, tabEl) {
    // 更新 tab 樣式
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    if (tabEl) tabEl.classList.add('active');

    const items = document.querySelectorAll('.order-list-item');
    let visibleCount = 0;

    items.forEach(item => {
        const itemStatus = item.getAttribute('data-status');
        if (status === 'all' || itemStatus === status) {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    // 更新結果計數
    const countEl = document.getElementById('resultCount');
    if (countEl) countEl.textContent = `共 ${visibleCount} 筆`;

    // 空狀態
    const emptyState = document.getElementById('emptyState');
    const orderList = document.getElementById('orderList');
    if (emptyState && orderList) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        orderList.style.display = visibleCount === 0 ? 'none' : 'block';
    }
}

/**
 * 搜尋訂單（依訂單編號）
 */
function searchOrders(keyword) {
    const items = document.querySelectorAll('.order-list-item');
    const searchTerm = keyword.trim().toLowerCase();
    let visibleCount = 0;

    // 同時考慮目前的 tab 篩選
    const activeTab = document.querySelector('.filter-tab.active');
    const activeFilter = activeTab ? activeTab.getAttribute('data-filter') : 'all';

    items.forEach(item => {
        const orderId = item.getAttribute('data-order-id').toLowerCase();
        const itemStatus = item.getAttribute('data-status');
        const matchesSearch = !searchTerm || orderId.includes(searchTerm);
        const matchesFilter = activeFilter === 'all' || itemStatus === activeFilter;

        if (matchesSearch && matchesFilter) {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    const countEl = document.getElementById('resultCount');
    if (countEl) countEl.textContent = `共 ${visibleCount} 筆`;

    const emptyState = document.getElementById('emptyState');
    const orderList = document.getElementById('orderList');
    if (emptyState && orderList) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        orderList.style.display = visibleCount === 0 ? 'none' : 'block';
    }
}

/**
 * 依日期範圍篩選（Prototype 模擬）
 */
function filterByDate(days) {
    // Prototype 中僅做視覺切換，實際需搭配後端 API
    const periodEl = document.querySelector('.stats-period');
    if (periodEl) {
        const labels = { '30': '近 30 日', '90': '近 3 個月', '180': '近半年', 'all': '全部' };
        periodEl.textContent = labels[days] || '近 30 日';
    }
}
