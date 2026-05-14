import { createGetCachedPages } from './getPages';
import { createGetCachedImage } from './getImage';
import { createGetCachedFooter } from './getFooter';
import { createGetCachedHeader } from './getHeader';
import { createGetCachedSiteCSS } from './getSiteCSS';
import { createGetCachedSitemap } from './getSitemap';
import { createGetCachedPageByHref } from './getPage';
import { createGetCachedTracking } from './getTracking';
import { createGetCachedDesignSet } from './getDesignSet';
import { createGetCachedShortcutSet } from './getShortcutSet';
import { createGetCachedSiteMetadata } from './getSiteMetadata';
import { createGetCachedAtomicClasses } from './getAtomicClasses';
import { createGetCachedAtomicActions } from './getAtomicActions';
import { createGetCachedFormSubmissions } from './getFormSubmissions';
import { createGetCachedIconByName, createGetCachedIconOptions, createGetCachedIconSet } from './getIcon';
import { createGetCachedAllForms, createGetCachedAtomicForms, createGetCachedBackendForms } from './getForms';
export function createCacheGetterRegistry(bindings) {
    return {
        pages: createGetCachedPages(bindings),
        image: createGetCachedImage(bindings),
        header: createGetCachedHeader(bindings),
        footer: createGetCachedFooter(bindings),
        page: createGetCachedPageByHref(bindings),
        icon: createGetCachedIconByName(bindings),
        sitemap: createGetCachedSitemap(bindings),
        iconSet: createGetCachedIconSet(bindings),
        tracking: createGetCachedTracking(bindings),
        'site-css': createGetCachedSiteCSS(bindings),
        designSet: createGetCachedDesignSet(bindings),
        'all-forms': createGetCachedAllForms(bindings),
        shortcutSet: createGetCachedShortcutSet(bindings),
        'atomic-forms': createGetCachedAtomicForms(bindings),
        'icon-options': createGetCachedIconOptions(bindings),
        'site-metadata': createGetCachedSiteMetadata(bindings),
        'backend-forms': createGetCachedBackendForms(bindings),
        'atomic-classes': createGetCachedAtomicClasses(bindings),
        'atomic-actions': createGetCachedAtomicActions(bindings),
        'form-submissions': createGetCachedFormSubmissions(bindings),
    };
}
//# sourceMappingURL=createRegistry.js.map