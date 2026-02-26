/* =============================================
   客戶端主要 JavaScript
   全方位智慧貼身照護平台
   ============================================= */

// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

/**
 * 初始化應用程式
 */
function initApp() {
    initBannerSlider();
    initBottomNav();
    initTabs();
    initNotifications();
    initServiceCards();
    initOrgSwitcher();
}

/* --- 輪播圖功能 --- */
let currentSlide = 0;
let bannerInterval;

/**
 * 初始化輪播圖
 */
function initBannerSlider() {
    const slider = document.querySelector('.banner-slider');
    const dots = document.querySelectorAll('.banner-dot');
    
    if (!slider || dots.length === 0) return;
    
    // 自動輪播
    startBannerAutoPlay();
    
    // 點擊圓點切換
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });
    });
}

/**
 * 跳轉到指定輪播圖
 * @param {number} index - 輪播圖索引
 */
function goToSlide(index) {
    const slider = document.querySelector('.banner-slider');
    const dots = document.querySelectorAll('.banner-dot');
    const totalSlides = dots.length;
    
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    
    currentSlide = index;
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // 更新圓點狀態
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

/**
 * 開始自動輪播
 */
function startBannerAutoPlay() {
    bannerInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 4000);
}

/**
 * 重置自動輪播
 */
function resetAutoPlay() {
    clearInterval(bannerInterval);
    startBannerAutoPlay();
}

/* --- 底部導覽列功能 --- */

/**
 * 初始化底部導覽列
 */
function initBottomNav() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 移除所有 active 狀態
            navItems.forEach(nav => nav.classList.remove('active'));
            // 添加當前 active 狀態
            this.classList.add('active');
        });
    });
}

/* --- 分頁標籤功能 --- */

/**
 * 初始化分頁標籤
 */
function initTabs() {
    const tabs = document.querySelectorAll('.tab-item');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有 active 狀態
            tabs.forEach(t => t.classList.remove('active'));
            // 添加當前 active 狀態
            this.classList.add('active');
            
            // 觸發標籤切換事件
            const tabId = this.dataset.tab;
            switchTabContent(tabId);
        });
    });
}

/**
 * 切換標籤內容
 * @param {string} tabId - 標籤 ID
 */
function switchTabContent(tabId) {
    const orderCards = document.querySelectorAll('.order-card');

    if (orderCards.length > 0) {
        orderCards.forEach(card => {
            const shouldShow = tabId === 'all' || card.dataset.status === tabId;
            card.style.display = shouldShow ? 'block' : 'none';
        });
        return;
    }

    const contents = document.querySelectorAll('.tab-content');
    
    contents.forEach(content => {
        content.style.display = content.dataset.content === tabId ? 'block' : 'none';
    });
}

/* --- 通知功能 --- */

/**
 * 初始化通知功能
 */
function initNotifications() {
    const notificationBell = document.querySelector('.notification-bell');
    
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            // 跳轉到訊息頁面
            window.location.href = 'messages.html';
        });
    }
}

/* --- 機構切換功能 --- */

function initOrgSwitcher() {
    const switcher = document.getElementById('orgSwitcher');
    const dropdown = document.getElementById('orgDropdown');
    const nameLabel = document.getElementById('orgSwitcherName');

    if (!switcher || !dropdown || !nameLabel) return;

    const options = Array.from(dropdown.querySelectorAll('.org-option'));

    const closeDropdown = () => {
        dropdown.classList.remove('show');
        switcher.setAttribute('aria-expanded', 'false');
    };

    const openDropdown = () => {
        dropdown.classList.add('show');
        switcher.setAttribute('aria-expanded', 'true');
    };

    const updateAlert = () => {
        const hasUnread = options.some((option) => {
            return option.classList.contains('has-unread') && !option.classList.contains('active');
        });
        switcher.classList.toggle('has-alert', hasUnread);
    };

    switcher.addEventListener('click', (event) => {
        event.stopPropagation();
        if (dropdown.classList.contains('show')) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    options.forEach((option) => {
        option.addEventListener('click', (event) => {
            event.stopPropagation();
            options.forEach((item) => item.classList.remove('active'));
            option.classList.add('active');
            option.classList.remove('has-unread');
            nameLabel.textContent = option.dataset.org || option.textContent.trim();
            closeDropdown();
            updateAlert();
        });
    });

    document.addEventListener('click', (event) => {
        if (!dropdown.contains(event.target) && event.target !== switcher) {
            closeDropdown();
        }
    });

    updateAlert();
}

/**
 * 更新通知徽章數量
 * @param {number} count - 通知數量
 */
function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    
    if (badge) {
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

/* --- 服務卡片功能 --- */

/**
 * 初始化服務卡片
 */
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceId = this.dataset.serviceId;
            // 服務 ID 為 4 (就醫交通接送) 需要先綁定機構，不直接導航
            if (serviceId && serviceId !== '4') {
                window.location.href = `service-detail.html?id=${serviceId}`;
            }
        });
    });
}

/* --- 購物車功能 --- */

/**
 * 加入購物車
 * @param {string} serviceId - 服務 ID
 * @param {number} quantity - 數量
 */
function addToCart(serviceId, quantity = 1) {
    let cart = getCart();
    
    const existingItem = cart.find(item => item.serviceId === serviceId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ serviceId, quantity });
    }
    
    saveCart(cart);
    updateCartBadge();
    showToast('已加入購物車');
}

/**
 * 取得購物車資料
 * @returns {Array} 購物車項目陣列
 */
function getCart() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}

/**
 * 儲存購物車資料
 * @param {Array} cart - 購物車項目陣列
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * 更新購物車徽章
 */
function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('.cart-badge');
    
    if (badge) {
        if (totalItems > 0) {
            badge.textContent = totalItems > 99 ? '99+' : totalItems;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

/* --- 訊息提示功能 --- */

/**
 * 顯示提示訊息
 * @param {string} message - 提示訊息
 * @param {string} type - 類型 (success/error/warning)
 */
function showToast(message, type = 'success') {
    // 移除現有的 toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 建立新的 toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 添加樣式
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#ffa502'};
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        z-index: 1000;
        animation: toastIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 3 秒後移除
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* --- 頁面導航功能 --- */

/**
 * 導航到指定頁面
 * @param {string} page - 頁面名稱
 */
function navigateTo(page) {
    window.location.href = page;
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

/* --- 表單驗證功能 --- */

/**
 * 驗證手機號碼格式
 * @param {string} phone - 手機號碼
 * @returns {boolean} 是否有效
 */
function validatePhone(phone) {
    const phoneRegex = /^09\d{8}$/;
    return phoneRegex.test(phone);
}

/**
 * 驗證電子郵件格式
 * @param {string} email - 電子郵件
 * @returns {boolean} 是否有效
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
 * 格式化時間
 * @param {Date|string} date - 日期時間
 * @returns {string} 格式化後的時間
 */
function formatTime(date) {
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/* --- 機構綁定彈出視窗功能 --- */

/**
 * 顯示機構綁定彈出視窗
 */
function showBindingModal() {
    const modal = document.getElementById('bindingModal');
    if (modal) {
        modal.style.display = 'flex';
        // 清空輸入框
        const input = document.getElementById('bindingCodeInput');
        if (input) {
            input.value = '';
            input.focus();
        }
    }
}

/**
 * 隱藏機構綁定彈出視窗
 */
function hideBindingModal() {
    const modal = document.getElementById('bindingModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * 確認綁定機構
 */
function confirmBinding() {
    const input = document.getElementById('bindingCodeInput');
    const code = input ? input.value.trim() : '';
    
    if (!code) {
        showToast('請輸入機構綁定碼', 'warning');
        return;
    }
    
    // 這裡可以添加驗證綁定碼的邏輯
    // 目前先模擬綁定成功
    showToast('綁定成功！', 'success');
    hideBindingModal();
    
    // 綁定成功後可跳轉到服務詳情頁
    // navigateTo('service-detail.html?id=4');
}

// 添加 CSS 動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes toastIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes toastOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
    }
`;
document.head.appendChild(style);
