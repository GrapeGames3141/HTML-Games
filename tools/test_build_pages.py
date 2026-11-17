"""Regression tests for discovery, packaging, and generated lobby content."""
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('build_pages', ROOT / 'tools/build-pages.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)

class PagesTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        for name in ('index.html', 'arcade.css', 'arcade.js', '.nojekyll'):
            shutil.copyfile(ROOT / name, self.root / name)
        shutil.copytree(ROOT / 'assets', self.root / 'assets')
        for name in builder.CURATED:
            folder = self.root / name
            folder.mkdir()
            (folder / (name + '.html')).write_text('<!doctype html><title>Game</title>', encoding='utf-8')
    def tearDown(self): self.temp.cleanup()
    def test_discovery_metadata_assets_and_rebuild(self):
        game = self.root / 'future fields'
        (game / 'nested').mkdir(parents=True)
        (game / 'launch.html').write_text('<title>Fallback title</title><script src="nested/game.js"></script><img src="nested/art.png">', encoding='utf-8')
        (game / 'nested/game.js').write_text('window.gameReady = true;', encoding='utf-8')
        (game / 'nested/art.png').write_bytes(b'PNG fixture')
        (game / 'game.json').write_text(json.dumps({'entry':'launch.html', 'title':'Clouds <&> "Sky"', 'description':'Build & play', 'category':'Puzzle', 'controls':'Click <play>', 'requirements':'Modern browser'}), encoding='utf-8')
        (game / 'snapshots').mkdir()
        (game / 'snapshots/old.js').write_text('old')
        excluded = self.root / 'tools'
        excluded.mkdir()
        (excluded / 'tools.html').write_text('<title>Not a game</title>')
        experiment = self.root / 'experiments'
        experiment.mkdir()
        (experiment / 'experiments.html').write_text('<title>Not an arcade game</title>')
        out = builder.build(self.root)
        lobby = (out / 'index.html').read_text(encoding='utf-8')
        self.assertIn('Clouds &lt;&amp;&gt; &quot;Sky&quot;', lobby)
        self.assertIn('future%20fields/launch.html', lobby)
        self.assertIn('data-filter="puzzle"', lobby)
        self.assertIn('SHOWING ALL 10 GAMES', lobby)
        self.assertIn('10 PLAYABLE WORLDS', lobby)
        self.assertIn('content="Explore 10 free browser games from GrapeGames."', lobby)
        self.assertNotIn('Not an arcade game', lobby)
        self.assertTrue((out / 'future fields/nested/game.js').exists())
        self.assertTrue((out / 'future fields/nested/art.png').exists())
        self.assertFalse((out / 'future fields/snapshots/old.js').exists())
        self.assertFalse((out / 'tools/tools.html').exists())
        self.assertFalse((out / 'experiments').exists())
        self.assertTrue((out / 'assets/arcade/quick-hide.js').exists())
        for page in [out / 'index.html', out / 'future fields/launch.html'] + [out / name / (name + '.html') for name in builder.CURATED]:
            html = page.read_text(encoding='utf-8')
            self.assertEqual(html.count('id="arcade-quick-hide-injected"'), 1)
            self.assertLess(html.index('id="arcade-quick-hide-injected"'), html.lower().index('<title'))
            self.assertLess(html.lower().index('<meta charset="utf-8">'), html.index('id="arcade-quick-hide-injected"'))
        future_html = (out / 'future fields/launch.html').read_text(encoding='utf-8')
        self.assertLess(future_html.index('id="arcade-quick-hide-injected"'), future_html.index('src="nested/game.js"'))
        self.assertIn('window.__arcadeQuickHideGame="future fields"', (out / 'future fields/launch.html').read_text(encoding='utf-8'))
        self.assertTrue((out / 'splat/index.html').exists())
        shutil.rmtree(game)
        builder.build(self.root)
        self.assertFalse((out / 'future fields').exists())
        self.assertIn('SHOWING ALL 09 GAMES', (out / 'index.html').read_text(encoding='utf-8'))
    def test_gold_entry_and_new_curated_card(self):
        game = self.root / 'gold-rush'
        game.mkdir()
        (game / 'gold-rush.html').write_text('<title>Gold Rush</title>', encoding='utf-8')
        index = self.root / 'index.html'
        source = index.read_text(encoding='utf-8')
        custom = '<article class="game-card" data-id="custom-id" data-category="action" data-search="gold"><a class="play-link" href="gold-rush/gold-rush.html">Custom Gold</a></article>'
        source = source.replace('</div><div id="empty-state"', custom + '</div><div id="empty-state"')
        index.write_text(source, encoding='utf-8')
        out = builder.build(self.root)
        self.assertTrue((out / 'gold-rush/gold-rush.html').exists())
        lobby = (out / 'index.html').read_text(encoding='utf-8')
        self.assertIn('Custom Gold', lobby)
        self.assertIn('data-id="custom-id"', lobby)
        self.assertEqual(lobby.count('href="gold-rush/gold-rush.html"'), 1)

    def test_title_fallback_and_invalid_entry(self):
        game = self.root / 'new-game'
        game.mkdir()
        (game / 'new-game.html').write_text('<title>A New Game</title>', encoding='utf-8')
        out = builder.build(self.root)
        lobby = (out / 'index.html').read_text(encoding='utf-8')
        self.assertIn('<h3>A New Game</h3>', lobby)
        self.assertIn('data-filter="arcade"', lobby)
        (game / 'game.json').write_text('{"entry":"../outside.html"}', encoding='utf-8')
        with self.assertRaises(ValueError): builder.build(self.root)
        (game / 'game.json').write_text(json.dumps({'entry': r'..\outside.html'}), encoding='utf-8')
        with self.assertRaises(ValueError): builder.build(self.root)

if __name__ == '__main__': unittest.main()
