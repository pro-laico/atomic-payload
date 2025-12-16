// DO NOT ADD ANYTHING OTHER THAN CHILD BLOCKS IN THIS FILE.
// INCLUDING ANY FUNCTIONS OR UTILITIES.
import { Icon } from './icon/block'
import { Image } from './image/block'
import { Video } from './video/block'
import { SVGBlock } from './svg/block'
import AtomicBlock from './atomic/block'
import { RichText } from './richText/block'
import { SimpleText } from './simpleText/block'

const ChildBlocks = [AtomicBlock, SimpleText, RichText, Image, Video, Icon, SVGBlock]

export default ChildBlocks
