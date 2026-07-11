/* eslint-disable */
declare module "~icons/*" {
	import type { FunctionalComponent, SVGAttributes } from "vue";
	const component: FunctionalComponent<SVGAttributes>;
	export default component;
}
declare module "*.vue" {
	import type { DefineComponent } from "vue";
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

// Global translation helper, wired up by src/translation.ts (window.__).
// Available as a bare identifier in <script setup> and via globalProperties in templates.
declare function __(
	message: string,
	replace?: Array<string | number> | Record<string, string | number>,
	context?: string | null,
): string;

// Make `__` resolve in Vue templates (registered on app.config.globalProperties).
declare module "vue" {
	interface ComponentCustomProperties {
		__: typeof __;
	}
}
