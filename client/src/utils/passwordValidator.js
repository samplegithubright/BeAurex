/**
 * Password validation utility for BeAurex platform.
 * Enforces strong password standards to prevent browser "Weak password" warnings
 * and ensure strong account security.
 */

export const validatePassword = (password = '') => {
  const pwd = String(password || '');
  const hasMinLength = pwd.length >= 8;
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

  const errors = [];
  if (!hasMinLength) errors.push('At least 8 characters');
  if (!hasUpper) errors.push('At least 1 uppercase letter (A-Z)');
  if (!hasLower) errors.push('At least 1 lowercase letter (a-z)');
  if (!hasNumber) errors.push('At least 1 number (0-9)');
  if (!hasSpecial) errors.push('At least 1 special character (!@#$%...)');

  let score = 0;
  if (hasMinLength) score++;
  if (hasLower) score++;
  if (hasUpper) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  let strength = 'Weak';
  if (score === 5) {
    strength = 'Strong';
  } else if (score >= 3) {
    strength = 'Medium';
  }

  return {
    isValid: score === 5,
    hasMinLength,
    hasLower,
    hasUpper,
    hasNumber,
    hasSpecial,
    score,
    strength,
    errors,
    errorMessage: errors.length > 0 ? `Password must have: ${errors.join(', ')}` : ''
  };
};
