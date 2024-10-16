import type { Fn } from '@wang-yige/utils';

export type CSSStyleKeyValue = {
	[K in keyof CSSStyleDeclaration as K extends string
		? CSSStyleDeclaration[K] extends string
			? K
			: never
		: never]?: CSSStyleDeclaration[K];
};

export type StyleText = {
	[selector: string]: StyleText | CSSStyleKeyValue;
};

export interface InsertStyle {
	/**
	 * Insert a style to the style sheet.
	 */
	insert: Fn<[style: StyleText]>;
	/**
	 * Delete a style from the style sheet.
	 */
	delete: Fn<[...selector: string[]]>;
	readonly styleElement: HTMLStyleElement;
	readonly styleSheet: CSSStyleSheet;
	readonly name: string;
}

export type Cache = {
	styleElement: HTMLStyleElement;
	styleSheet: CSSStyleSheet;
	usage: InsertStyle;
};
