
export const currentUser = {
  name: 'Douglas Lacerda',
  email: 'douglas@exemplo.com',
  role: 'Administrador',
};

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
