/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Password strength validation
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with details
 */
export const validatePassword = (password) => {
  const result = {
    valid: false,
    message: '',
    strength: 'weak'
  };

  if (!password || password.length < 8) {
    result.message = 'Password must be at least 8 characters long';
    return result;
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strength = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (strength <= 2) {
    result.strength = 'weak';
    result.message = 'Password is too weak';
    result.valid = false;
  } else if (strength === 3) {
    result.strength = 'medium';
    result.valid = true;
  } else {
    result.strength = 'strong';
    result.valid = true;
  }
  
  return result;
};

/**
 * Form field validation
 * @param {object} fields - Object with field values
 * @param {object} rules - Object with validation rules
 * @returns {object} - Object with validation errors
 */
export const validateForm = (fields, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = fields[field];
    const fieldRules = rules[field];
    
    // Required check
    if (fieldRules.required && (!value || value.trim() === '')) {
      errors[field] = 'This field is required';
      return;
    }
    
    // Email check
    if (fieldRules.email && value && !isValidEmail(value)) {
      errors[field] = 'Please enter a valid email address';
    }
    
    // Minimum length check
    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = `Must be at least ${fieldRules.minLength} characters`;
    }
    
    // Custom validation
    if (fieldRules.validate && value) {
      const customError = fieldRules.validate(value, fields);
      if (customError) {
        errors[field] = customError;
      }
    }
  });
  
  return errors;
};
