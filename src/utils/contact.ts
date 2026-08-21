export interface ContactLink {
  type: 'instagram' | 'email';
  label: string;
  href: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// contact cells look like "@handle" or "@handle / name@mail.com" — split on "/"
// and classify each token instead of assuming a fixed shape
export function parseContacts(raw?: string): ContactLink[] {
  if (!raw) return [];

  return raw
    .split('/')
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token): ContactLink | null => {
      if (token.startsWith('@')) {
        return {
          type: 'instagram',
          label: token,
          href: `https://instagram.com/${token.slice(1)}`,
        };
      }
      if (EMAIL_PATTERN.test(token)) {
        return { type: 'email', label: token, href: `mailto:${token}` };
      }
      return null;
    })
    .filter((contact): contact is ContactLink => contact !== null);
}
