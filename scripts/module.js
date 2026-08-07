Hooks.once('init', () => {
  // Monkeypatch prepareContext because there's no pre-render hook (yet?)...
  const SceneNavigation = foundry.applications.ui.SceneNavigation;
  const orig = SceneNavigation.prototype._prepareContext;
  SceneNavigation.prototype._prepareContext = async function (_options) {
    const rv = await orig.call(this, _options);
    const scenes = rv.scenes;
    // When we have some inactive scenes in a dropdown add active ones as well so they show up
    // at the same position where they would be while inactive.
    // In Foundry 14, the currently viewed scene is also not included in active/inactive so that
    // needs to be handled separately as well
    if (scenes.inactive.length || scenes.viewed) {
      scenes.inactive = [
        ...scenes.inactive,
        ...scenes.active,
        // newly added in foundry 14, shuldn't cause any problems in 13 since it's just undefined
        ...(scenes.viewed ? [scenes.viewed] : []),
      ];
      const sceneOrder = game.scenes.map(scn => scn.id);
      // Sort by original (collection/server) order, otherwise our newly added scenes may remain
      // at the end of the list if `navOrder` isn't properly populated
      scenes.inactive.sort((a, b) => sceneOrder.indexOf(a.id) - sceneOrder.indexOf(b.id));
      // Sort by nav order (where applicable, it may be 0 for multiple scenes)
      scenes.inactive.sort((a, b) => a.navOrder - b.navOrder);
    }
    return rv;
  };
});
