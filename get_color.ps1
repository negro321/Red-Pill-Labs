
Add-Type -AssemblyName System.Drawing
try {
    $img = [System.Drawing.Bitmap]::FromFile("$PWD\LABS.png")
    $width = $img.Width
    $height = $img.Height
    
    $maxGreenness = -1000
    $bestR = 0
    $bestG = 0
    $bestB = 0

    # Scan a grid of pixels
    for($x=0; $x -lt $width; $x+=2) {
        for($y=0; $y -lt $height; $y+=2) {
            $pixel = $img.GetPixel($x, $y)
            if ($pixel.A -gt 240) { # Strict opaque
                 # Greenness: G - Average(R, B)
                 $greenness = $pixel.G - (($pixel.R + $pixel.B) / 2)
                 
                 # Must be actually green
                 if ($pixel.G -gt $pixel.R -and $pixel.G -gt $pixel.B) {
                     if ($greenness -gt $maxGreenness) {
                        $maxGreenness = $greenness
                        $bestR = $pixel.R
                        $bestG = $pixel.G
                        $bestB = $pixel.B
                     }
                 }
            }
        }
    }

    if ($maxGreenness -gt -1000) {
        $hex = "#{0:X2}{1:X2}{2:X2}" -f $bestR, $bestG, $bestB
        Write-Host "PEAK_GREEN_COLOR: $hex"
        Write-Host "RGB: $bestR $bestG $bestB"
    } else {
        Write-Host "PEAK_GREEN_COLOR: NOT_FOUND"
    }
    $img.Dispose()
} catch {
    Write-Host "ERROR: $_"
}
