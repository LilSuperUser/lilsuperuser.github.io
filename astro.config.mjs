// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    site: "https://lilsuperuser.github.io",
    output: "static",
    compressHTML: true,
});
