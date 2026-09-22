# Workflow film asset

The six-stage workflow section is implemented by `js/composition.js` with a scroll-linked `<video>` and an illustrated fallback. To activate the **supplied original MP4**, upload it to this directory under the exact filename:

`concept-to-implementation.mp4`

The original user-supplied file is `Create_a_premium_dark_mode_mot.mp4` (10 seconds, 1280×720). Rename it to the filename above before uploading. No re-encoding is necessary. The video stays paused, muted and playsInline; as the page scrolls it seeks across the duration and highlights Concept, Research, Sketch, Wireframes, Prototype and Implementation. The fallback is shown only when the video cannot load.

The original file could not be transferred to this repository via the available text-only GitHub connector; the asset has **not** yet been committed. Do not describe the video integration as complete until GitHub contains the MP4 and it has been verified in-browser.

The portrait GLB is loaded directly from the source `Rodrigoccazuza/3DModel_portfolio` repository's `hero-v2` branch. That cross-repository dependency should be kept accessible or the GLB should eventually be copied into `assets/models` for self-contained deployment.
