// DO NOT ADD ANYTHING OTHER THAN CHILD BLOCKS IN THIS FILE.
// INCLUDING ANY FUNCTIONS OR UTILITIES.
import { Icon } from '@pro-laico/ap-icons/blocks/iconChild'
import { SVGBlock } from '@pro-laico/ap-icons/blocks/svgChild'
import { Image } from '@pro-laico/ap-images/blocks/imageChild'
import { Video } from '@pro-laico/ap-mux-video/blocks/videoChild'
import { RichText } from '@pro-laico/ap-richtext'
import AtomicBlock from './atomic/block'
import { SimpleText } from './simpleText/block'

const ChildBlocks = [AtomicBlock, SimpleText, RichText, Image, Video, Icon, SVGBlock]

export default ChildBlocks
