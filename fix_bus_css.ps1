$path = 'C:\Users\Admin\pwa-test\index.html'
$text = Get-Content -Raw $path
$pattern = "background-image:\s*url\(''data:image/jpeg;base64,[^'']*''\);"
$replacement = "background-image: url('background.png');"
$new = [regex]::Replace($text, $pattern, $replacement)
if ($new -eq $text) {
    Write-Host 'no change'
    exit 1
}
Set-Content -Path $path -Value $new -Encoding utf8
Write-Host 'updated'
