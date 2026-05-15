import { sanitizeData } from '@pro-laico/atomic/hook/light';
// Would not recommend using this hook, as it is expensive. It is provided in case you want to more easily read recursive data from the database for a short while.
export const sanitizeAfterRead = async ({ doc }) => sanitizeData(doc);
//# sourceMappingURL=sanitize.js.map