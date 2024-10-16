import type { InsertStyle as InsertStyleType, StyleText } from './type';
import { create, randomString, removeStyleSheet } from './utils';

export class InsertStyle implements InsertStyleType {
	#usage: InsertStyleType;

	get styleElement() {
		return this.#usage.styleElement;
	}
	get styleSheet() {
		return this.#usage.styleSheet;
	}
	get name() {
		return this.#usage.name;
	}
	insert(style: StyleText) {
		return this.#usage.insert(style);
	}
	delete(...selector: string[]) {
		return this.#usage.delete(...selector);
	}

	/**
	 * Create a style sheet operate instance.
	 */
	constructor() {
		this.#usage = create();
	}

	/**
	 * Remove a style element from the document.
	 */
	static remove(...name: string[]) {
		for (const n of name) {
			removeStyleSheet(n);
		}
	}

	static #cache = [] as string[];

	static css(style: string, el?: HTMLStyleElement) {
		if (el) {
			el.textContent += style;
			return el;
		}
		const name = () => {
			const str = randomString(8, 'W-YG-');
			if (this.#cache.includes(str)) {
				return name();
			}
			this.#cache.push(str);
			return str;
		};
		const styleElement = document.createElement('style');
		styleElement.setAttribute('type', 'text/css');
		styleElement.setAttribute('name', name());
		styleElement.textContent = style;
		document.head.appendChild(styleElement);
		return styleElement;
	}
}
