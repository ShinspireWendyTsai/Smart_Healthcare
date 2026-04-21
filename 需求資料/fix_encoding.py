"""
1. 從 git HEAD 還原所有 1.客戶端/ HTML+CSS 及 2.機構端/announcements.html
2. 重新套用本次功能變更（clean UTF-8）
"""
import subprocess, os, re

BASE = r"c:\Users\C1-0045\Desktop\智慧照護git\smart_healthcare_dora"

def git_restore(rel_path):
    """從 git HEAD 取回檔案原始位元組並寫回工作目錄"""
    result = subprocess.run(
        ["git", "show", f"HEAD:{rel_path.replace(chr(92), '/')}"],
        capture_output=True,
        cwd=BASE
    )
    if result.returncode != 0:
        print(f"  SKIP (not in git): {rel_path}")
        return False
    dest = os.path.join(BASE, rel_path)
    with open(dest, "wb") as f:
        f.write(result.stdout)
    return True

# ── Step 1: 還原所有損壞的客戶端檔案 ──────────────────────
client_dir = os.path.join(BASE, "1.客戶端")
restored = 0
for fname in os.listdir(client_dir):
    if fname.endswith(".html") or fname.endswith(".css"):
        rel = f"1.客戶端/{fname}"
        if git_restore(rel):
            restored += 1
            print(f"  ✓ restored: {fname}")

# Restore CSS subfolder
css_dir = os.path.join(client_dir, "css")
for fname in os.listdir(css_dir):
    if fname.endswith(".css"):
        rel = f"1.客戶端/css/{fname}"
        if git_restore(rel):
            restored += 1
            print(f"  ✓ restored: css/{fname}")

# Restore 2.機構端/announcements.html
if git_restore("2.機構端/announcements.html"):
    restored += 1
    print("  ✓ restored: 2.機構端/announcements.html")

print(f"\nTotal restored: {restored} files")

# ── Step 2: 重新套用功能變更 ───────────────────────────────

def read_utf8(rel_path):
    with open(os.path.join(BASE, rel_path), encoding="utf-8") as f:
        return f.read()

def write_utf8(rel_path, content):
    with open(os.path.join(BASE, rel_path), "w", encoding="utf-8") as f:
        f.write(content)

print("\n── 重新套用功能變更 ──")

# ── 2a: orders.html ──────────────────────────────────────
orders = read_utf8("1.客戶端/orders.html")

# 1. 更新 select 選項
OLD_SELECT = """                    <option value="all">全部</option>
                    <option value="pending" selected>待付款</option>
                    <option value="paid">已付款</option>
                    <option value="processing">處理中</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>"""
NEW_SELECT = """                    <option value="all" selected>全部</option>
                    <option value="processing">處理中</option>
                    <option value="confirmed">已確認</option>
                    <option value="completed">已完成</option>
                    <option value="refunded">已退款</option>
                    <option value="cancelled">已取消</option>"""
orders = orders.replace(OLD_SELECT, NEW_SELECT)

# 2. 卡片 ORD202603050001: pending → processing
orders = orders.replace(
    '<!-- 訂單卡片 0 - 待付款 -->\n            <div class="order-card" data-status="pending">',
    '<!-- 訂單卡片 0 - 處理中 -->\n            <div class="order-card" data-status="processing">'
)
orders = orders.replace(
    '<span class="order-status pending">待付款</span>\n                </div>\n                <div class="order-body">\n                    <div class="order-item">\n                        <div class="order-item-image order-item-image-3">',
    '<span class="order-status processing">處理中</span>\n                </div>\n                <div class="order-body">\n                    <div class="order-item">\n                        <div class="order-item-image order-item-image-3">'
)

# 3. 卡片 ORD202603050002: pending → processing
orders = orders.replace(
    '<!-- 訂單卡片 0-2 - 待付款 -->\n            <div class="order-card" data-status="pending">',
    '<!-- 訂單卡片 0-2 - 處理中 -->\n            <div class="order-card" data-status="processing">'
)
orders = orders.replace(
    '<span class="order-status pending">待付款</span>\n                </div>\n                <div class="order-body">\n                    <div class="order-item">\n                        <div class="order-item-image order-item-image-1">',
    '<span class="order-status processing">處理中</span>\n                </div>\n                <div class="order-body">\n                    <div class="order-item">\n                        <div class="order-item-image order-item-image-1">'
)

# 4. 卡片 ORD202601280001: paid → confirmed
orders = orders.replace(
    '<!-- 訂單卡片 1 - 已付款 -->\n            <div class="order-card" data-status="paid">',
    '<!-- 訂單卡片 1 - 已確認 -->\n            <div class="order-card" data-status="confirmed">'
)
orders = orders.replace(
    '<span class="order-status paid">已付款</span>',
    '<span class="order-status confirmed">已確認</span>'
)

# 5. 在「已取消」卡片前插入「已退款」範例卡
REFUNDED_CARD = """            <!-- 訂單卡片 5 - 已退款 -->
            <div class="order-card" data-status="refunded">
                <div class="order-header">
                    <span style="font-size: 16px; color: #4a4a4a;">訂單編號：ORD202601150008</span>
                    <span class="order-status refunded">已退款</span>
                </div>
                <div class="order-body">
                    <div class="order-item">
                        <div class="order-item-image order-item-image-2"></div>
                        <div class="order-item-info">
                            <div class="order-item-name">健康檢測套餐</div>
                            <div class="order-item-spec">單次服務 × 1</div>
                        </div>
                        <div class="order-item-price">NT$ 2,500</div>
                    </div>
                </div>
                <div class="order-footer">
                    <div class="order-total">
                        共 1 項，合計：<span>NT$ 2,500</span>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-primary" onclick="navigateTo('order-detail.html?id=ORD202601150008')">查看詳情</button>
                    </div>
                </div>
            </div>

"""

if "<!-- 訂單卡片 4 - 已取消 -->" in orders and "<!-- 訂單卡片 5 - 已退款 -->" not in orders:
    orders = orders.replace(
        "            <!-- 訂單卡片 4 - 已取消 -->",
        REFUNDED_CARD + "            <!-- 訂單卡片 4 - 已取消 -->"
    )

write_utf8("1.客戶端/orders.html", orders)
print("  ✓ orders.html updated")

# ── 2b: order-detail.html ────────────────────────────────
detail = read_utf8("1.客戶端/order-detail.html")

# 狀態 badge: paid → confirmed
detail = detail.replace(
    '<span class="order-status paid">已付款</span>',
    '<span class="order-status confirmed">已確認</span>'
)

write_utf8("1.客戶端/order-detail.html", detail)
print("  ✓ order-detail.html updated")

# ── 2c: style.css ────────────────────────────────────────
css = read_utf8("1.客戶端/css/style.css")

CSS_INSERT = """\n.order-status.confirmed {
    background: rgba(38, 166, 154, 0.15);
    color: var(--primary-color);
}

.order-status.refunded {
    background: rgba(99, 102, 241, 0.12);
    color: #6366f1;
}

"""
if ".order-status.confirmed" not in css:
    css = css.replace(
        ".order-status.processing {",
        CSS_INSERT + ".order-status.processing {"
    )
    write_utf8("1.客戶端/css/style.css", css)
    print("  ✓ style.css updated")
else:
    print("  - style.css already has confirmed/refunded (skipped)")

# ── 2d: 2.機構端/announcements.html ──────────────────────
ann = read_utf8("2.機構端/announcements.html")

# 將發送對象 select 改為只有「全部會員」
old_select_block = re.search(
    r'(<select[^>]*id="targetAudience"[^>]*>).*?(</select>)',
    ann, re.DOTALL
)
if old_select_block:
    ann = ann[:old_select_block.start()] + \
          '<select class="form-select" id="targetAudience" name="targetAudience">\n                                <option value="all">全部會員</option>\n                            </select>' + \
          ann[old_select_block.end():]
    write_utf8("2.機構端/announcements.html", ann)
    print("  ✓ announcements.html updated")
else:
    # fallback: replace common old options
    replacements = [
        ('全部個案', '全部會員'),
    ]
    changed = False
    for old, new in replacements:
        if old in ann:
            ann = ann.replace(old, new)
            changed = True
    if changed:
        write_utf8("2.機構端/announcements.html", ann)
        print("  ✓ announcements.html updated (fallback)")
    else:
        print("  - announcements.html: no matching pattern found")

print("\nAll done.")
