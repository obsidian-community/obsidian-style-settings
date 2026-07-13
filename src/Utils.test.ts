import { describe, expect, it } from 'vitest';

const localStorageMock: Storage = {
	length: 0,
	clear: () => undefined,
	getItem: () => null,
	key: () => null,
	removeItem: () => undefined,
	setItem: () => undefined,
};

Object.defineProperty(globalThis, 'window', {
	value: {
		localStorage: localStorageMock,
	},
	writable: true,
});

const { isValidDefaultColor, isValidSavedColor } = await import('./Utils');

describe('isValidDefaultColor', () => {
	it('accepts valid color prefixes', () => {
		expect(isValidDefaultColor('#ff00ff')).toBe(true);
		expect(isValidDefaultColor('rgb(0, 0, 0)')).toBe(true);
		expect(isValidDefaultColor('hsl(0, 100%, 50%)')).toBe(true);
	});

	it('rejects non-color strings', () => {
		expect(isValidDefaultColor('banana')).toBe(false);
	});
});

describe('isValidSavedColor', () => {
	it('accepts valid colors', () => {
		expect(isValidSavedColor('#00ff00')).toBe(true);
		expect(isValidSavedColor('rgb(10, 20, 30)')).toBe(true);
	});

	it('rejects NaN-containing strings', () => {
		expect(isValidSavedColor('#NANNANNAN')).toBe(false);
		expect(isValidSavedColor('rgb(NaN, NaN, NaN)')).toBe(false);
	});

	it('rejects non-color strings', () => {
		expect(isValidSavedColor('not-a-color')).toBe(false);
	});
});
