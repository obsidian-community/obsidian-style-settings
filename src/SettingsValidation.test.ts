import { beforeAll, describe, expect, it } from 'vitest';
import type { ValidationResult } from './SettingsValidation';
import { SettingType } from './settingsView/SettingComponents/types';
import {
	ClassMultiToggle,
	ClassToggle,
	ColorGradient,
	Heading,
	InfoText,
	VariableColor,
	VariableNumber,
	VariableNumberSlider,
	VariableSelect,
	VariableText,
	VariableThemedColor,
	CSSSetting,
} from './SettingHandlers';

let validateAndNormalizeSetting: (setting: CSSSetting) => ValidationResult;

beforeAll(async () => {
	(
		globalThis as unknown as {
			window: { localStorage: { getItem: () => string | null } };
		}
	).window = {
		localStorage: {
			getItem: () => null,
		},
	};

	({ validateAndNormalizeSetting } = await import('./SettingsValidation'));
});

describe('validateAndNormalizeSetting', () => {
	describe('heading', () => {
		it('passes through valid heading', () => {
			const heading: Heading = {
				id: 'heading-valid',
				title: 'Heading',
				type: SettingType.HEADING,
				level: 3,
			};

			const result = validateAndNormalizeSetting(heading);

			expect(result.setting).toEqual(heading);
			expect(result.warnings).toHaveLength(0);
		});

		it('defaults missing level to 1', () => {
			const heading = {
				id: 'heading-missing',
				title: 'Heading',
				type: SettingType.HEADING,
			} as Heading;

			const result = validateAndNormalizeSetting(heading);

			expect((result.setting as Heading).level).toBe(1);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'INVALID_HEADING_LEVEL',
			]);
		});

		it('clamps level 0 to 1', () => {
			const heading: Heading = {
				id: 'heading-low',
				title: 'Heading',
				type: SettingType.HEADING,
				level: 0,
			};

			const result = validateAndNormalizeSetting(heading);

			expect((result.setting as Heading).level).toBe(1);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'INVALID_HEADING_LEVEL',
			]);
		});

		it('clamps level 7 to 6', () => {
			const heading = {
				id: 'heading-high',
				title: 'Heading',
				type: SettingType.HEADING,
				level: 7,
			} as unknown as Heading;

			const result = validateAndNormalizeSetting(heading);

			expect((result.setting as Heading).level).toBe(6);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'INVALID_HEADING_LEVEL',
			]);
		});

		it('clamps non-integer level', () => {
			const heading = {
				id: 'heading-float',
				title: 'Heading',
				type: SettingType.HEADING,
				level: 2.7,
			} as unknown as Heading;

			const result = validateAndNormalizeSetting(heading);

			expect((result.setting as Heading).level).toBe(3);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'INVALID_HEADING_LEVEL',
			]);
		});
	});

	describe('class-toggle', () => {
		it('passes through valid toggle', () => {
			const toggle: ClassToggle = {
				id: 'toggle-valid',
				title: 'Toggle',
				type: SettingType.CLASS_TOGGLE,
				default: true,
			};

			const result = validateAndNormalizeSetting(toggle);

			expect(result.setting).toEqual(toggle);
			expect(result.warnings).toHaveLength(0);
		});

		it('coerces non-boolean default to false', () => {
			const toggle = {
				id: 'toggle-invalid',
				title: 'Toggle',
				type: SettingType.CLASS_TOGGLE,
				default: 'yes',
			} as unknown as ClassToggle;

			const result = validateAndNormalizeSetting(toggle);

			expect((result.setting as ClassToggle).default).toBe(false);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'INVALID_DEFAULT',
			]);
		});
	});

	describe('class-select', () => {
		it('passes through valid class-select', () => {
			const select: ClassMultiToggle = {
				id: 'class-select-valid',
				title: 'Select',
				type: SettingType.CLASS_SELECT,
				allowEmpty: true,
				options: ['a', 'b'],
				default: 'a',
			};

			const result = validateAndNormalizeSetting(select);

			expect(result.setting).toEqual(select);
			expect(result.warnings).toHaveLength(0);
		});

		it('defaults allowEmpty to false when missing', () => {
			const select = {
				id: 'class-select-missing-allow',
				title: 'Select',
				type: SettingType.CLASS_SELECT,
				options: ['a', 'b'],
				default: 'a',
			} as ClassMultiToggle;

			const result = validateAndNormalizeSetting(select);

			expect((result.setting as ClassMultiToggle).allowEmpty).toBe(false);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'MISSING_ALLOW_EMPTY',
			]);
		});
	});

	describe('variable-text', () => {
		it('passes through valid variable-text', () => {
			const variableText: VariableText = {
				id: 'text-valid',
				title: 'Text',
				type: SettingType.VARIABLE_TEXT,
				default: 'hello',
			};

			const result = validateAndNormalizeSetting(variableText);

			expect(result.setting).toEqual(variableText);
			expect(result.warnings).toHaveLength(0);
		});

		it('defaults missing text value to empty string', () => {
			const variableText = {
				id: 'text-missing',
				title: 'Text',
				type: SettingType.VARIABLE_TEXT,
			} as VariableText;

			const result = validateAndNormalizeSetting(variableText);

			expect((result.setting as VariableText).default).toBe('');
			expect(result.warnings.map((w) => w.code)).toEqual([
				'MISSING_DEFAULT',
			]);
		});
	});

	describe('variable-number', () => {
		it('passes through valid variable-number', () => {
			const variableNumber: VariableNumber = {
				id: 'number-valid',
				title: 'Number',
				type: SettingType.VARIABLE_NUMBER,
				default: 10,
			};

			const result = validateAndNormalizeSetting(variableNumber);

			expect(result.setting).toEqual(variableNumber);
			expect(result.warnings).toHaveLength(0);
		});

		it('defaults missing number to 0', () => {
			const variableNumber = {
				id: 'number-missing',
				title: 'Number',
				type: SettingType.VARIABLE_NUMBER,
			} as VariableNumber;

			const result = validateAndNormalizeSetting(variableNumber);

			expect((result.setting as VariableNumber).default).toBe(0);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'MISSING_DEFAULT',
			]);
		});
	});

	describe('variable-number-slider', () => {
		it('passes through valid slider', () => {
			const slider: VariableNumberSlider = {
				id: 'slider-valid',
				title: 'Slider',
				type: SettingType.VARIABLE_NUMBER_SLIDER,
				default: 5,
				min: 0,
				max: 10,
				step: 1,
			};

			const result = validateAndNormalizeSetting(slider);

			expect(result.setting).toEqual(slider);
			expect(result.warnings).toHaveLength(0);
		});

		it('fills missing slider fields with defaults', () => {
			const slider = {
				id: 'slider-missing',
				title: 'Slider',
				type: SettingType.VARIABLE_NUMBER_SLIDER,
			} as VariableNumberSlider;

			const result = validateAndNormalizeSetting(slider);
			const normalized = result.setting as VariableNumberSlider;

			expect(normalized.default).toBe(0);
			expect(normalized.min).toBe(0);
			expect(normalized.max).toBe(100);
			expect(normalized.step).toBe(1);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'MISSING_SLIDER_FIELDS',
			]);
		});

		it('swaps min and max when inverted', () => {
			const slider: VariableNumberSlider = {
				id: 'slider-range',
				title: 'Slider',
				type: SettingType.VARIABLE_NUMBER_SLIDER,
				default: 5,
				min: 10,
				max: 0,
				step: 1,
			};

			const result = validateAndNormalizeSetting(slider);
			const normalized = result.setting as VariableNumberSlider;

			expect(normalized.min).toBe(0);
			expect(normalized.max).toBe(10);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'INVALID_SLIDER_RANGE',
			]);
		});

		it('defaults invalid step to 1', () => {
			const slider: VariableNumberSlider = {
				id: 'slider-step',
				title: 'Slider',
				type: SettingType.VARIABLE_NUMBER_SLIDER,
				default: 5,
				min: 0,
				max: 10,
				step: 0,
			};

			const result = validateAndNormalizeSetting(slider);

			expect((result.setting as VariableNumberSlider).step).toBe(1);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'INVALID_SLIDER_STEP',
			]);
		});

		it('clamps default below min', () => {
			const slider: VariableNumberSlider = {
				id: 'slider-default-low',
				title: 'Slider',
				type: SettingType.VARIABLE_NUMBER_SLIDER,
				default: -5,
				min: 0,
				max: 10,
				step: 1,
			};

			const result = validateAndNormalizeSetting(slider);

			expect((result.setting as VariableNumberSlider).default).toBe(0);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'INVALID_SLIDER_DEFAULT',
			]);
		});

		it('clamps default above max', () => {
			const slider: VariableNumberSlider = {
				id: 'slider-default-high',
				title: 'Slider',
				type: SettingType.VARIABLE_NUMBER_SLIDER,
				default: 50,
				min: 0,
				max: 10,
				step: 1,
			};

			const result = validateAndNormalizeSetting(slider);

			expect((result.setting as VariableNumberSlider).default).toBe(10);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'INVALID_SLIDER_DEFAULT',
			]);
		});
	});

	describe('variable-color', () => {
		it('passes through valid color', () => {
			const variableColor: VariableColor = {
				id: 'color-valid',
				title: 'Color',
				type: SettingType.VARIABLE_COLOR,
				format: 'hex',
				default: '#ffffff',
			};

			const result = validateAndNormalizeSetting(variableColor);

			expect(result.setting).toEqual(variableColor);
			expect(result.warnings).toHaveLength(0);
		});

		it('defaults missing color format to hex', () => {
			const variableColor = {
				id: 'color-missing-format',
				title: 'Color',
				type: SettingType.VARIABLE_COLOR,
				default: '#ffffff',
			} as VariableColor;

			const result = validateAndNormalizeSetting(variableColor);

			expect((result.setting as VariableColor).format).toBe('hex');
			expect(result.warnings.map((w) => w.code)).toEqual([
				'MISSING_COLOR_FORMAT',
			]);
		});

		it('defaults unsupported color format to hex', () => {
			const variableColor = {
				id: 'color-unsupported-format',
				title: 'Color',
				type: SettingType.VARIABLE_COLOR,
				format: 'lab',
			} as unknown as VariableColor;

			const result = validateAndNormalizeSetting(variableColor);

			expect((result.setting as VariableColor).format).toBe('hex');
			expect(result.warnings.map((w) => w.code)).toEqual([
				'UNSUPPORTED_COLOR_FORMAT',
			]);
		});

		it('warns on invalid default but keeps value', () => {
			const variableColor: VariableColor = {
				id: 'color-invalid-default',
				title: 'Color',
				type: SettingType.VARIABLE_COLOR,
				format: 'hex',
				default: 'not-a-color',
			};

			const result = validateAndNormalizeSetting(variableColor);

			expect((result.setting as VariableColor).default).toBe('not-a-color');
			expect(result.warnings.map((w) => w.code)).toEqual([
				'INVALID_DEFAULT',
			]);
		});
	});

	describe('variable-themed-color', () => {
		it('passes through valid themed color', () => {
			const themedColor: VariableThemedColor = {
				id: 'themed-valid',
				title: 'Themed',
				type: SettingType.VARIABLE_THEMED_COLOR,
				format: 'hex',
				'alt-format': [],
				'default-light': '#111111',
				'default-dark': '#222222',
			};

			const result = validateAndNormalizeSetting(themedColor);

			expect(result.setting).toEqual(themedColor);
			expect(result.warnings).toHaveLength(0);
		});

		it('defaults missing format to hex', () => {
			const themedColor = {
				id: 'themed-missing-format',
				title: 'Themed',
				type: SettingType.VARIABLE_THEMED_COLOR,
				'alt-format': [],
				'default-light': '#111111',
				'default-dark': '#222222',
			} as unknown as VariableThemedColor;

			const result = validateAndNormalizeSetting(themedColor);

			expect((result.setting as VariableThemedColor).format).toBe('hex');
			expect(result.warnings.map((w) => w.code)).toEqual([
				'MISSING_COLOR_FORMAT',
			]);
		});

		it('defaults missing themed defaults to #000000', () => {
			const themedColor = {
				id: 'themed-missing-defaults',
				title: 'Themed',
				type: SettingType.VARIABLE_THEMED_COLOR,
				format: 'hex',
				'alt-format': [],
			} as unknown as VariableThemedColor;

			const result = validateAndNormalizeSetting(themedColor);
			const normalized = result.setting as VariableThemedColor;

			expect(normalized['default-light']).toBe('#000000');
			expect(normalized['default-dark']).toBe('#000000');
			expect(result.warnings.map((w) => w.code)).toEqual([
				'MISSING_THEMED_COLOR_FIELDS',
				'MISSING_THEMED_COLOR_FIELDS',
			]);
		});
	});

	describe('variable-select', () => {
		it('passes through valid select', () => {
			const variableSelect: VariableSelect = {
				id: 'select-valid',
				title: 'Select',
				type: SettingType.VARIABLE_SELECT,
				default: 'a',
				options: ['a', 'b'],
			};

			const result = validateAndNormalizeSetting(variableSelect);

			expect(result.setting).toEqual(variableSelect);
			expect(result.warnings).toHaveLength(0);
		});

		it('defaults missing select to empty string', () => {
			const variableSelect = {
				id: 'select-missing',
				title: 'Select',
				type: SettingType.VARIABLE_SELECT,
				options: ['a', 'b'],
			} as VariableSelect;

			const result = validateAndNormalizeSetting(variableSelect);

			expect((result.setting as VariableSelect).default).toBe('');
			expect(result.warnings.map((w) => w.code)).toEqual([
				'MISSING_DEFAULT',
			]);
		});
	});

	describe('color-gradient', () => {
		it('passes through valid gradient', () => {
			const gradient: ColorGradient = {
				id: 'gradient-valid',
				title: 'Gradient',
				type: SettingType.COLOR_GRADIENT,
				from: 'color-1',
				to: 'color-2',
				format: 'hex',
				step: 5,
			};

			const result = validateAndNormalizeSetting(gradient);

			expect(result.setting).toEqual(gradient);
			expect(result.warnings).toHaveLength(0);
		});

		it('fills missing gradient fields with defaults', () => {
			const gradient = {
				id: 'gradient-missing',
				title: 'Gradient',
				type: SettingType.COLOR_GRADIENT,
			} as ColorGradient;

			const result = validateAndNormalizeSetting(gradient);
			const normalized = result.setting as ColorGradient;

			expect(normalized.from).toBe('');
			expect(normalized.to).toBe('');
			expect(normalized.format).toBe('hex');
			expect(normalized.step).toBe(1);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'MISSING_GRADIENT_FIELDS',
			]);
		});

		it('defaults invalid gradient step to 1', () => {
			const gradient: ColorGradient = {
				id: 'gradient-step',
				title: 'Gradient',
				type: SettingType.COLOR_GRADIENT,
				from: 'color-1',
				to: 'color-2',
				format: 'hex',
				step: 0,
			};

			const result = validateAndNormalizeSetting(gradient);

			expect((result.setting as ColorGradient).step).toBe(1);
			expect(result.warnings.map((w) => w.code)).toEqual([
				'INVALID_GRADIENT_STEP',
			]);
		});
	});

	describe('info-text', () => {
		it('passes through unchanged', () => {
			const infoText: InfoText = {
				id: 'info',
				title: 'Info',
				type: SettingType.INFO_TEXT,
				markdown: true,
			};

			const result = validateAndNormalizeSetting(infoText);

			expect(result.setting).toEqual(infoText);
			expect(result.warnings).toHaveLength(0);
		});
	});

	describe('unknown type', () => {
		it('passes through unchanged', () => {
			const unknown = {
				id: 'unknown',
				title: 'Unknown',
				type: 'unknown',
			} as unknown as CSSSetting;

			const result = validateAndNormalizeSetting(unknown);

			expect(result.setting).toEqual(unknown);
			expect(result.warnings).toHaveLength(0);
		});
	});
});
