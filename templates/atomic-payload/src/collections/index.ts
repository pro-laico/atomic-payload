import { Users } from './users'
import { Pages } from './pages/collection'
import { Header } from './headers/collection'
import { Footer } from './footers/collection'
import { Images, Favicons } from '@pro-laico/atomic-payload-images'
import { Font } from '@pro-laico/atomic-payload-fonts'
import { MuxVideo } from '@pro-laico/atomic-payload-mux-video'
import { PostHogProperty } from '@pro-laico/atomic-payload-posthog'

const collections = [Font, Users, Pages, Footer, Header, Images, Favicons, MuxVideo, PostHogProperty]

export default collections
