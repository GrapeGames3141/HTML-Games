# GrapeGames Arcade proposal

This is a review-only prototype. It does not change the production arcade source or deployment.

It proposes a tighter screenshot-led hero, a generated montage that combines the real Broadside, High Country, and Prism captures, and nine large game cards. Sitter is deliberately omitted from this proposal at the user’s direction and is now a local development prototype under `experiments/`.

`hero-montage-v1.png` is the selected ImageGen master. It was generated with the built-in ImageGen compositing workflow from `work/arcade-redesign/captures/broadside-current.png`, `eagle-current.png`, and `prism-current.png`; `hero-montage-v1.webp` is its 1600-pixel web derivative. Card WebP files are modest 800×560 crops of real headless captures. HTML supplies all titles and labels.

ImageGen prompt: “Compositing edit for a premium indie browser arcade hero: use the three real Broadside, High Country, and Prism screenshots; keep objects and rendering recognizable; central galleon, upper-right eagle/mountains, lower-right Prism scene; dark olive-charcoal left negative space; no text, logos, HUD, menus, new characters, ships, or invented assets.”

The complete selected asset set is 2,416,996 bytes. Dust Devil and Merlin cards use real E:-captured headless gameplay frames. Ashgrove now uses the approved real headless capture `ashgrove-review/ashgrove-vampire-chapel.png`: the Vampire Lord in front of the chapel, cropped to the real frame’s 920×644 region and resized to its 800×560 card without repainting. `ashgrove-review/ashgrove-card-before.webp` preserves the prior card reference. Castle Defense uses a crop of its real frame that removes canvas HUD edges. The prototype’s game links point to canonical GitHub Pages URLs.

The `screenshots/current-*` images are the live ten-card homepage baseline captured from GitHub Pages. The `screenshots/proposal-*` images show the prepared nine-card direction: the current catalog excluding the Humanoid Model Experiment. This count difference is intentional for review only.
