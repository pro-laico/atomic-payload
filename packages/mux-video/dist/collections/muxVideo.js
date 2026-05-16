const authd = ({ req }) => Boolean(req.user);
const anyone = () => true;
export const MuxVideo = {
    slug: 'mux-video',
    admin: { group: 'Assets', enableListViewSelectAPI: true },
    access: { create: authd, delete: authd, read: anyone, update: authd },
    fields: [],
};
//# sourceMappingURL=muxVideo.js.map