import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'fintrust.demo.session';

export const secureStorage = {
  async setSession(value: string) {
    await SecureStore.setItemAsync(SESSION_KEY, value, {
      keychainService: 'fintrust-demo-keychain',
    });
  },
  async getSession() {
    return SecureStore.getItemAsync(SESSION_KEY);
  },
  async clearSession() {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  },
};
