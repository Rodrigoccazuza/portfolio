# Workflow video — installed

The original video uploaded to `main/work/video/Create_a_premium_dark_mode_mot.mp4` was copied without re-encoding to `final_version_oficial/assets/video/concept-to-implementation.mp4`. Both entries use Git blob SHA `9048f89299ebb79256e608be1ff7f0ca3d170aab` (2,694,363 bytes).

The Home page's six-stage process uses `js/composition.js` to load `assets/video/concept-to-implementation.mp4` and scrub playback according to scroll; `js/composition-workflow-sync.js` updates labels to the timing of the supplied ten-second film. No additional upload is required. Browser testing for smooth seeks, stage timing and responsive rendering remains advisable before merge.

The portrait GLB currently loads from the source repository's `hero-v2` branch and depends on that asset staying accessible.
