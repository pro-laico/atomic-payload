import type { Access } from 'payload'

export const anyone: Access = () => true
export const authd: Access = ({ req }) => Boolean(req.user)
