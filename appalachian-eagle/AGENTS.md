# Project notes

`appalachian-eagle.html` is the complete game. Keep it standalone: no external assets, libraries, build process, or network calls. Durable outputs and validation evidence belong on `E:`.

After every `appalachian-eagle.html` edit, run `node tools/update-size.cjs`. It stamps the fixed-width `FILE_BYTES` constant used by the F3 HUD and verifies the final UTF-8 byte size without serializing the DOM.
