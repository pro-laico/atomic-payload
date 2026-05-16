import { deepMerge } from '@pro-laico/ap-apf';
import manualLogger from './utilities/manualLogger';
import { defaultAtomicClasses } from '@pro-laico/design-sets/designSet/defaults';
import { createGenerator, presetWind4, presetAttributify, presetTypography } from 'unocss';
export function createCssProcessor(getCached) {
    return async ({ slug, context, draft, req }) => {
        const pagesAtomicClasses = (await getCached('atomic-classes', draft));
        const header = (slug !== 'header' ? await getCached('header', draft) : context?.header);
        const footer = (slug !== 'footer' ? await getCached('footer', draft) : context?.footer);
        const ds = (slug !== 'designSet' ? await getCached('designSet', draft) : context?.designSet);
        const shortcutSet = (slug !== 'shortcutSet' ? await getCached('shortcutSet', draft) : context?.shortcutSet);
        const shortcuts = [...(shortcutSet?.shortcuts || []), ...(shortcutSet?.defaultShortcuts || [])].reduce((acc, shortcut) => {
            if ('ClassName' in shortcut && shortcut.ClassName)
                acc[String(shortcut.name)] = String(shortcut.ClassName);
            return acc;
        }, {});
        const classNames = new Set([
            ...(pagesAtomicClasses || []),
            ...(defaultAtomicClasses || []),
            ...(header?.storedAtomicClasses || []),
            ...(footer?.storedAtomicClasses || []),
            ...(context?.storedAtomicClasses || []),
            ...[...(ds?.htmlClassName?.split(' ') || [])],
            ...[...(ds?.bodyClassName?.split(' ') || [])],
            ...[...(ds?.wrapperClassName?.split(' ') || [])],
        ]);
        const defaultClasses = { spacing: { DEFAULT: ds?.tokenStorage?.variables?.spacing || '0.25rem' } };
        const uno = await createGenerator({
            shortcuts,
            preflights: [{ getCSS: () => `${ds?.preflightStorage || ''}` }],
            presets: [
                presetWind4(),
                presetAttributify(),
                presetTypography({
                    colorScheme: ds?.proseColorStorage,
                    cssExtend: ds?.proseDefaultStorage,
                    sizeScheme: {
                        sm: ds?.prosesmStorage || {},
                        base: ds?.proseBaseStorage || {},
                        lg: ds?.proselgStorage || {},
                    },
                }),
            ],
            extendTheme: (theme) => deepMerge(theme, deepMerge(ds?.tokenStorage, defaultClasses)),
        });
        const updatedAt = new Date().toISOString();
        const { css } = await uno.generate(Array.from(classNames), { minify: ds?.minify });
        await req.payload.updateGlobal({
            req,
            slug: `${draft ? 'draft' : 'published'}Storage`,
            data: { layoutCSS: css, cssSize: css.length, updatedAt },
        });
        manualLogger(`[UPDATE] (Global) - ${draft ? 'Draft' : 'Published'} CSS Storage - ${css.length} bytes`);
        return css;
    };
}
//# sourceMappingURL=cssProcessor.js.map