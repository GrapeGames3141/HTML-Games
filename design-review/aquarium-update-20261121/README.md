# Aquarium graphics update review — 2026-11-21

The selected card is a real deterministic `aquarium.html?test&seed=1&q=med` frame: a posed leucistic axolotl in clear foreground sand, with feed/pet interaction, the updated ripple simulation stepped for 0.5 seconds, manual frame rendering, and the game interface hidden. Review the [raw card capture](aquarium-card.png), [production card WebP](aquarium.webp), and its [actual shelf overlay](shelf-aquarium-overlay.png).

[graphics-checks.jpg](graphics-checks.jpg) is the compact review sheet of six fixed front/axolotl/sand/plants/rocks/surface cameras at medium, high, and low quality. The corresponding full-size raw frames and machine-readable renderer reports remain in the isolated E: task work area.

The missing-float-extension check was executed with a test-only `EXT_color_buffer_float` override. It verified `HDR=false`, `SIM=false`, and no SSAO allocations, with no page or console errors. `?nofloat` separately verified its intended live-render state: ripple simulation off with procedural caustics, while available float-target effects stay enabled.
