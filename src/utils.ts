import type { Cache, CSSStyleKeyValue, StyleText } from './type';
import { getGlobal, isFunction, isObject, lowerCase } from '@wang-yige/utils';

const ID = 'W-YG-ISH';
const NAME_NUM = 6;
const upper = /([A-Z][^A-Z]*)/g;
const splitSelector = /([^,]+)/g;

const range = [
	{ start: 97, end: 122, len: 122 - 97 + 1 },
	{ start: 65, end: 90, len: 90 - 65 + 1 },
	{ start: 48, end: 57, len: 57 - 48 + 1 },
] as const;

const cache = new Map<string, Cache>();

const _i = (length: number) => {
	return (Math.random() * length) | 0;
};

const createName = (len: number): string => {
	let str = '';
	while (len-- > 0) {
		const _v = range[_i(range.length)];
		str += String.fromCharCode(_v.start + _i(_v.len));
	}
	const value = `${ID}_${str}`;
	if (cache.has(value)) {
		return createName(len);
	}
	return value;
};

const toInsert = (() => {
	if (isFunction(getGlobal().CSSStyleSheet.prototype.insertRule)) {
		return function (
			sheet: CSSStyleSheet,
			selector: string,
			style: CSSStyleKeyValue,
			index: number
		) {
			return sheet.insertRule(`${selector}{${parser(style)}}`, index);
		};
	} else {
		return function (
			sheet: CSSStyleSheet,
			selector: string,
			style: CSSStyleKeyValue,
			index: number
		) {
			return sheet.addRule(selector, parser(style), index);
		};
	}
})();

const toDelete = (() => {
	if (isFunction(getGlobal().CSSStyleSheet.prototype.deleteRule)) {
		return function (sheet: CSSStyleSheet, index: number) {
			return sheet.deleteRule(index);
		};
	} else {
		return function (sheet: CSSStyleSheet, index: number) {
			return sheet.removeRule(index);
		};
	}
})();

export function toKebab(str: string) {
	return str.trim().split(upper).filter(Boolean).map(lowerCase).join('-');
}

export function parser(css: CSSStyleKeyValue) {
	let style = '';
	for (const key in css) {
		const styleName = toKebab(key);
		style += `${styleName}:${css[key as keyof CSSStyleKeyValue]};`;
	}
	return style;
}

export function selectorParser(prefix: string, selector: string): string {
	if (selector.includes(',')) {
		return selector.replace(splitSelector, (_$1, str) => {
			return selectorParser(prefix, str);
		});
	}
	if (selector.startsWith('&')) {
		return `${prefix}${selector.slice(1)}`;
	} else {
		return `${prefix} ${selector}`;
	}
}

function expand(
	data: CSSStyleKeyValue | StyleText,
	sheet: CSSStyleSheet,
	selectors: string[],
	selector: string = ''
) {
	selector = selector.trim();
	const style: { [K in keyof CSSStyleKeyValue]?: string } = {};
	for (const key in data) {
		const item = data[key as keyof CSSStyleKeyValue];
		if (isObject(item)) {
			expand(item, sheet, selectors, selectorParser(selector, key));
			continue;
		}
		style[key as keyof CSSStyleKeyValue] = item;
	}
	if (Object.keys(style).length) {
		let index = selectors.length;
		if (selectors.includes(selector)) {
			index = selectors.indexOf(selector);
		} else {
			selectors.push(selector);
		}
		toInsert(sheet, selector, style, index);
	}
}

function _insert(name: string, selectors: string[], style: StyleText) {
	if (cache.has(name)) {
		const { styleSheet } = cache.get(name)!;
		expand(style, styleSheet, selectors);
	}
}

function _delete(name: string, selectors: string[], ...selector: string[]) {
	if (cache.has(name)) {
		const { styleSheet } = cache.get(name)!;
		while (selector.length) {
			const item = selector.pop();
			if (!item || !selectors.includes(item)) {
				continue;
			}
			const index = selectors.indexOf(item);
			toDelete(styleSheet, index);
			selectors.splice(index, 1);
		}
	}
}

/**
 * Create a style sheet target.
 */
export function create() {
	const name = createName(NAME_NUM);
	const styleElement = document.createElement('style');
	styleElement.setAttribute('type', 'text/css');
	styleElement.setAttribute('name', name);
	document.head.appendChild(styleElement);
	const styleSheet = [...Array.from(document.styleSheets)].find(
		(sheet) => sheet.ownerNode === styleElement
	) as CSSStyleSheet;
	const selectors: string[] = [];
	const result: Cache = {
		styleElement,
		styleSheet,
		usage: {
			insert: (style: StyleText) => {
				return _insert(name, selectors, style);
			},
			delete: (...selector: string[]) => {
				return _delete(name, selectors, ...selector);
			},
			html: (style: string, append: boolean = true) => {
				if (append) {
					styleElement.innerHTML += style;
				} else {
					styleElement.innerHTML = style;
				}
			},
			get styleElement() {
				return styleElement;
			},
			get styleSheet() {
				return styleSheet;
			},
			get name() {
				return name;
			},
		},
	};
	cache.set(name, result);
	return result.usage;
}

export function removeStyleSheet(name: string) {
	if (cache.has(name)) {
		const { styleElement } = cache.get(name)!;
		cache.delete(name);
		if (styleElement) {
			document.head.removeChild(styleElement);
		}
	}
}
