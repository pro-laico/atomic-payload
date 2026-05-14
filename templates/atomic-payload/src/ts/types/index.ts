// Hand-written shared types come from @pro-laico/ap-types.
// Concrete Payload-generated names (Page, Config, Icon, User, ...) come from
// this project's `payload-types.ts`. The package wires the two together via the
// module augmentation in src/ts/payload-types.augment.d.ts, so consumer code
// keeps importing everything from `@/ts/types` exactly as before.
export * from '@pro-laico/ap-types'
export * from './payload-types'
