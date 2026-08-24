Add-Type -AssemblyName System.Drawing

$publicDir = "c:\Users\master solution\OneDrive\Desktop\dhamme app\public"
if (!(Test-Path $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir -Force | Out-Null
}

function Generate-DhammeIcon {
    param(
        [int]$size,
        [string]$outputPath,
        [bool]$isMaskable = $false
    )

    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Charcoal background with smooth rounded corners matching logo
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 17, 19, 21))
    $radius = [Math]::Max(4, [int]($size * 0.20))
    $diam = $radius * 2
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, $diam, $diam, 180, 90)
    $path.AddArc($size - $diam, 0, $diam, $diam, 270, 90)
    $path.AddArc($size - $diam, $size - $diam, $diam, $diam, 0, 90)
    $path.AddArc(0, $size - $diam, $diam, $diam, 90, 90)
    $path.CloseFigure()
    $g.FillPath($bgBrush, $path)
    $bgBrush.Dispose()
    $path.Dispose()

    # Scale factor for maskable safe area or standard
    $scale = if ($isMaskable) { 0.65 } else { 0.82 }
    $center = $size / 2.0

    # Save state before rotation
    $state = $g.Save()
    $g.TranslateTransform($center, $center)
    $g.RotateTransform(45.0)

    # Outer Diamond in Champagne Gold #C8A96B with rounded joins
    $outerSize = ($size * $scale) * 0.58
    $halfOuter = $outerSize / 2.0
    $strokeWidth = [Math]::Max(2.5, ($size * 0.075))
    $goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 200, 169, 107), $strokeWidth)
    $goldPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $goldPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $goldPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    
    $g.DrawRectangle($goldPen, -$halfOuter, -$halfOuter, $outerSize, $outerSize)
    $goldPen.Dispose()

    # Inner Diamond in White #FFFFFF
    $innerSize = $outerSize * 0.46
    $halfInner = $innerSize / 2.0
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillRectangle($whiteBrush, -$halfInner, -$halfInner, $innerSize, $innerSize)
    $whiteBrush.Dispose()

    $g.Restore($state)

    # Save as PNG
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated icon: $outputPath ($($size)x$($size))"
}

# 1. Generate Google Search Favicon Multiples (48x48, 96x96, 144x144, 192x192)
Generate-DhammeIcon -size 48 -outputPath "$publicDir\favicon-48x48.png" -isMaskable $false
Generate-DhammeIcon -size 96 -outputPath "$publicDir\favicon-96x96.png" -isMaskable $false
Generate-DhammeIcon -size 144 -outputPath "$publicDir\favicon-144x144.png" -isMaskable $false
Generate-DhammeIcon -size 192 -outputPath "$publicDir\pwa-192x192.png" -isMaskable $false

# 2. Generate 512x512 PNG Icon & Brand Logo
Generate-DhammeIcon -size 512 -outputPath "$publicDir\pwa-512x512.png" -isMaskable $false
Generate-DhammeIcon -size 512 -outputPath "$publicDir\dhamme-logo.png" -isMaskable $false

# 3. Generate 512x512 Maskable PNG Icon (with safe zone)
Generate-DhammeIcon -size 512 -outputPath "$publicDir\pwa-maskable-512x512.png" -isMaskable $true

# 4. Generate Apple Touch Icon 180x180
Generate-DhammeIcon -size 180 -outputPath "$publicDir\apple-touch-icon.png" -isMaskable $false

# 5. Generate Favicon PNG 64x64 & Copy to favicon.ico
Generate-DhammeIcon -size 64 -outputPath "$publicDir\favicon.png" -isMaskable $false
Copy-Item "$publicDir\favicon-48x48.png" "$publicDir\favicon.ico" -Force


# 6. Generate Desktop Screenshot (1280x720)
function Generate-DesktopScreenshot {
    param([string]$outputPath)
    $w = 1280
    $h = 720
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background Warm Off-White
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 249, 246))
    $g.FillRectangle($bgBrush, 0, 0, $w, $h)
    $bgBrush.Dispose()

    # Header Bar
    $headerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillRectangle($headerBrush, 0, 0, $w, 70)
    $headerBrush.Dispose()

    # Header Border
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 232, 229, 223), 1.0)
    $g.DrawLine($borderPen, 0, 70, $w, 70)

    # Header Brand Logo Emblem
    $logoBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 17, 19, 21))
    $g.FillRectangle($logoBg, 40, 15, 40, 40)
    $logoBg.Dispose()

    # Gold diamond in logo
    $state = $g.Save()
    $g.TranslateTransform(60, 35)
    $g.RotateTransform(45.0)
    $goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 200, 169, 107), 3.0)
    $g.DrawRectangle($goldPen, -10, -10, 20, 20)
    $goldPen.Dispose()
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillRectangle($whiteBrush, -4, -4, 8, 8)
    $whiteBrush.Dispose()
    $g.Restore($state)

    # Brand Title
    $fontTitle = New-Object System.Drawing.Font("Georgia", 16, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 17, 19, 21))
    $g.DrawString("DHAMME", $fontTitle, $textBrush, 90, 16)
    
    $fontSub = New-Object System.Drawing.Font("Arial", 8, [System.Drawing.FontStyle]::Bold)
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 116, 119, 123))
    $g.DrawString("REAL ESTATE - JIGJIGA MARKETPLACE", $fontSub, $subBrush, 90, 40)

    # Hero Photography Banner Container
    $heroBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 17, 19, 21))
    $g.FillRectangle($heroBrush, 40, 90, ($w - 80), 260)
    $heroBrush.Dispose()

    # Hero Overlay Text
    $heroTagFont = New-Object System.Drawing.Font("Arial", 9, [System.Drawing.FontStyle]::Bold)
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 200, 169, 107))
    $g.DrawString("JIGJIGA LUXURY REAL ESTATE MARKETPLACE", $heroTagFont, $goldBrush, 70, 120)

    $heroTitleFont = New-Object System.Drawing.Font("Georgia", 28, [System.Drawing.FontStyle]::Bold)
    $whiteTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.DrawString("DHamme ayaa kuu dhamaystiraya", $heroTitleFont, $whiteTextBrush, 70, 150)

    $heroSubFont = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Regular)
    $heroSubBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 249, 246))
    $g.DrawString("Kirayso ama Iibso guryaha ugu casrisan ee Jigjiga. Discover extraordinary homes.", $heroSubFont, $heroSubBrush, 70, 205)

    # Search Bar Card inside Hero
    $searchCardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillRectangle($searchCardBrush, 70, 250, ($w - 140), 65)
    $searchCardBrush.Dispose()

    $searchFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Regular)
    $searchPlaceholderBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 116, 119, 123))
    $g.DrawString("Search by neighborhood, kebele, or property type (Garabase, Taiwan Area, Villa...)", $searchFont, $searchPlaceholderBrush, 95, 272)

    # Property Grid Section Title
    $secTitleFont = New-Object System.Drawing.Font("Georgia", 16, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Guryaha Cusub ee Jigjiga (Exclusive Listings)", $secTitleFont, $textBrush, 40, 375)

    # 3 Sample Property Cards
    $cardWidth = ($w - 120) / 3.0
    $cardHeight = 300
    for ($i = 0; $i -lt 3; $i++) {
        $cardX = 40 + $i * ($cardWidth + 20)
        $cardY = 410

        # Card Background
        $cardBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
        $g.FillRectangle($cardBg, $cardX, $cardY, $cardWidth, $cardHeight)
        $cardBg.Dispose()
        $g.DrawRectangle($borderPen, $cardX, $cardY, $cardWidth, $cardHeight)

        # Image placeholder
        $imgBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 230, 226, 220))
        $g.FillRectangle($imgBg, $cardX, $cardY, $cardWidth, 170)
        $imgBg.Dispose()

        # Badge
        $badgeBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 74, 122, 99))
        $g.FillRectangle($badgeBg, ($cardX + 12), ($cardY + 12), 90, 24)
        $badgeBg.Dispose()
        $badgeFont = New-Object System.Drawing.Font("Arial", 8, [System.Drawing.FontStyle]::Bold)
        $g.DrawString("VERIFIED", $badgeFont, $whiteTextBrush, ($cardX + 20), ($cardY + 16))

        # Title & Price
        $propTitles = @("Villa Casri ah Garabase", "Guri Qoys Taiwan Market", "Apartment Airport Road")
        $propPrices = @("45,000 ETB/mo", "28,000 ETB/mo", "35,000 ETB/mo")
        $propLocs = @("Jigjiga - Kebele 06", "Jigjiga - Kebele 03", "Jigjiga - Kebele 08")

        $cardTitleFont = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Bold)
        $g.DrawString($propTitles[$i], $cardTitleFont, $textBrush, ($cardX + 12), ($cardY + 185))

        $cardLocFont = New-Object System.Drawing.Font("Arial", 9, [System.Drawing.FontStyle]::Regular)
        $g.DrawString($propLocs[$i], $cardLocFont, $subBrush, ($cardX + 12), ($cardY + 210))

        $cardPriceFont = New-Object System.Drawing.Font("Georgia", 14, [System.Drawing.FontStyle]::Bold)
        $g.DrawString($propPrices[$i], $cardPriceFont, $textBrush, ($cardX + 12), ($cardY + 250))
    }

    $borderPen.Dispose()
    $textBrush.Dispose()
    $subBrush.Dispose()
    $whiteTextBrush.Dispose()
    $goldBrush.Dispose()

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated desktop screenshot: $outputPath"
}

# 7. Generate Mobile Portrait Screenshot (750x1334)
function Generate-MobileScreenshot {
    param([string]$outputPath)
    $w = 750
    $h = 1334
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background Warm Off-White
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 249, 246))
    $g.FillRectangle($bgBrush, 0, 0, $w, $h)
    $bgBrush.Dispose()

    # Top App Header
    $headerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillRectangle($headerBrush, 0, 0, $w, 100)
    $headerBrush.Dispose()

    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 232, 229, 223), 1.5)
    $g.DrawLine($borderPen, 0, 100, $w, 100)

    # Logo Box
    $logoBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 17, 19, 21))
    $g.FillRectangle($logoBg, 30, 25, 50, 50)
    $logoBg.Dispose()

    $state = $g.Save()
    $g.TranslateTransform(55, 50)
    $g.RotateTransform(45.0)
    $goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 200, 169, 107), 4.0)
    $g.DrawRectangle($goldPen, -12, -12, 24, 24)
    $goldPen.Dispose()
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillRectangle($whiteBrush, -5, -5, 10, 10)
    $whiteBrush.Dispose()
    $g.Restore($state)

    # Brand Title
    $fontTitle = New-Object System.Drawing.Font("Georgia", 20, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 17, 19, 21))
    $g.DrawString("DHAMME", $fontTitle, $textBrush, 95, 26)

    $fontSub = New-Object System.Drawing.Font("Arial", 9, [System.Drawing.FontStyle]::Bold)
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 116, 119, 123))
    $g.DrawString("REAL ESTATE - JIGJIGA", $fontSub, $subBrush, 95, 56)

    # Mobile Hero Banner
    $heroBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 17, 19, 21))
    $g.FillRectangle($heroBrush, 24, 120, ($w - 48), 340)
    $heroBrush.Dispose()

    $heroTagFont = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 200, 169, 107))
    $g.DrawString("JIGJIGA MARKETPLACE", $heroTagFont, $goldBrush, 50, 145)

    $heroTitleFont = New-Object System.Drawing.Font("Georgia", 24, [System.Drawing.FontStyle]::Bold)
    $whiteTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.DrawString("DHamme ayaa kuu dhamaystiraya", $heroTitleFont, $whiteTextBrush, 50, 180)

    $heroSubFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Regular)
    $heroSubBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 249, 246))
    $g.DrawString("Kirayso ama Iibso guryaha ugu casrisan ee Jigjiga.", $heroSubFont, $heroSubBrush, 50, 260)

    # Search Bar
    $searchCardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillRectangle($searchCardBrush, 50, 360, ($w - 100), 70)
    $searchCardBrush.Dispose()

    $searchFont = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Regular)
    $g.DrawString("Raadi xaafad, kebele...", $searchFont, $subBrush, 75, 385)

    # Filter Pills
    $pills = @("Dhammaan", "Kiro", "Iib", "Villas", "Apartments")
    for ($p = 0; $p -lt $pills.Length; $p++) {
        $pillX = 24 + $p * 140
        if ($pillX + 130 -lt $w) {
            $pillBg = if ($p -eq 0) { New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 17, 19, 21)) } else { New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255)) }
            $g.FillRectangle($pillBg, $pillX, 480, 130, 48)
            $pillBg.Dispose()
            $g.DrawRectangle($borderPen, $pillX, 480, 130, 48)
            $pillTextBrush = if ($p -eq 0) { $whiteTextBrush } else { $textBrush }
            $pillFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
            $g.DrawString($pills[$p], $pillFont, $pillTextBrush, ($pillX + 25), 493)
        }
    }

    # Mobile Property Card 1
    $card1Y = 550
    $cardBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillRectangle($cardBg, 24, $card1Y, ($w - 48), 580)
    $cardBg.Dispose()
    $g.DrawRectangle($borderPen, 24, $card1Y, ($w - 48), 580)

    # Card Image Placeholder
    $imgBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 230, 226, 220))
    $g.FillRectangle($imgBg, 24, $card1Y, ($w - 48), 360)
    $imgBg.Dispose()

    # Verified Badge
    $badgeBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 74, 122, 99))
    $g.FillRectangle($badgeBg, 45, ($card1Y + 20), 120, 32)
    $badgeBg.Dispose()
    $badgeFont = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("VERIFIED", $badgeFont, $whiteTextBrush, 60, ($card1Y + 26))

    # Details
    $cardTitleFont = New-Object System.Drawing.Font("Georgia", 18, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Villa Casri ah oo Garabase ku taal", $cardTitleFont, $textBrush, 45, ($card1Y + 380))

    $cardLocFont = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Regular)
    $g.DrawString("Jigjiga - Kebele 06 (Garabase Area)", $cardLocFont, $subBrush, 45, ($card1Y + 420))

    $cardPriceFont = New-Object System.Drawing.Font("Georgia", 22, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("45,000 ETB/mo", $cardPriceFont, $textBrush, 45, ($card1Y + 480))

    # Bottom Navigation Bar
    $bottomNavBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillRectangle($bottomNavBrush, 0, ($h - 90), $w, 90)
    $bottomNavBrush.Dispose()
    $g.DrawLine($borderPen, 0, ($h - 90), $w, ($h - 90))

    $navLabels = @("Home", "Search", "Post +", "Saved", "Profile")
    for ($n = 0; $n -lt $navLabels.Length; $n++) {
        $navX = $n * ($w / 5.0)
        $navFont = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)
        $navTextBrush = if ($n -eq 0) { $textBrush } else { $subBrush }
        $g.DrawString($navLabels[$n], $navFont, $navTextBrush, ($navX + 40), ($h - 50))
    }

    $borderPen.Dispose()
    $textBrush.Dispose()
    $subBrush.Dispose()
    $whiteTextBrush.Dispose()
    $goldBrush.Dispose()

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated mobile screenshot: $outputPath"
}

Generate-DesktopScreenshot -outputPath "$publicDir\screenshot-desktop.png"
Generate-MobileScreenshot -outputPath "$publicDir\screenshot-mobile.png"
