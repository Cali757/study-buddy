export default function Settings() {
  if (typeof window !== 'undefined') {
    window.location.href = '/pages/settings.html';
  }
  return null;
}
