export declare const postHogTabField: () => {
    name?: string;
    type: "tab";
} & {
    interfaceName?: never;
    label: {
        [selectedLanguage: string]: string;
    } | import("payload").LabelFunction | string;
    localized?: never;
} & Omit<{
    description?: import("payload").LabelFunction | import("payload").StaticDescription;
    fields: import("payload").Field[];
    id?: string;
    interfaceName?: string;
    saveToJWT?: boolean | string;
} & Omit<import("payload").FieldBase, "validate" | "required">, "hooks" | "name" | "virtual">;
//# sourceMappingURL=postHogTab.d.ts.map