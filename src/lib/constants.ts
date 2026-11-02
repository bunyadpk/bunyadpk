export const CEO_PHONE = '0321-9404812';
export const CEO_PHONE_ALT = '0300-1700927';
export const CEO_EMAIL = 'bintahacrm@gmail.com';
export const CEO_NAME = 'Taha Mubeen Bhutta';
export const CEO_NAME_UR = 'طہٰ مبین بھٹہ';
export const HQ = 'Block J, LDA Avenue 1, Lahore';

export function waLink(message: string, phone: string = CEO_PHONE) {
  const clean = phone.replace(/[^0-9]/g, '');
  const intl = clean.startsWith('0') ? '92' + clean.slice(1) : clean;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}
