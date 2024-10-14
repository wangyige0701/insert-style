import type { InsertStyle as InsertStyleType, StyleText } from './type';
import { create, removeStyleSheet } from './utils';

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
	html(style: string, append?: boolean) {
		return this.#usage.html(style, append);
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
}
