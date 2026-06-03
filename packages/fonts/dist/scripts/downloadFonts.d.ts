export type RunDownloadFontsOptions = {
    /** Directory for downloaded font files. Default `./public/fonts` or `ATOMIC_FONTS_OUTPUT_DIR`. */
    fontsOutputDir?: string;
    /** Generated `next/font/local` module path. Default `./src/app/definition.ts` or `ATOMIC_FONTS_DEFINITION_FILE`. */
    definitionFile?: string;
    /** Dotenv file to load before reading env. Default `./.env` or `ATOMIC_FONTS_ENV_FILE`. */
    envFile?: string;
    /**
     * `src` path passed to `localFont()` in the generated file (relative to the definition file’s directory).
     * Default `../../public/fonts` or `ATOMIC_FONTS_SRC_PREFIX`. If you change `fontsOutputDir`, set this accordingly.
     */
    localFontSrcPrefix?: string;
    /**
     * Slug of the standalone font-selection global to fall back to when no active
     * `designSet` is found. Default `fontSet` or `ATOMIC_FONTS_GLOBAL_SLUG`.
     */
    fontSetGlobalSlug?: string;
};
export declare function runDownloadFonts(overrides?: RunDownloadFontsOptions): Promise<void>;
//# sourceMappingURL=downloadFonts.d.ts.map