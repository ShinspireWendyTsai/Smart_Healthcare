Add-Type -AssemblyName System.Drawing

function New-RoundedRectPath {
    param(
        [float]$X,
        [float]$Y,
        [float]$Width,
        [float]$Height,
        [float]$Radius
    )

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = [Math]::Min($Radius * 2, [Math]::Min($Width, $Height))

    if ($diameter -le 0) {
        $path.AddRectangle([System.Drawing.RectangleF]::new($X, $Y, $Width, $Height))
        return $path
    }

    $arc = [System.Drawing.RectangleF]::new($X, $Y, $diameter, $diameter)
    $path.AddArc($arc, 180, 90)

    $arc.X = $X + $Width - $diameter
    $path.AddArc($arc, 270, 90)

    $arc.Y = $Y + $Height - $diameter
    $path.AddArc($arc, 0, 90)

    $arc.X = $X
    $path.AddArc($arc, 90, 90)

    $path.CloseFigure()
    return $path
}

function Draw-HouseIcon {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Pen]$Pen,
        [float]$CenterX,
        [float]$CenterY,
        [float]$Size
    )

    $half = $Size / 2
    $left = $CenterX - $half * 0.8
    $right = $CenterX + $half * 0.8
    $roofTopY = $CenterY - $half * 0.9
    $baseTopY = $CenterY - $half * 0.18
    $baseBottomY = $CenterY + $half * 0.72

    $points = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new($left, $baseTopY),
        [System.Drawing.PointF]::new($CenterX, $roofTopY),
        [System.Drawing.PointF]::new($right, $baseTopY),
        [System.Drawing.PointF]::new($right, $baseBottomY),
        [System.Drawing.PointF]::new($left, $baseBottomY)
    )

    $Graphics.DrawPolygon($Pen, $points)

    $doorTop = $baseBottomY - $half * 0.34
    $Graphics.DrawLine($Pen, $CenterX, $baseBottomY, $CenterX, $doorTop)
}

function Draw-NewsIcon {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Pen]$Pen,
        [float]$CenterX,
        [float]$CenterY,
        [float]$Size
    )

    $half = $Size / 2

    $horn = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new($CenterX - $half * 0.50, $CenterY - $half * 0.32),
        [System.Drawing.PointF]::new($CenterX + $half * 0.22, $CenterY - $half * 0.32),
        [System.Drawing.PointF]::new($CenterX + $half * 0.54, $CenterY - $half * 0.58),
        [System.Drawing.PointF]::new($CenterX + $half * 0.54, $CenterY + $half * 0.58),
        [System.Drawing.PointF]::new($CenterX + $half * 0.22, $CenterY + $half * 0.32),
        [System.Drawing.PointF]::new($CenterX - $half * 0.50, $CenterY + $half * 0.32)
    )

    $Graphics.DrawPolygon($Pen, $horn)

    $handleRect = [System.Drawing.RectangleF]::new(
        $CenterX - $half * 0.16,
        $CenterY + $half * 0.28,
        $half * 0.18,
        $half * 0.50
    )
    $Graphics.DrawRectangle($Pen, $handleRect.X, $handleRect.Y, $handleRect.Width, $handleRect.Height)

    $Graphics.DrawLine($Pen, $CenterX + $half * 0.72, $CenterY - $half * 0.12, $CenterX + $half * 0.96, $CenterY - $half * 0.30)
    $Graphics.DrawLine($Pen, $CenterX + $half * 0.74, $CenterY + $half * 0.04, $CenterX + $half * 1.03, $CenterY + $half * 0.04)
    $Graphics.DrawLine($Pen, $CenterX + $half * 0.72, $CenterY + $half * 0.20, $CenterX + $half * 0.96, $CenterY + $half * 0.36)
}

function Draw-HealthIcon {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Pen]$Pen,
        [float]$CenterX,
        [float]$CenterY,
        [float]$Size
    )

    $bodyW = $Size * 0.56
    $bodyH = $Size * 0.68
    $bodyX = $CenterX - ($bodyW / 2)
    $bodyY = $CenterY - $Size * 0.04

    $capW = $Size * 0.36
    $capH = $Size * 0.14
    $capX = $CenterX - ($capW / 2)
    $capY = $bodyY - $capH - $Size * 0.06

    $bodyPath = New-RoundedRectPath -X $bodyX -Y $bodyY -Width $bodyW -Height $bodyH -Radius ($Size * 0.11)
    $capPath = New-RoundedRectPath -X $capX -Y $capY -Width $capW -Height $capH -Radius ($Size * 0.05)

    $Graphics.DrawPath($Pen, $bodyPath)
    $Graphics.DrawPath($Pen, $capPath)

    $plusHalf = $Size * 0.12
    $plusThickness = $Size * 0.03
    $cx = $CenterX
    $cy = $bodyY + $bodyH * 0.50

    $hRect = New-RoundedRectPath -X ($cx - $plusHalf) -Y ($cy - $plusThickness / 2) -Width ($plusHalf * 2) -Height $plusThickness -Radius ($plusThickness / 2)
    $vRect = New-RoundedRectPath -X ($cx - $plusThickness / 2) -Y ($cy - $plusHalf) -Width $plusThickness -Height ($plusHalf * 2) -Radius ($plusThickness / 2)

    $Graphics.FillPath([System.Drawing.Brushes]::White, $hRect)
    $Graphics.FillPath([System.Drawing.Brushes]::White, $vRect)

    $Graphics.DrawPath($Pen, $hRect)
    $Graphics.DrawPath($Pen, $vRect)

    $bodyPath.Dispose()
    $capPath.Dispose()
    $hRect.Dispose()
    $vRect.Dispose()
}

$outputPath = Join-Path $PSScriptRoot "line-richmenu-1250x843.png"

$width = 1250
$height = 843
$bmp = New-Object System.Drawing.Bitmap $width, $height
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$bgStart = [System.Drawing.Color]::FromArgb(248, 249, 250)
$bgEnd = [System.Drawing.Color]::FromArgb(236, 247, 246)
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    [System.Drawing.Rectangle]::new(0, 0, $width, $height),
    $bgStart,
    $bgEnd,
    135.0
)
$graphics.FillRectangle($bgBrush, 0, 0, $width, $height)

$blobBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(36, 38, 166, 154))
$blobBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(26, 255, 183, 77))
$graphics.FillEllipse($blobBrush1, -120, -100, 460, 340)
$graphics.FillEllipse($blobBrush2, 930, 560, 380, 320)

$cardRect = [System.Drawing.RectangleF]::new(24, 22, 1202, 798)
$shadowPath = New-RoundedRectPath -X ($cardRect.X + 6) -Y ($cardRect.Y + 8) -Width $cardRect.Width -Height $cardRect.Height -Radius 52
$cardPath = New-RoundedRectPath -X $cardRect.X -Y $cardRect.Y -Width $cardRect.Width -Height $cardRect.Height -Radius 52

$shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(32, 38, 166, 154))
$cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 255, 255))
$cardBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(70, 38, 166, 154), 2)

$graphics.FillPath($shadowBrush, $shadowPath)
$graphics.FillPath($cardBrush, $cardPath)
$graphics.DrawPath($cardBorder, $cardPath)

$innerX = 24
$innerY = 22
$innerW = 1202
$innerH = 798

$splitX = $innerX + ($innerW * 0.64)
$midY = $innerY + ($innerH / 2)

$dividerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(75, 38, 166, 154), 2)
$dividerPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Solid
$graphics.DrawLine($dividerPen, $splitX, $innerY + 86, $splitX, $innerY + $innerH - 88)
$graphics.DrawLine($dividerPen, $splitX + 20, $midY, $innerX + $innerW - 20, $midY)

$slotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(32, 38, 166, 154))

$slotPadding = 18
$leftSlotX = $innerX + $slotPadding
$leftSlotY = $innerY + $slotPadding
$leftSlotW = ($splitX - $innerX) - ($slotPadding + 10)
$leftSlotH = $innerH - ($slotPadding * 2)

$rightSlotX = $splitX + 12
$rightSlotW = ($innerX + $innerW) - $rightSlotX - $slotPadding
$rightTopY = $innerY + $slotPadding
$rightTopH = ($midY - $rightTopY) - 10
$rightBottomY = $midY + 10
$rightBottomH = ($innerY + $innerH - $slotPadding) - $rightBottomY

$leftSlotPath = New-RoundedRectPath -X $leftSlotX -Y $leftSlotY -Width $leftSlotW -Height $leftSlotH -Radius 36
$rightTopPath = New-RoundedRectPath -X $rightSlotX -Y $rightTopY -Width $rightSlotW -Height $rightTopH -Radius 30
$rightBottomPath = New-RoundedRectPath -X $rightSlotX -Y $rightBottomY -Width $rightSlotW -Height $rightBottomH -Radius 30

$graphics.FillPath($slotBrush, $leftSlotPath)
$graphics.FillPath($slotBrush, $rightTopPath)
$graphics.FillPath($slotBrush, $rightBottomPath)

$iconBgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(232, 246, 244))
$iconPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(36, 122, 115), 9)
$iconPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$iconPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$iconPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

$labelFontMain = New-Object System.Drawing.Font("Microsoft JhengHei UI", 68, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$labelFontSide = New-Object System.Drawing.Font("Microsoft JhengHei UI", 52, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$labelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(49, 56, 55))

$titleFormat = New-Object System.Drawing.StringFormat
$titleFormat.Alignment = [System.Drawing.StringAlignment]::Center
$titleFormat.LineAlignment = [System.Drawing.StringAlignment]::Center

$leftCenterX = $innerX + (($splitX - $innerX) * 0.50) - 8
$homeCenterY = $innerY + ($innerH * 0.46)

$rightTopCenterX = $rightSlotX + ($rightSlotW / 2)
$rightTopCenterY = $rightTopY + ($rightTopH / 2)
$rightBottomCenterX = $rightSlotX + ($rightSlotW / 2)
$rightBottomCenterY = $rightBottomY + ($rightBottomH / 2)

$sideIconRadius = 102
$sideLabelHeight = 108
$sideGap = 22
$sideGroupCenterOffset = ($sideGap + $sideLabelHeight) / 2

$newsCenterY = $rightTopCenterY - $sideGroupCenterOffset
$newsLabelY = $newsCenterY + $sideIconRadius + $sideGap + ($sideLabelHeight / 2)

$healthCenterY = $rightBottomCenterY - $sideGroupCenterOffset
$healthLabelY = $healthCenterY + $sideIconRadius + $sideGap + ($sideLabelHeight / 2)

$labelHome = ([char[]](0x9996, 0x9801) -join "")
$labelHealth = ([char[]](0x4FDD, 0x5065, 0x98DF, 0x54C1) -join "")
$labelNews = ([char[]](0x6700, 0x65B0, 0x8CC7, 0x8A0A) -join "")

$sections = @(
    @{
        Label = $labelHome
        Icon = "home"
        Font = $labelFontMain
        CenterX = $leftCenterX
        CenterY = $homeCenterY
        IconRadius = 142
        IconSize = 168
        LabelY = $homeCenterY + 218
        LabelWidth = 380
        LabelHeight = 130
    },
    @{
        Label = $labelNews
        Icon = "news"
        Font = $labelFontSide
        CenterX = $rightTopCenterX
        CenterY = $newsCenterY
        IconRadius = $sideIconRadius
        IconSize = 134
        LabelY = $newsLabelY
        LabelWidth = 320
        LabelHeight = $sideLabelHeight
    },
    @{
        Label = $labelHealth
        Icon = "health"
        Font = $labelFontSide
        CenterX = $rightBottomCenterX
        CenterY = $healthCenterY
        IconRadius = $sideIconRadius
        IconSize = 138
        LabelY = $healthLabelY
        LabelWidth = 340
        LabelHeight = $sideLabelHeight
    }
)

foreach ($section in $sections) {
    $cx = [float]$section.CenterX
    $cy = [float]$section.CenterY
    $radius = [float]$section.IconRadius

    $graphics.FillEllipse($iconBgBrush, $cx - $radius, $cy - $radius, $radius * 2, $radius * 2)

    switch ($section.Icon) {
        "home" { Draw-HouseIcon -Graphics $graphics -Pen $iconPen -CenterX $cx -CenterY ($cy + 2) -Size $section.IconSize }
        "health" { Draw-HealthIcon -Graphics $graphics -Pen $iconPen -CenterX $cx -CenterY ($cy + 4) -Size $section.IconSize }
        "news" { Draw-NewsIcon -Graphics $graphics -Pen $iconPen -CenterX $cx -CenterY ($cy + 4) -Size $section.IconSize }
    }

    $labelRect = [System.Drawing.RectangleF]::new(
        $cx - ($section.LabelWidth / 2),
        $section.LabelY - ($section.LabelHeight / 2),
        $section.LabelWidth,
        $section.LabelHeight
    )
    $graphics.DrawString($section.Label, $section.Font, $labelBrush, $labelRect, $titleFormat)
}

$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$titleFormat.Dispose()
$labelBrush.Dispose()
$labelFontMain.Dispose()
$labelFontSide.Dispose()
$iconPen.Dispose()
$iconBgBrush.Dispose()
$leftSlotPath.Dispose()
$rightTopPath.Dispose()
$rightBottomPath.Dispose()
$slotBrush.Dispose()
$dividerPen.Dispose()
$cardBorder.Dispose()
$cardBrush.Dispose()
$shadowBrush.Dispose()
$shadowPath.Dispose()
$cardPath.Dispose()
$blobBrush1.Dispose()
$blobBrush2.Dispose()
$bgBrush.Dispose()
$graphics.Dispose()
$bmp.Dispose()

Write-Output "Generated: $outputPath"
