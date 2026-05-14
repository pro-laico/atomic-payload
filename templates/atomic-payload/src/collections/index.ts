import { Users } from './users'
import { Pages } from './pages/collection'
import { Header } from './headers/collection'
import { Footer } from './footers/collection'
import { Images, Favicons } from '@pro-laico/ap-images'
import { MuxVideo } from '@pro-laico/ap-mux-video'

// PostHogProperty is registered by `trackingPlugin` (see `@/plugins`).
const collections = [Users, Pages, Footer, Header, Images, Favicons, MuxVideo]

export default collections
