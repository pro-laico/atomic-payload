import { Users } from './users'
import { Pages } from './pages/collection'
import { Header } from './headers/collection'
import { Footer } from './footers/collection'
import { IconSet } from './iconSets/collection'
import DesignSet from './designSets/collection'
import ShortcutSet from './shortcutSets/collection'

import { Icon } from '@pro-laico/atomic-payload-icons'
import { Images, Favicons } from '@pro-laico/atomic-payload-images'
import { Font } from '@pro-laico/atomic-payload-fonts'
import { MuxVideo } from '@pro-laico/atomic-payload-mux-video'
import { PostHogProperty } from '@pro-laico/atomic-payload-posthog'

const collections = [Font, Icon, Users, Pages, Footer, Header, Images, Favicons, IconSet, MuxVideo, DesignSet, ShortcutSet, PostHogProperty]

export default collections
