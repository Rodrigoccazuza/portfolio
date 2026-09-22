# Workflow video — installed

The original video from `main/work/video/Create_a_premium_dark_mode_mot.mp4` has been copied without re-encoding to `final_version_oficial/assets/video/concept-to-implementation.mp4`. Both paths contain the same Git blob `9048f89299ebb79256e608be1ff7f0ca3d170aab` (2,694,363 bytes).

The active Home page controller is **`js/composition-v2.js`**. It owns video seeking, active-step labels and highlighted steps in one scroll handler using the six source-film time ranges. The former `js/composition-workflow-sync.js` and `js/composition.js` are legacy files and are no longer loaded by `js/reveal.js`.

No extra upload is required. Browser testing of scroll seeking, response on reverse/fast scroll, and responsive playback is still required for final QA. The 3D GLB is served from the source repository's `hero-v2` branch and depends on that file remaining available.
