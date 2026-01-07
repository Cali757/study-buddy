export default function Landing() {
  if (typeof window !== 'undefined') {
    window.location.href = '/pages/landing.html';
  }
  return null;
}
