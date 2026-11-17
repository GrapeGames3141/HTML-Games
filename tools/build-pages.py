"""Package only the arcade and playable game entry points for GitHub Pages."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "work/pages"
GAMES = ("prism-swarm", "appalachian-eagle", "splat", "ashgrove", "sitter", "castle-defense", "broadside", "splatcraft")
CANONICAL = {game: game + "/" + game + ".html" for game in GAMES}
LEGACY_GAMES = ("prism-swarm", "appalachian-eagle", "splat", "ashgrove", "sitter", "castle-defense")
LEGACY_ALIASES = [game + "/index.html" for game in LEGACY_GAMES]
FILES = ["index.html", "arcade.css", "arcade.js", ".nojekyll"] + list(CANONICAL.values())

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
    def handle_starttag(self, tag, attrs):
        self.urls += [value for key, value in attrs if key in ("href", "src") and value]

def build():
    # This path is generated and ignored, never a source or deployment destination.
    assert OUT.resolve() == (ROOT / "work/pages").resolve()
    OUT.mkdir(parents=True, exist_ok=True)
    for rel in FILES:
        source = ROOT / rel
        if not source.is_file():
            raise SystemExit("Missing required playable file: " + rel)
        dest = OUT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, dest)
    for game in LEGACY_GAMES:
        alias = OUT / game / "index.html"
        alias.parent.mkdir(parents=True, exist_ok=True)
        canonical_name = Path(CANONICAL[game]).name
        alias.write_text(
            "<!doctype html><meta charset=\"utf-8\"><meta http-equiv=\"refresh\" content=\"0; url="
            + canonical_name
            + "\"><title>Moved</title><p>This game moved to <a href=\""
            + canonical_name
            + "\">"
            + canonical_name
            + "</a>.</p>\n",
            encoding="utf-8",
        )
    assets = ROOT / "assets/arcade"
    if assets.exists():
        shutil.copytree(assets, OUT / "assets/arcade", dirs_exist_ok=True)
    allowed = set(FILES) | set(LEGACY_ALIASES)
    if assets.exists():
        allowed.update(p.relative_to(ROOT).as_posix() for p in assets.rglob("*") if p.is_file())
    unexpected = [p.relative_to(OUT).as_posix() for p in OUT.rglob("*") if p.is_file() and p.relative_to(OUT).as_posix() not in allowed]
    if unexpected:
        raise SystemExit("Unexpected files in generated site; use a fresh output directory: " + ", ".join(unexpected))
    for rel in ["index.html"] + list(CANONICAL.values()) + LEGACY_ALIASES:
        page = OUT / rel
        links = Links()
        links.feed(page.read_text(encoding="utf-8"))
        for url in links.urls:
            parts = urlsplit(url)
            if parts.scheme or parts.netloc or not parts.path:
                continue
            if parts.path.startswith("/"):
                raise SystemExit("Project-site link must be relative: " + url)
            target = (page.parent / unquote(parts.path)).resolve()
            if not target.is_relative_to(OUT.resolve()) or not target.exists():
                raise SystemExit("Broken local link in " + rel + ": " + url)
    print("Packaged eight games and arcade with six legacy aliases; all local HTML links resolve.")

if __name__ == "__main__":
    build()
