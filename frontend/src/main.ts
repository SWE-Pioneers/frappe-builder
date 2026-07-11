import { createApp } from "vue";

import { Button, FormControl, FrappeUI } from "frappe-ui";
import { telemetryPlugin } from "frappe-ui/frappe";
import { createPinia } from "pinia";
// Imported first (before router/App and any module that calls `__()` at
// top level) so its import side-effect assigns the global `window.__` helper
// before those modules evaluate.
import translationPlugin, { fetchTranslations } from "@/translation";
import "./index.css";
import router from "./router";
import "./setupFrappeUIResource";

import App from "@/App.vue";
import Input from "@/components/Controls/Input.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(FrappeUI);
app.use(pinia);
app.use(translationPlugin);
app.use(telemetryPlugin, { app_name: "builder" });

window.name = "frappe-builder";
app.config.globalProperties.window = window;

app.component("Button", Button);
app.component("FormControl", FormControl);
app.component("BuilderInput", Input);

// Load translations before the first render so the UI paints in the active
// language. fetchTranslations never rejects, so a failed/slow request falls
// back to English instead of blocking the mount.
fetchTranslations().finally(() => {
	app.mount("#app");
});

declare global {
	interface Window {
		is_developer_mode?: boolean;
		builder_version: string;
	}
}

if (window.is_developer_mode && typeof window.is_developer_mode === "string") {
	window.is_developer_mode =
		window.is_developer_mode === "1" ||
		window.is_developer_mode === "True" ||
		(window.is_developer_mode as string).startsWith("{{");
}

if (window.builder_version && window.builder_version.startsWith("{{")) {
	window.builder_version = "develop";
}
