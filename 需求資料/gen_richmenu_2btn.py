"""
生成 LINE Rich Menu - 小型 2 欄版（首頁 + 瀏覽商品）
尺寸：1250 x 422 px（LINE 小型 2500x843 的 0.5x）
風格對齊 line-richmenu-1250x843.png：淺色底 + teal 描邊輪廓圖示
"""

from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.dirname(os.path.abspath(__file__))
W, H = 2500, 843   # LINE 小型正式上傳尺寸

# ── 色票（對齊原版）────────────────────────────────────────────────────────────
BG_START    = (248, 249, 250)
BG_END      = (236, 247, 246)
CARD_FILL   = (240, 255, 255, 255)   # RGBA
CARD_BORDER = (38, 166, 154, 70)     # RGBA
SLOT_FILL   = (32, 38, 166, 154, 32) # placeholder; see below
DIVIDER     = (38, 166, 154, 75)     # RGBA

SLOT_BG     = (38, 166, 154, 32)     # RGBA – slot 淡藍綠
CIRCLE_BG   = (232, 246, 244)        # RGB  – icon 圓底（淺色）
ICON_COLOR  = (36, 122, 115)         # RGB  – icon 描邊
TEXT_COLOR  = (49, 56, 55)           # RGB

BORDER_R    = 104   # 對齊原版 outer card（×2）
SLOT_R      = 60    # inner slot（×2）
CARD_PAD    = 48    # card inner padding（×2）
GAP         = 48    # gap between two slots（×2）
LINE_W      = 18    # icon stroke width（×2）
CIRCLE_R    = 216   # icon 圓底半徑（×2）


# ─── font ─────────────────────────────────────────────────────────────────────
def load_font(size):
    for p in [
        r"C:\Windows\Fonts\msjhbd.ttc",
        r"C:\Windows\Fonts\msjh.ttc",
        r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\msyhbd.ttc",
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\arial.ttf",
    ]:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


# ─── helpers ──────────────────────────────────────────────────────────────────
def composite_layer(img, draw_fn):
    """Overlay an RGBA layer onto RGB img via draw_fn(draw, size)."""
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d  = ImageDraw.Draw(ov)
    draw_fn(d, img.size)
    return Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")


def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


# ─── icon: house outline（對齊原版風格） ───────────────────────────────────────
def draw_house_outline(draw, cx, cy, s, color, lw):
    """
    House outline icon:  pentagon roof + rectangular body + arched door
    s  = half-width of the house base
    """
    s = float(s)
    roof_apex_y  = cy - s * 1.00
    eave_y       = cy - s * 0.22
    body_bottom  = cy + s * 0.80
    body_l       = cx - s * 0.75
    body_r       = cx + s * 0.75

    # outer outline (one connected polygon: apex → right eave → right base → left base → left eave)
    pts = [
        (cx,     roof_apex_y),
        (body_r, eave_y),
        (body_r, body_bottom),
        (body_l, body_bottom),
        (body_l, eave_y),
    ]
    draw.line(pts + [pts[0]], fill=color, width=lw, joint="curve")

    # door  (rounded rect, centered)
    door_w = s * 0.30
    door_h = s * 0.44
    dx = cx - door_w / 2
    dy = body_bottom - door_h
    draw.rounded_rectangle(
        [dx, dy, dx + door_w, body_bottom],
        radius=door_w * 0.35,
        outline=color, width=lw,
    )


# ─── icon: shopping cart outline（瀏覽商品） ──────────────────────────────────
def draw_cart_outline(draw, cx, cy, s, color, lw):
    """
    Classic shopping cart outline centred on (cx, cy).
    Parts: basket body + two wheels + back handle post + horizontal grip.
    """
    s = float(s)
    # basket dimensions
    bw = s * 1.50   # basket width
    bh = s * 0.90   # basket height
    # vertical centre: wheels sit below basket, handle above → total height ~ bh + wheel_d + handle_h
    wheel_r   = s * 0.18
    handle_h  = s * 0.55
    total_h   = handle_h + bh + wheel_r * 2 + s * 0.10
    top_y     = cy - total_h / 2

    grip_y    = top_y                    # horizontal grip bar top
    post_top  = grip_y + lw / 2          # handle post top (at grip)
    basket_y  = grip_y + handle_h        # basket top
    basket_x  = cx - bw / 2

    # ── horizontal grip bar (short, on right side) ──
    grip_x1 = cx + bw * 0.08
    grip_x2 = cx + bw * 0.55
    draw.line([(grip_x1, grip_y), (grip_x2, grip_y)],
              fill=color, width=lw)

    # ── handle post (vertical, connecting grip to basket-right) ──
    post_x = grip_x1
    draw.line([(post_x, post_top), (post_x, basket_y)],
              fill=color, width=lw)

    # ── basket body (rounded rectangle) ──
    draw.rounded_rectangle(
        [basket_x, basket_y, basket_x + bw, basket_y + bh],
        radius=bh * 0.16,
        outline=color, width=lw,
    )

    # ── two wheels ──
    wheel_y_center = basket_y + bh + wheel_r + s * 0.05
    for wx in [basket_x + bw * 0.22, basket_x + bw * 0.78]:
        draw.ellipse(
            [wx - wheel_r, wheel_y_center - wheel_r,
             wx + wheel_r, wheel_y_center + wheel_r],
            outline=color, width=lw,
        )


# ─── main ─────────────────────────────────────────────────────────────────────
def generate():
    # gradient background
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    for x in range(W):
        t = x / (W - 1)
        draw.line([(x, 0), (x, H)], fill=lerp_color(BG_START, BG_END, t * 0.6))

    # subtle blob top-right
    def blob(d, size):
        for rr, op in [(200, 0.05), (150, 0.08), (100, 0.11)]:
            d.ellipse([W - rr * 1.5, -rr + 10, W + rr * 0.5, rr + 10],
                      fill=(*ICON_COLOR, int(255 * op)))
    img = composite_layer(img, blob)

    # outer card shadow
    def shadow(d, size):
        d.rounded_rectangle([30, 30, W - 18, H - 18], radius=BORDER_R,
                             fill=(38, 166, 154, 28))
    img = composite_layer(img, shadow)

    # outer card
    def card(d, size):
        d.rounded_rectangle([24, 22, W - 24, H - 22], radius=BORDER_R,
                             fill=CARD_FILL, outline=CARD_BORDER, width=2)
    img = composite_layer(img, card)

    # calculate slot positions
    ix  = 24 + CARD_PAD      # inner left edge
    iy  = 22 + CARD_PAD      # inner top edge
    iw  = W - 48 - CARD_PAD * 2
    ih  = H - 44 - CARD_PAD * 2
    sw  = (iw - GAP) // 2    # slot width

    slots_def = [
        {"x": ix,           "label": "首頁",    "icon": "home"},
        {"x": ix + sw + GAP, "label": "瀏覽商品", "icon": "cart"},
    ]

    for s in slots_def:
        sx, sy = s["x"], iy
        ex, ey = sx + sw, iy + ih

        # slot bg
        def draw_slot(d, size, _sx=sx, _sy=sy, _ex=ex, _ey=ey):
            d.rounded_rectangle([_sx, _sy, _ex, _ey], radius=SLOT_R, fill=SLOT_BG)
        img = composite_layer(img, draw_slot)

        draw = ImageDraw.Draw(img)

        cx = (sx + ex) / 2
        cy_icon = sy + ih * 0.42     # icon circle centre (upper 42%)
        cy_label = sy + ih * 0.82    # label centre Y

        # icon background circle (light fill)
        cr = CIRCLE_R
        draw.ellipse(
            [cx - cr, cy_icon - cr, cx + cr, cy_icon + cr],
            fill=CIRCLE_BG,
        )

        # icon stroke
        icon_s = cr * 0.58
        if s["icon"] == "home":
            draw_house_outline(draw, cx, cy_icon, icon_s, ICON_COLOR, LINE_W)
        else:
            draw_cart_outline(draw, cx, cy_icon, icon_s, ICON_COLOR, LINE_W)

        # label
        label   = s["label"]
        font_sz = 104 if len(label) <= 2 else 80
        font    = load_font(font_sz)
        try:
            bb = font.getbbox(label)
            tw, th = bb[2] - bb[0], bb[3] - bb[1]
        except Exception:
            tw, th = font_sz * len(label), font_sz
        draw.text((cx - tw / 2, cy_label - th / 2), label, font=font, fill=TEXT_COLOR)

    # divider line between slots (subtle)
    draw = ImageDraw.Draw(img)
    mid_x = ix + sw + GAP // 2
    draw.line([(mid_x, iy + 20), (mid_x, iy + ih - 20)],
              fill=(*ICON_COLOR, 50), width=2)

    out_path = os.path.join(OUT, "line_rich_menu_2btn.png")
    img.save(out_path, "PNG")
    print(f"Saved: {out_path}")
    print(f"Size: {W} x {H} px  (LINE 小型官方尺寸)")


if __name__ == "__main__":
    generate()
