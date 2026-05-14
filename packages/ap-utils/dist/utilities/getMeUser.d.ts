import 'server-only';
type MeUserArgs = {
    nullUserRedirect?: string;
    validUserRedirect?: string;
};
/** Fetches the currently-authenticated Payload user via the `/api/users/me`
 *  endpoint and (optionally) redirects depending on auth state. Caller may
 *  parameterize the User shape: `await getMeUser<MyUser>()`. */
export declare const getMeUser: <U = unknown>(args?: MeUserArgs) => Promise<{
    token: string;
    user: U;
}>;
export {};
//# sourceMappingURL=getMeUser.d.ts.map