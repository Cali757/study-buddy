export default function Billing() {
  if (typeof window !== 'undefined') {
    window.location.href = '/pages/billing.html';
  }
  return null;
}
