function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    return null;
  }
  return id;
}

function isValidDateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function todayInNepal() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kathmandu' });
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value) {
  return typeof value === 'string' && EMAIL_PATTERN.test(value);
}

function cleanOptionalText(value, maxLength) {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    return undefined;
  }
  return trimmed === '' ? null : trimmed;
}

module.exports = { parseId, isValidDateString, todayInNepal, isValidEmail, cleanOptionalText };
