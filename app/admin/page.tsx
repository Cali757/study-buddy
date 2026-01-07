export default function Admin() {
  if (typeof window !== 'undefined') {
    window.location.href = '/pages/admin.html';
  }
  return null;
}
