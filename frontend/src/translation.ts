import type { App } from "vue";

import { setConfig } from "frappe-ui";

type Replacements = Array<string | number> | Record<string, string | number>;

declare global {
	interface Window {
		translatedMessages?: Record<string, string>;
		__?: typeof translate;
	}
}

/**
 * Vue plugin that wires up the `__` translation helper.
 *
 * Fetches the active language's translation map from the whitelisted
 * `builder.api.get_translations` endpoint and stores it on
 * `window.translatedMessages`. `__("...")` then looks strings up in that map,
 * falling back to the original English string when no translation exists (so
 * the UI never breaks if translations are missing or still loading).
 */
export default function translationPlugin(app: App) {
	app.config.globalProperties.__ = translate;
	window.__ = translate;
}

function format(message: string, replace: Replacements): string {
	return message.replace(/{(\d+)}/g, (match: string, number: string) => {
		const value = (replace as Record<string, string | number>)[number];
		return typeof value !== "undefined" ? String(value) : match;
	});
}

export function translate(message: string, replace?: Replacements, context: string | null = null): string {
	const translatedMessages = window.translatedMessages || {};
	let translatedMessage = "";

	if (context) {
		const key = `${message}:${context}`;
		if (translatedMessages[key]) {
			translatedMessage = translatedMessages[key];
		}
	}

	if (!translatedMessage) {
		translatedMessage = translatedMessages[message] || message;
	}

	const hasPlaceholders = /{\d+}/.test(message);
	if (!hasPlaceholders || !replace) {
		return translatedMessage;
	}

	return format(translatedMessage, replace);
}

export const __ = translate;

// Assign the global helper as an import side-effect (in addition to the plugin
// below). Some modules — e.g. the block-property section configs — call `__()`
// at module top-level, which runs during import, BEFORE the plugin's
// `app.use()` executes. As long as this module is imported before those (it is
// imported ahead of App.vue in main.ts), `window.__` is already defined when
// their top-level code evaluates. Fetching still happens from the plugin.
if (typeof window !== "undefined" && typeof window.__ !== "function") {
	window.__ = translate;
}

/**
 * Fetch the translation map for the active language and store it on
 * `window.translatedMessages`. Resolves (never rejects) so a slow or failed
 * request can't block app startup — the UI just falls back to English.
 * Call this before mounting so the first render is already translated.
 */
export function fetchTranslations(): Promise<void> {
	const csrfToken = (window as unknown as { csrf_token?: string }).csrf_token;
	return fetch("/api/method/builder.api.get_translations", {
		headers: {
			Accept: "application/json",
			"X-Frappe-CSRF-Token": csrfToken || "",
		},
	})
		.then((response) => (response.ok ? response.json() : null))
		.then((data) => {
			const messages = (data && data.message) || {};
			window.translatedMessages = messages;
			// keep frappe-ui's own `__` in sync with the fetched map
			setConfig("translatedMessages", messages);
		})
		.catch(() => {
			// non-fatal: fall back to untranslated English strings
			window.translatedMessages = window.translatedMessages || {};
		});
}
