# September 2026 asset import

The supplied collection contains 429 content files. The import excludes macOS metadata (`._*` and `.DS_Store`), preserves every original in GitHub release archives, and maps each source path to its portfolio section in [ASSET_INDEX.md](../ASSET_INDEX.md).

## Organization

- Paid creative → existing Meta ad project pages, paid-social folder, video rail, and matching campaigns.
- Organic creative → social project pages, social folder, and social video rail.
- Email → existing email project pages, email deck, and matching campaign collections.
- Brand PDFs, presentation files, font packages, and supporting files → the corresponding brand-system project.
- Certificates → Experience.
- Long-form film → YouTube project, linked from the homepage's existing YouTube section.
- Raw footage → project libraries, labeled by its original source folder.

The publishing branch is `new_portfolio`; GitHub Pages serves that branch. The default `main` branch receives the asset files, inventory, and compatible project-page additions separately, preserving each branch's existing homepage.

## Media rules

- Original filenames and directory structure are preserved inside independent ZIP archives. The original 3.1 GB film uses four numbered binary parts, with restoration instructions in the release.
- SHA-256 identifies exact duplicates. Shared web copies retain one inventory row per original path.
- Image previews use WebP, at most 640 × 960. Full image views are at most 1600 × 8000. GIF animation is retained; HEIC photos have browser-compatible WebP copies.
- Videos use H.264/AAC MP4, a maximum 720-pixel frame dimension, 30 fps, and fast-start metadata. The entire duration is retained. The original source remains available for full-resolution playback and editing.
- Homepage folders use thumbnails; viewers use the full web copy. Imported video rails use posters and start downloading video only when opened. Project-page players use native controls and `preload="none"`.
- Font/source packages are downloads, not runtime dependencies. No new application framework or build step is required to serve the site.

## Reproduction

Install Pillow, pillow-heif, and imageio-ffmpeg in a local Python environment. Run `scripts/import-portfolio-assets.py SOURCE_DIRECTORY`, then place the original archive index at `assets/import-2026-09/archive-index.json`.

Run `python3 scripts/fit-import-media-budget.py` if needed to keep the published files below the conservative 950 MB target. This adjusts only new web video derivatives; originals are unchanged.

Run `python3 scripts/render-imported-assets.py` to update the existing project libraries and `python3 scripts/build-import-data.py` to update the publishing branch's homepage and campaigns. The latter requires `scripts/import-data-adapter.js`.

Run `python3 scripts/verify-imported-assets.py --archives ORIGINAL_ARCHIVE_DIRECTORY` for coverage, path, size-budget, and byte-for-byte original-file checks. The archives are release assets and are deliberately outside the published website.
