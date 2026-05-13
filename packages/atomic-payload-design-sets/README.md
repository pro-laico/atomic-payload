# @pro-laico/atomic-payload-design-sets

Atomic Payload design-sets plugin factory. Registers caller-supplied DesignSet and ShortcutSet collection configs onto the Payload config.

The collection schemas themselves currently live in the consuming template because they depend on a handful of template-only field utilities. The plan is to fold those into this package in a follow-up release; for now this package gives a stable registration surface.
