import type { Access } from 'payload'

export const authd: Access = ({ req: { user } }) => Boolean(user)
