Add-Type -AssemblyName System.Drawing

function New-RoundedRectanglePath {
  param(
    [single]$X,
    [single]$Y,
    [single]$Width,
    [single]$Height,
    [single]$Radius
  )

  $diameter = 2 * $Radius
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

$bitmap = [System.Drawing.Bitmap]::new(512, 512)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear([System.Drawing.Color]::Transparent)

$background = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#142630'))
$aqua = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#12DADD'))
$violet = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#A779EE'))
$mint = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#61FFCA'))
$white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
$line = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#527481'), 5)
$font = [System.Drawing.Font]::new('Segoe UI', 150, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$textFormat = [System.Drawing.StringFormat]::new()
$textFormat.Alignment = [System.Drawing.StringAlignment]::Center
$textFormat.LineAlignment = [System.Drawing.StringAlignment]::Center

try {
  $shape = New-RoundedRectanglePath 8 8 496 496 92
  try { $graphics.FillPath($background, $shape) } finally { $shape.Dispose() }

  foreach ($swatch in @(
    @{ X = 88; Y = 94; Height = 175; Brush = $aqua },
    @{ X = 220; Y = 68; Height = 201; Brush = $violet },
    @{ X = 352; Y = 110; Height = 159; Brush = $mint }
  )) {
    $shape = New-RoundedRectanglePath $swatch.X $swatch.Y 72 $swatch.Height 22
    try { $graphics.FillPath($swatch.Brush, $shape) } finally { $shape.Dispose() }
  }

  $graphics.DrawLine($line, 89, 300, 423, 300)
  $graphics.DrawString('26', $font, $white, [System.Drawing.RectangleF]::new(0, 296, 512, 184), $textFormat)

  $repository = Split-Path $PSScriptRoot -Parent
  $sourceIcon = Join-Path $repository 'src/ports/vscode/extra/logo.png'
  $packageIcon = Join-Path $repository 'packages/vscode/logo.png'
  $bitmap.Save($sourceIcon, [System.Drawing.Imaging.ImageFormat]::Png)
  Copy-Item -LiteralPath $sourceIcon -Destination $packageIcon -Force
} finally {
  $textFormat.Dispose()
  $font.Dispose()
  $line.Dispose()
  $white.Dispose()
  $mint.Dispose()
  $violet.Dispose()
  $aqua.Dispose()
  $background.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}
