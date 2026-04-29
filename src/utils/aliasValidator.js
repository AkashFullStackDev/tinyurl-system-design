const RESERVED = new Set([
  'analytics', 'trending', 'redirect', 'shorten'
]);

exports.validateAlias = (alias) => {
  if (!alias) return { valid: false, msg: 'Alias required' };

  if (!/^[a-zA-Z0-9_-]{3,30}$/.test(alias)) {
    return { valid: false, msg: 'Invalid format (3–30, a-zA-Z0-9_-)'}; 
  }

  if (RESERVED.has(alias.toLowerCase())) {
    return { valid: false, msg: 'Alias is reserved' };
  }

  return { valid: true };
};