# ============================================================
# Tiny dependency-free static server for local preview.
# No Node, no Python required. Serves this folder over HTTP so
# the no-build React app (index.html) can load its ES modules.
#
#   Usage:  powershell -ExecutionPolicy Bypass -File .\serve.ps1
#   Then open the printed http://localhost:<port>/ address.
#   Press Ctrl+C to stop.
# ============================================================

param(
  [int]$Port = 5178,
  [string]$Root = $PSScriptRoot
)

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
  $listener.Start()
} catch {
  Write-Host "Could not start on $prefix. Try another port: .\serve.ps1 -Port 5200"
  throw
}

Write-Host ""
Write-Host "  ActivatUs dashboard is serving at:  $prefix" -ForegroundColor Green
Write-Host "  Serving folder: $Root"
Write-Host "  Press Ctrl+C to stop."
Write-Host ""

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".jsx"  = "text/javascript; charset=utf-8"
  ".mjs"  = "text/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
  ".png"  = "image/png"
  ".woff2"= "font/woff2"
}

while ($listener.IsListening) {
  try {
    $context = $listener.GetContext()
  } catch {
    break
  }
  $req = $context.Request
  $res = $context.Response

  $path = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
  if ($path -eq "/") { $path = "/index.html" }
  $full = Join-Path $Root ($path.TrimStart("/"))

  if (Test-Path $full -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($full).ToLower()
    $type = $mime[$ext]
    if (-not $type) { $type = "application/octet-stream" }
    $bytes = [System.IO.File]::ReadAllBytes($full)
    $res.ContentType = $type
    $res.Headers.Add("Cache-Control", "no-cache")
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $res.StatusCode = 404
    $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
    $res.OutputStream.Write($msg, 0, $msg.Length)
  }
  $res.OutputStream.Close()
}

$listener.Stop()
