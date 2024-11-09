export default function emailIsValid(email: string) {
  const regex = /^(?![^\s@]+@[^\s@]+\.[^\s@]+$)./;
  return !(!email || regex.test(email));
}
