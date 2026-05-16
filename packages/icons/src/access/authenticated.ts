import type { Access } from 'payload'

export const authd: Access = ({ req }) => Boolean(req.user)
