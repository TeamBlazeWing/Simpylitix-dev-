export const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(' ');
  } else {
    return v;
  }
};

export const formatExpiryDate = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (v.length >= 2) {
    return v.substring(0, 2) + '/' + v.substring(2, 4);
  }
  return v;
};

export const formatPhoneNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (matches) {
    return `(${matches[1]}) ${matches[2]}-${matches[3]}`;
  }
  return v;
};

export const validateField = (name, value, setFormErrors) => {
  const errors = {};
  
  switch (name) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.email = 'Please enter a valid email address';
      }
      break;
    case 'cardNumber':
      const cardRegex = /^[0-9\s]{13,19}$/;
      if (!cardRegex.test(value.replace(/\s/g, ''))) {
        errors.cardNumber = 'Please enter a valid card number';
      }
      break;
    case 'cvv':
      const cvvRegex = /^[0-9]{3,4}$/;
      if (!cvvRegex.test(value)) {
        errors.cvv = 'CVV must be 3-4 digits';
      }
      break;
    case 'expiryDate':
      const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      if (!expiryRegex.test(value)) {
        errors.expiryDate = 'Please enter MM/YY format';
      } else {
        const [month, year] = value.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const now = new Date();
        if (expiry < now) {
          errors.expiryDate = 'Card has expired';
        }
      }
      break;
    case 'phone':
      const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
      if (!phoneRegex.test(value) && value.length > 0) {
        errors.phone = 'Please enter a valid phone number';
      }
      break;
    default:
      break;
  }
  
  setFormErrors(prev => ({ ...prev, ...errors }));
  if (!errors[name]) {
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }
};

export const getCardType = (number) => {
  const cleanNumber = number.replace(/\s/g, '');
  if (/^4/.test(cleanNumber)) return 'Visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'American Express';
  if (/^6/.test(cleanNumber)) return 'Discover';
  return 'Unknown';
};