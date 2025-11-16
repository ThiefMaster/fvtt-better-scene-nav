Hooks.once('init', () => {
  // Monkeypatch prepareContext because there's no pre-render hook (yet?)...
  const SceneNavigation = foundry.applications.ui.SceneNavigation;
  const orig = SceneNavigation.prototype._prepareContext;
  SceneNavigation.prototype._prepareContext = async function (_options) {
    const rv = await orig.call(this, _options);
    const scenes = rv.scenes;
    // When we have some inactive scenes in a dropdown add active ones as well so they show up
    // at the same position where they would be while inactive.
    if (scenes.inactive.length) {
      scenes.inactive = [...scenes.inactive, ...scenes.active];
      scenes.inactive.sort((a, b) => a.navOrder - b.navOrder);
    }
    return rv;
  };
});
