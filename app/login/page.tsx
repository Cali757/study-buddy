export default function Login() {
  if (typeof window !== 'undefined') {
    window.location.href = '/pages/login.html';
  }
  return null;
}
