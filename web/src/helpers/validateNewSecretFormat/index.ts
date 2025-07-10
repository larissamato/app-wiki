export const validateNewSecretFormat = (value: string | null | object): boolean => {
	try {
		if (!value) return true;
		const requiredKeys = ['support', 'manager'];
		if (typeof value === 'object' && value !== null) {
			return requiredKeys.every(key =>
				Array.isArray(value[key]) &&
				value[key].length > 0 &&
				value[key].every(item => typeof item === 'object' && item !== null)
			);
		}
		return false;
	} catch {
		return false;
	}
};

