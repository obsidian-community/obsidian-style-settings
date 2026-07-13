/**
 * Parse a string into a number, returning null if the input is not a valid
 * finite number. Used by VariableNumberSettingComponent to guard against
 * NaN/Infinity leaking into CSS variables.
 */
export function parseNumericInput(value: string): number | null {
	const trimmed = value.trim();
	if (trimmed === '') return null;
	const isFloat = /\./.test(trimmed);
	const parsed = isFloat ? parseFloat(trimmed) : parseInt(trimmed, 10);
	return Number.isFinite(parsed) ? parsed : null;
}
