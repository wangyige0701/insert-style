import { describe, expect, it } from 'vitest';
import { toKebab, parser, selectorParser } from './utils';

describe('check utils', () => {
	it('toKebab', () => {
		expect(toKebab('helloWorld')).toBe('hello-world');
		expect(toKebab('HelloWorld')).toBe('hello-world');
	});

	it('parser', () => {
		const a = parser({
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		});
		expect(a).toBe(
			'display:flex;flex-direction:row;justify-content:center;align-items:center;'
		);
	});

	it('selectorParser', () => {
		expect(selectorParser('span', '&.class')).toBe('span.class');
		expect(selectorParser('', 'div').trim()).toBe('div');
		expect(selectorParser('div', '#id').trim()).toBe('div #id');
	});
});
