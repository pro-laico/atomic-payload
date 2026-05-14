# @pro-laico/ap-forms

Payload plugin that registers submit-form blocks (rate limiting, sanitation, validation), plus `submitForm` / `getSubmitFormProcessor` for the server runtime. Use `formsPlugin({ enabled: true, formBlocks: [...] })` before `actionsPlugin` and `childBlocksPlugin` in the plugin list.
