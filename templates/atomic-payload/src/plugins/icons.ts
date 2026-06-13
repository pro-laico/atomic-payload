import { iconsPlugin } from '@pro-laico/icons'
import { TestPathField } from '@pro-laico/core'
import { atomicHook } from '@pro-laico/atomic/hook'

// `livePreviewUrl` defaults to `@pro-laico/core`'s `generateLivePreviewPath`, so
// it no longer needs to be passed here.
export const iconsPluginConfig = iconsPlugin({
  iconSetOptions: {
    extraSettingsFields: [TestPathField],
    // Run the shared atomicHook on the iconSet: it enforces single-active (only
    // one set active at a time) and revalidates the active set's cache on save.
    // The site collections (pages/header/footer) and the styles collections bake
    // this hook too, so the iconSet wires it the same way here.
    hooks: { beforeChange: [atomicHook] },
    // Shows the "Requested icons" panel on the IconSet edit view — a live diff
    // between the icon names this app requests (via the Icon component,
    // collected into a manifest by `pnpm generate:icons`) and the icons defined
    // in the set. The manifest path defaults to `icon-usage-manifest.json` at
    // the project root, which is where `generate:icons` writes it.
    usagePanel: true,
  },
  // Registers the `iconRequest` collection and records names that fail to
  // resolve at runtime (throttled, fire-and-forget via Next's `after()`), so the
  // usage panel can show real production misses — including dynamic `name={…}`
  // ones the static scan can't see. Disable at runtime with ICON_USAGE_TRACKING=false.
  trackRequests: true,
})
