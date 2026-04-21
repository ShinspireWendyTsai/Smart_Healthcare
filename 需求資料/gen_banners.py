from PIL import Image, ImageDraw, ImageFont
import math, os

OUT = r"c:\Users\C1-0045\Desktop\智慧照護git\smart_healthcare_dora\需求資料"
W, H = 1200, 400

def load_font(size):
    candidates = [
        r"C:\Windows\Fonts\msjhbd.ttc",
        r"C:\Windows\Fonts\msjh.ttc",
        r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\msyhbd.ttc",
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\arial.ttf",
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    return ImageFont.load_default()

def lerp(c1, c2, t):
    return tuple(int(c1[i]+(c2[i]-c1[i])*t) for i in range(3))

def alpha_ellipse(img, cx, cy, r, color, op):
    ov = Image.new("RGBA", img.size, (0,0,0,0))
    ImageDraw.Draw(ov).ellipse([cx-r,cy-r,cx+r,cy+r], fill=(*color, int(255*op)))
    return Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")

def alpha_rrect(img, box, radius, fill_rgba, outline_rgba=None, outline_w=1):
    ov = Image.new("RGBA", img.size, (0,0,0,0))
    d = ImageDraw.Draw(ov)
    d.rounded_rectangle(box, radius=radius, fill=fill_rgba,
                         outline=outline_rgba, width=outline_w)
    return Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")

# BANNER 1  ── 情感守護  "守護家人，從心開始"
def banner1():
    img = Image.new("RGB",(W,H))
    draw = ImageDraw.Draw(img)
    for x in range(W):
        t=x/(W-1)
        col=lerp((30,27,75),(99,102,241),t)
        draw.line([(x,0),(x,H)],fill=col)
    for r,op in [(280,.06),(220,.09),(160,.13),(110,.18),(75,.24),(50,.30)]:
        img=alpha_ellipse(img,970,185,r,(167,139,250),op)
    for r,op in [(200,.08),(160,.12)]:
        img=alpha_ellipse(img,840,320,r,(129,140,248),op)
    draw=ImageDraw.Draw(img)
    for row in range(5):
        for col in range(7):
            x=58+col*30; y=52+row*30
            a=45 if (row+col)%2==0 else 20
            draw.ellipse([x-2,y-2,x+2,y+2],fill=(255,255,255,a))
    # heart icon decoration (small dots arc)
    import math as _m
    for i in range(18):
        a=_m.radians(-40+i*14)
        rx=int(920+180*_m.cos(a)); ry=int(185+180*_m.sin(a))
        draw.ellipse([rx-3,ry-3,rx+3,ry+3],fill=(167,139,250,60))
    img=alpha_rrect(img,[52,42,204,67],12,(79,70,229,200))
    draw=ImageDraw.Draw(img)
    draw.text((64,48),"智慧照護  ·  貼心服務",font=load_font(14),fill=(196,181,253))
    draw.text((58,90),"守護家人",font=load_font(64),fill=(255,255,255))
    draw.text((58,160),"從心開始",font=load_font(60),fill=(196,181,253))
    draw.text((60,252),"專業照護人員・彈性預約・到府服務，讓您安心無憂",font=load_font(18),fill=(199,210,254))
    img=alpha_rrect(img,[60,304,244,342],22,(255,255,255,255))
    draw=ImageDraw.Draw(img)
    draw.text((80,313),"立即預約服務  →",font=load_font(17),fill=(79,70,229))
    draw.text((W-202,H-26),"智慧照護  陪伴每一天",font=load_font(12),fill=(139,92,246))
    img.save(os.path.join(OUT,"banner-1-brand.png"),"PNG")
    print("banner-1-brand.png saved")

# BANNER 2  ── 服務便利  "輕鬆預約，安心照護"
def banner2():
    img = Image.new("RGB",(W,H),(255,255,255))
    draw = ImageDraw.Draw(img)
    for x in range(530):
        t=x/529
        col=lerp((238,236,255),(255,255,255),t)
        draw.line([(x,0),(x,H)],fill=col)
    for r,op in [(320,.04),(250,.06),(190,.09)]:
        img=alpha_ellipse(img,900,200,r,(99,102,241),op)
    draw=ImageDraw.Draw(img)
    draw.rectangle([0,0,5,H],fill=(99,102,241))
    img=alpha_rrect(img,[30,40,192,65],12,(238,236,255,255))
    draw=ImageDraw.Draw(img)
    draw.text((42,47),"多元服務  全方位照護",font=load_font(13),fill=(99,102,241))
    draw.text((30,82),"輕鬆預約",font=load_font(58),fill=(30,27,75))
    draw.text((30,146),"安心照護",font=load_font(56),fill=(99,102,241))
    draw.text((32,225),"居家・陪伴・復健・送餐，專業人員到府，您只需輕鬆等候",font=load_font(17),fill=(100,116,139))
    services=[
        ("居家照護",(79,70,229)),("醫療陪伴",(16,185,129)),
        ("復健服務",(245,158,11)),("送餐到府",(239,68,68)),
        ("心理諮商",(139,92,246)),("輔具服務",(6,182,212)),
    ]
    positions=[(638,74),(810,74),(982,74),(700,152),(872,152),(1044,152)]
    for (label,rc),(tx,ty) in zip(services,positions):
        img=alpha_rrect(img,[tx,ty,tx+158,ty+44],10,(*rc,28),(*rc,160),1)
        draw=ImageDraw.Draw(img)
        draw.text((tx+16,ty+12),label,font=load_font(15),fill=rc)
    img=alpha_rrect(img,[30,300,200,340],20,(99,102,241,255))
    draw=ImageDraw.Draw(img)
    draw.text((52,310),"探索所有服務  →",font=load_font(16),fill=(255,255,255))
    draw.text((W-202,H-26),"智慧照護  陪伴每一天",font=load_font(12),fill=(148,163,184))
    img.save(os.path.join(OUT,"banner-2-services.png"),"PNG")
    print("banner-2-services.png saved")

# BANNER 3  ── 新會員優惠  "首次預約享優惠"
def banner3():
    img = Image.new("RGB",(W,H))
    draw = ImageDraw.Draw(img)
    for x in range(W):
        t=x/(W-1)
        col=lerp((13,110,105),(79,70,229),t)
        draw.line([(x,0),(x,H)],fill=col)
    for amp,freq,phase,op in [(55,.008,0,.12),(38,.013,1.3,.09),(26,.017,2.6,.07)]:
        pts=[]
        for x in range(W):
            y=int(H*.56+amp*math.sin(freq*x+phase))
            pts.append((x,y))
        pts+=[(W,H),(0,H)]
        ov=Image.new("RGBA",img.size,(0,0,0,0))
        ImageDraw.Draw(ov).polygon(pts,fill=(255,255,255,int(255*op)))
        img=Image.alpha_composite(img.convert("RGBA"),ov).convert("RGB")
    for r,op in [(175,.10),(130,.15),(90,.22),(58,.28)]:
        ov=Image.new("RGBA",img.size,(0,0,0,0))
        ImageDraw.Draw(ov).ellipse([980-r,160-r,980+r,160+r],outline=(255,255,255,int(255*op)),width=2)
        img=Image.alpha_composite(img.convert("RGBA"),ov).convert("RGB")
    draw=ImageDraw.Draw(img)
    badges=[("  免費諮詢",636,110),("  快速媒合",790,110),("  品質保證",944,110)]
    for btxt,bx,by in badges:
        img=alpha_rrect(img,[bx,by,bx+132,by+38],19,(255,255,255,40))
        draw=ImageDraw.Draw(img)
        draw.text((bx+14,by+10),btxt,font=load_font(14),fill=(255,255,255))
    img=alpha_rrect(img,[52,43,218,68],12,(0,0,0,55))
    draw=ImageDraw.Draw(img)
    draw.text((64,49),"新會員專屬優惠",font=load_font(14),fill=(167,243,208))
    draw.text((54,88),"首次預約享優惠",font=load_font(60),fill=(255,255,255))
    draw.text((56,166),"立即加入，首次服務 9 折優惠，讓照護更輕鬆省心",font=load_font(18),fill=(167,243,208))
    img=alpha_rrect(img,[56,220,222,262],22,(255,255,255,255))
    draw=ImageDraw.Draw(img)
    draw.text((76,230),"立即預約  →",font=load_font(17),fill=(13,110,105))
    draw.text((234,232),"了解更多",font=load_font(15),fill=(167,243,208))
    draw.line([(234,252),(304,252)],fill=(167,243,208),width=1)
    draw.text((W-202,H-26),"智慧照護  陪伴每一天",font=load_font(12),fill=(167,243,208))
    img.save(os.path.join(OUT,"banner-3-cta.png"),"PNG")
    print("banner-3-cta.png saved")

banner1()
banner2()
banner3()
print("All done.")
