# ==============================================================================
# Production Backup Automation Script (Windows PowerShell)
# Target: RepoAI Production Backup & Snapshotting
# ==============================================================================

param (
    [string]$BackupDir = "..\backups",
    [int]$RetentionDays = 14
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $currentDir
$destinationDir = Join-Path $projectRoot "backups"

if (!(Test-Path $destinationDir)) {
    New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
    Write-Host "[INFO] Created backup directory at: $destinationDir" -ForegroundColor Green
}

$archiveName = "repoai_backup_$timestamp.zip"
$archivePath = Join-Path $destinationDir $archiveName

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Starting RepoAI Production Backup at $(Get-Date)" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Files and folders to include
$includePaths = @(
    (Join-Path $projectRoot "src"),
    (Join-Path $projectRoot "public"),
    (Join-Path $projectRoot "package.json"),
    (Join-Path $projectRoot "package-lock.json"),
    (Join-Path $projectRoot "index.html"),
    (Join-Path $projectRoot "vite.config.ts"),
    (Join-Path $projectRoot "tsconfig.json"),
    (Join-Path $projectRoot "tsconfig.app.json"),
    (Join-Path $projectRoot "tailwind.config.js")
)

# Create temporary staging directory
$tempStaging = Join-Path $destinationDir "staging_$timestamp"
New-Item -ItemType Directory -Path $tempStaging -Force | Out-Null

try {
    foreach ($item in $includePaths) {
        if (Test-Path $item) {
            $name = Split-Path -Leaf $item
            Copy-Item -Path $item -Destination (Join-Path $tempStaging $name) -Recurse -Force
        }
    }

    # Compress staging to zip
    Compress-Archive -Path "$tempStaging\*" -DestinationPath $archivePath -CompressionLevel Optimal -Force
    Write-Host "[SUCCESS] Archive generated: $archivePath" -ForegroundColor Green

    # Generate SHA-256 checksum for audit & recovery integrity
    $hash = (Get-FileHash -Path $archivePath -Algorithm SHA256).Hash
    $hashFile = "$archivePath.sha256"
    Set-Content -Path $hashFile -Value "$hash *$archiveName"
    Write-Host "[INTEGRITY] SHA-256 Checksum: $hash" -ForegroundColor Yellow

    # Prune old backups past retention threshold
    $cutoff = (Get-Date).AddDays(-$RetentionDays)
    Get-ChildItem -Path $destinationDir -Filter "repoai_backup_*.zip*" | Where-Object { $_.LastWriteTime -lt $cutoff } | ForEach-Object {
        Remove-Item $_.FullName -Force
        Write-Host "[CLEANUP] Pruned expired backup: $($_.Name)" -ForegroundColor DarkGray
    }

    Write-Host "[COMPLETED] Backup run succeeded. Ready for off-site sync." -ForegroundColor Green
}
finally {
    if (Test-Path $tempStaging) {
        Remove-Item -Path $tempStaging -Recurse -Force
    }
}
