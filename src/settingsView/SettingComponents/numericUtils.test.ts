import { describe, it, expect } from 'vitest';
import { parseNumericInput } from './numericUtils';

describe('parseNumericInput', () => {
	it('parses integer strings', () => {
		expect(parseNumericInput('42')).toBe(42);
	});

	it('parses float strings', () => {
		expect(parseNumericInput('3.14')).toBe(3.14);
	});

	it('trims whitespace', () => {
		expect(parseNumericInput('  42  ')).toBe(42);
	});

	it('returns null for empty string', () => {
		expect(parseNumericInput('')).toBeNull();
	});

	it('returns null for whitespace-only string', () => {
		expect(parseNumericInput('   ')).toBeNull();
	});

	it('returns null for non-numeric strings', () => {
		expect(parseNumericInput('abc')).toBeNull();
	});

	it('returns null for NaN string', () => {
		expect(parseNumericInput('NaN')).toBeNull();
	});

	it('returns null for Infinity', () => {
		expect(parseNumericInput('Infinity')).toBeNull();
	});

	it('returns null for negative Infinity', () => {
		expect(parseNumericInput('-Infinity')).toBeNull();
	});

	it('parses negative numbers', () => {
		expect(parseNumericInput('-7')).toBe(-7);
	});

	it('parses zero', () => {
		expect(parseNumericInput('0')).toBe(0);
	});
});
