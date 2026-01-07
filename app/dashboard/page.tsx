export default function Dashboard() {
  if (typeof window !== 'undefined') {
    window.location.href = '/pages/dashboard.html';
  }
  return null;
}
