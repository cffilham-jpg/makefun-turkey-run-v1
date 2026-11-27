# Verification record

Verified in this build session on 2026-11-27 with Node 24.22.1 and headless Chromium 1255. The game itself has no dependencies, build step or external resources.

- `node tests/browser.mjs`: starts with Enter, checks jump/hold flutter, duck, sprint stamina, pause, restart, an unattended caught run and a full ordinary-key escape. Final full run: 1,500 m, 19 jumps, 10 ducks, 2 hits, 66 corn, 27 clean obstacles, one feather remaining. Zero page/console errors, zero external requests and zero requests after local modules load.
- `node tests/controls.mjs`: browser network switched offline after module load; mouse-only start, duck, sprint, button jump, canvas jump, pause/resume and actual CDP touch hold/release all pass. Zero errors or runtime requests.
- Screenshots captured directly by Playwright, unedited JPEG, 1280×720. All three were opened and visually inspected after the final capture: `1-play.jpg` (116,977 bytes) shows the airborne turkey over a glowing oven, raised farmer net, corn, knife and full 640 m HUD; `2-start.jpg` (114,353 bytes) shows the title, hero, start button and controls; `3-end.jpg` (106,962 bytes) shows the turkey above the Freedom Gate, ESCAPED result, 6,775 score and restart.
- Final `MAKEFUN_OUTPUT_DIR=out node main.ts` and `env -u MAKEFUN_OUTPUT_DIR node main.ts`, with the first output moved aside between runs: `diff -r` exits 0.
- Final source copied under `/tmp/gobble-final-nobody/source`, source files mode 444, directories 755; separate writable output directories made with `chmod a+rwX` and no chown. Both runs as UID/GID 65534 via `setpriv`, env set and unset, exit 0. Their output trees match each other and the normal output byte for byte. UID 65534 cannot write source/main.ts.
- `node tests/package.mjs`: PASS. Game has 8 files/directories and 36,761 bytes; index is 2,494 bytes; dossier is 489,405 bytes. Screenshots pass JPEG completeness, dimensions and size caps. Module syntax, internal static references, owner claim, dossier reconstruction and byte identity of the official vendor library pass.
- GitHub repository created 2026-11-27T02:36:41Z, after opening. Public, homepage is the bounty URL, topic `makefun`.

The browser checks accept `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH` to select installed tooling; defaults point to this build machine's installations. Start `node serve.ts` before running them. `node tests/package.mjs` additionally compares the vendor file to the local competition kit.

Codex session: `01a21adb-4da5-75e1-8da8-8700e886a4e6`.

Built and verified only. No submission, bundling, entry signing, wallet action or reward claim was performed. The coordinator handles bundling and submission.
