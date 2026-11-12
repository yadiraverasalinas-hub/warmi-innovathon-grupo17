import { sanitizePhone } from './security.js';

export function validateContact(contact) {
  const name = String(contact.name ?? '').trim();
  const phone = sanitizePhone(contact.phone);
  const digits = phone.replace(/\D/g, '');

  if (!name || name.length > 80) {
    return { valid: false, message: 'Escribe un nombre de hasta 80 caracteres.' };
  }
  if (digits.length < 9 || digits.length > 15) {
    return { valid: false, message: 'Revisa el número: debe tener entre 9 y 15 dígitos.' };
  }

  return { valid: true, contact: { name, phone } };
}

export function validateContacts(contacts) {
  const filled = contacts.filter((contact) => String(contact.name ?? '').trim() || String(contact.phone ?? '').trim());
  if (filled.length < 2) {
    return { valid: false, message: 'Agrega al menos 2 personas de confianza con su número.' };
  }

  const normalized = [];
  for (const contact of filled) {
    const result = validateContact(contact);
    if (!result.valid) return result;
    normalized.push(result.contact);
  }

  return { valid: true, contacts: normalized };
}
