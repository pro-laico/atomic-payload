// DO NOT ADD ANYTHING OTHER THAN CHILD BLOCKS IN THIS FILE.
// INCLUDING ANY FUNCTIONS OR UTILITIES.
import { Icon } from '@pro-laico/icons/blocks/iconChild'
import { SVGBlock } from '@pro-laico/icons/blocks/svgChild'
import { Image } from '@pro-laico/images/blocks/imageChild'
import { Video } from '@pro-laico/mux-video/blocks/videoChild'
import { RichText } from '@pro-laico/richtext'
import AtomicBlock from './atomic/block'
import { SimpleText } from './simpleText/block'

const ChildBlocks = [AtomicBlock, SimpleText, RichText, Image, Video, Icon, SVGBlock]

export default ChildBlocks
