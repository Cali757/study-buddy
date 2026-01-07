export default function Onboarding() {
  if (typeof window !== 'undefined') {
    window.location.href = '/pages/onboarding.html';
  }
  return null;
}
