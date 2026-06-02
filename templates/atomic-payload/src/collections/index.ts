import { Users } from './users'

// All Atomic Payload collections come from plugins (see `@/plugins`):
// - Pages, Header, Footer        → sitePlugin
// - PostHogProperty              → trackingPlugin
// - Images, Favicons             → imagesPlugin
// - MuxVideo                     → muxVideoPlugin
// - Icon, IconSet                → iconsPlugin
// - DesignSet, ShortcutSet       → stylesPlugin
// - Font                         → fontsPlugin
const collections = [Users]

export default collections
