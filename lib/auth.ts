import { User } from 'firebase/auth';

const STORAGE_KEY = 'mock-auth-user';

const createMockUser = (email?: string): User => ({
  uid: 'test-user',
  email: email || 'test@example.com',
  emailVerified: true,
  displayName: 'Test User',
  isAnonymous: false,
  providerId: 'password',
  providerData: [],
  phoneNumber: null,
  photoURL: null,
  metadata: {
    creationTime: '2024-01-01T00:00:00Z',
    lastSignInTime: new Date().toISOString(),
  } as any,
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({ token: 'mock-token' } as any),
  reload: async () => {},
  toJSON: () => ({}),
} as User);

const readStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return createMockUser(parsed.email);
  } catch {
    return null;
  }
};

const writeStoredUser = (user: User | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: user.email }));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(new CustomEvent('mock-auth-changed'));
};

export const signUp = async (email: string, password: string) => {
  const user = createMockUser(email);
  writeStoredUser(user);
  return user;
};

export const signIn = async (email: string, password: string) => {
  const user = createMockUser(email);
  writeStoredUser(user);
  return user;
};

export const logOut = async () => {
  writeStoredUser(null);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  const handle = () => {
    const stored = readStoredUser();
    callback(stored);
  };

  // Prime current state
  handle();

  if (typeof window !== 'undefined') {
    window.addEventListener('mock-auth-changed', handle);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mock-auth-changed', handle);
    }
  };
};
