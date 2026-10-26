#!/usr/bin/env bash
# ==============================================================================
# Production Backup Automation Script (POSIX / Linux / macOS)
# Target: RepoAI Production Backup & Snapshotting
# ==============================================================================
set -euo pipefail

BACKUP_DIR="${1:-./backups}"
RETENTION_DAYS="${2:-14}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="repoai_backup_${TIMESTAMP}.tar.gz"

mkdir -p "${BACKUP_DIR}"

echo "====================================================="
echo "Starting RepoAI Production Backup at $(date)"
echo "====================================================="

# Create tarball excluding node_modules and .git
tar -czf "${BACKUP_DIR}/${ARCHIVE_NAME}" \
  --exclude="node_modules" \
  --exclude="dist" \
  --exclude=".git" \
  src public package.json index.html vite.config.ts

# Generate SHA-256 Checksum
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "${BACKUP_DIR}/${ARCHIVE_NAME}" > "${BACKUP_DIR}/${ARCHIVE_NAME}.sha256"
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 "${BACKUP_DIR}/${ARCHIVE_NAME}" > "${BACKUP_DIR}/${ARCHIVE_NAME}.sha256"
fi

echo "[SUCCESS] Archive created: ${BACKUP_DIR}/${ARCHIVE_NAME}"

# Prune backups older than retention window
find "${BACKUP_DIR}" -name "repoai_backup_*.tar.gz*" -mtime "+${RETENTION_DAYS}" -exec rm -f {} +
echo "[CLEANUP] Pruned backups older than ${RETENTION_DAYS} days."
echo "[COMPLETED] Backup routine complete."
