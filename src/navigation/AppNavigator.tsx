import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../theme/ThemeProvider';
import { DEMO_CREDENTIALS_LABEL } from '../constants/demoCredentials';
import { accountBalance, creditScore, notifications, transactions } from '../services/mockData';
import { DashboardStackParamList, SendStackParamList, Transaction, TransactionsStackParamList } from '../types';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
const TransactionsStack = createNativeStackNavigator<TransactionsStackParamList>();
const SendStack = createNativeStackNavigator<SendStackParamList>();

const money = (value: number) => `$${value.toFixed(2)}`;

function LoginScreen() {
  const { palette } = useAppTheme();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (username.trim().length < 3) return 'Username must contain at least 3 characters.';
    if (password.trim().length < 3) return 'Password must contain at least 3 characters.';
    return '';
  };

  const onSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={palette.gradient} style={styles.centered}>
      <View style={[styles.authCard, { backgroundColor: palette.surface }]}>
        <Text style={[styles.appTitle, { color: palette.text }]}>FinTrust Banking</Text>
        <Text style={[styles.demoHint, { color: palette.mutedText }]}>{DEMO_CREDENTIALS_LABEL}</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor={palette.mutedText}
          autoCapitalize="none"
          style={[styles.input, { borderColor: palette.border, color: palette.text }]}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={palette.mutedText}
          secureTextEntry
          autoCapitalize="none"
          style={[styles.input, { borderColor: palette.border, color: palette.text }]}
        />
        {!!error && <Text style={[styles.errorText, { color: palette.danger }]}>{error}</Text>}
        <Pressable onPress={onSubmit} style={[styles.primaryButton, { backgroundColor: palette.primary }]}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Sign In Securely</Text>}
        </Pressable>
      </View>
    </LinearGradient>
  );
}

function DashboardHome({ navigation }: { navigation: any }) {
  const { palette } = useAppTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: palette.background }} contentContainerStyle={styles.screenBody}>
      <LinearGradient colors={palette.gradient} style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceValue}>{money(accountBalance)}</Text>
        <Text style={styles.balanceSubtext}>Premium Checking • **** 4021</Text>
      </LinearGradient>
      <View style={[styles.block, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.blockTitle, { color: palette.text }]}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <ActionButton label="Send" icon="send" onPress={() => navigation.navigate('SendMoneyTab')} />
          <ActionButton label="Receive" icon="download" onPress={() => {}} />
          <ActionButton label="History" icon="clock" onPress={() => navigation.navigate('TransactionsTab')} />
        </View>
      </View>
      <View style={[styles.block, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.blockTitle, { color: palette.text }]}>Spending Snapshot</Text>
        <View style={styles.chartRow}>
          {[65, 35, 85, 45, 60].map((bar, index) => (
            <View key={index} style={styles.chartColumn}>
              <View style={[styles.chartBar, { height: bar, backgroundColor: palette.primary }]} />
            </View>
          ))}
        </View>
      </View>
      <View style={[styles.block, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.blockTitle, { color: palette.text }]}>Credit Score</Text>
        <Text style={[styles.creditScore, { color: palette.accent }]}>{creditScore}</Text>
      </View>
    </ScrollView>
  );
}

function NotificationsScreen() {
  const { palette } = useAppTheme();
  return (
    <ScrollView style={{ backgroundColor: palette.background }} contentContainerStyle={styles.screenBody}>
      {notifications.map((item) => (
        <View key={item.id} style={[styles.notificationItem, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.notificationTitle, { color: palette.text }]}>{item.title}</Text>
          <Text style={{ color: palette.mutedText }}>{item.message}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function TransactionsHome({ navigation }: { navigation: any }) {
  const { palette } = useAppTheme();
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const filtered = transactions.filter((tx) => filter === 'all' || tx.kind === filter);

  return (
    <ScrollView style={{ backgroundColor: palette.background }} contentContainerStyle={styles.screenBody}>
      <View style={styles.quickActions}>
        {(['all', 'credit', 'debit'] as const).map((item) => (
          <Pressable key={item} onPress={() => setFilter(item)} style={[styles.chip, { borderColor: palette.border, backgroundColor: filter === item ? palette.primary : palette.surface }]}>
            <Text style={{ color: filter === item ? '#fff' : palette.text }}>{item.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      {filtered.map((item) => (
        <Pressable key={item.id} onPress={() => navigation.navigate('TransactionDetails', { transactionId: item.id })} style={[styles.transactionItem, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={{ color: palette.text, fontWeight: '600' }}>{item.title}</Text>
          <Text style={{ color: item.kind === 'credit' ? palette.success : palette.danger }}>{item.kind === 'credit' ? '+' : '-'}{money(item.amount)}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function TransactionDetails({ route }: { route: { params: { transactionId: string } } }) {
  const { palette } = useAppTheme();
  const tx = transactions.find((item) => item.id === route.params.transactionId) as Transaction;

  return (
    <View style={[styles.centeredBody, { backgroundColor: palette.background }]}>
      <View style={[styles.block, { backgroundColor: palette.surface, borderColor: palette.border, width: '100%' }]}>
        <Text style={[styles.blockTitle, { color: palette.text }]}>{tx.title}</Text>
        <Text style={{ color: palette.mutedText }}>{tx.description}</Text>
        <Text style={{ color: palette.text, marginTop: 12 }}>Amount: {money(tx.amount)}</Text>
        <Text style={{ color: palette.text }}>Type: {tx.kind}</Text>
        <Text style={{ color: palette.text }}>Date: {tx.date}</Text>
        <Text style={{ color: palette.text }}>Status: {tx.status}</Text>
      </View>
    </View>
  );
}

function SendMoneyHome({ navigation }: { navigation: any }) {
  const { palette } = useAppTheme();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const parsedAmount = Number(amount);
    if (recipient.trim().length < 2) return setError('Recipient name is too short.');
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return setError('Enter a valid amount.');
    if (parsedAmount > 5000) return setError('Demo transfer limit is $5000.');
    setError('');
    navigation.navigate('SendMoneyConfirm', { recipient: recipient.trim(), amount: parsedAmount });
  };

  return (
    <View style={[styles.centeredBody, { backgroundColor: palette.background }]}>
      <View style={[styles.block, { backgroundColor: palette.surface, borderColor: palette.border, width: '100%' }]}>
        <Text style={[styles.blockTitle, { color: palette.text }]}>Send Money</Text>
        <TextInput value={recipient} onChangeText={setRecipient} placeholder="Recipient" placeholderTextColor={palette.mutedText} style={[styles.input, { borderColor: palette.border, color: palette.text }]} />
        <TextInput value={amount} onChangeText={setAmount} placeholder="Amount" placeholderTextColor={palette.mutedText} keyboardType="decimal-pad" style={[styles.input, { borderColor: palette.border, color: palette.text }]} />
        {!!error && <Text style={{ color: palette.danger, marginBottom: 8 }}>{error}</Text>}
        <Pressable onPress={submit} style={[styles.primaryButton, { backgroundColor: palette.primary }]}>
          <Text style={styles.primaryButtonText}>Review Transfer</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SendMoneyConfirm({ route, navigation }: { route: { params: { recipient: string; amount: number } }; navigation: any }) {
  const { palette } = useAppTheme();
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const isSuccess = Math.random() > 0.2;
    setResult(isSuccess ? 'Transfer successful.' : 'Transfer failed. Please retry.');
    setLoading(false);
  };

  return (
    <View style={[styles.centeredBody, { backgroundColor: palette.background }]}>
      <View style={[styles.block, { backgroundColor: palette.surface, borderColor: palette.border, width: '100%' }]}>
        <Text style={[styles.blockTitle, { color: palette.text }]}>Confirm Transfer</Text>
        <Text style={{ color: palette.text }}>Recipient: {route.params.recipient}</Text>
        <Text style={{ color: palette.text, marginBottom: 16 }}>Amount: {money(route.params.amount)}</Text>
        <Pressable onPress={confirm} style={[styles.primaryButton, { backgroundColor: palette.accent }]}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Confirm</Text>}
        </Pressable>
        {!!result && <Text style={{ marginTop: 12, color: result.includes('successful') ? palette.success : palette.danger }}>{result}</Text>}
        <Pressable onPress={() => navigation.popToTop()} style={[styles.secondaryButton, { borderColor: palette.border }]}>
          <Text style={{ color: palette.text }}>New Transfer</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ProfileScreen() {
  const { palette, isDarkMode, toggleTheme } = useAppTheme();
  const { logout, user } = useAuth();
  const [isBiometricEnabled, setBiometricEnabled] = useState(true);
  const [isTwoFaEnabled, setTwoFaEnabled] = useState(true);

  return (
    <ScrollView style={{ backgroundColor: palette.background }} contentContainerStyle={styles.screenBody}>
      <View style={[styles.block, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.blockTitle, { color: palette.text }]}>{user?.name}</Text>
        <Text style={{ color: palette.mutedText }}>{user?.email}</Text>
      </View>
      <View style={[styles.block, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <SettingRow label="Dark mode" value={isDarkMode} onChange={toggleTheme} />
        <SettingRow label="Biometric login (mock)" value={isBiometricEnabled} onChange={setBiometricEnabled} />
        <SettingRow label="2FA protection (mock)" value={isTwoFaEnabled} onChange={setTwoFaEnabled} />
      </View>
      <Pressable onPress={() => void logout()} style={[styles.primaryButton, { backgroundColor: palette.danger }]}>
        <Text style={styles.primaryButtonText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

function DashboardNavigator() {
  const { palette } = useAppTheme();
  return (
    <DashboardStack.Navigator screenOptions={{ headerStyle: { backgroundColor: palette.surface }, headerTintColor: palette.text }}>
      <DashboardStack.Screen
        name="DashboardHome"
        component={DashboardHome}
        options={({ navigation }) => ({
          title: 'Dashboard',
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('Notifications')}>
              <Feather name="bell" color={palette.text} size={20} />
            </Pressable>
          ),
        })}
      />
      <DashboardStack.Screen name="Notifications" component={NotificationsScreen} />
    </DashboardStack.Navigator>
  );
}

function TransactionsNavigator() {
  const { palette } = useAppTheme();
  return (
    <TransactionsStack.Navigator screenOptions={{ headerStyle: { backgroundColor: palette.surface }, headerTintColor: palette.text }}>
      <TransactionsStack.Screen name="TransactionsHome" component={TransactionsHome} options={{ title: 'Transactions' }} />
      <TransactionsStack.Screen name="TransactionDetails" component={TransactionDetails} options={{ title: 'Details' }} />
    </TransactionsStack.Navigator>
  );
}

function SendNavigator() {
  const { palette } = useAppTheme();
  return (
    <SendStack.Navigator screenOptions={{ headerStyle: { backgroundColor: palette.surface }, headerTintColor: palette.text }}>
      <SendStack.Screen name="SendMoneyHome" component={SendMoneyHome} options={{ title: 'Send Money' }} />
      <SendStack.Screen name="SendMoneyConfirm" component={SendMoneyConfirm} options={{ title: 'Confirm' }} />
    </SendStack.Navigator>
  );
}

function MainTabs() {
  const { palette } = useAppTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.mutedText,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Feather.glyphMap> = {
            DashboardTab: 'grid',
            TransactionsTab: 'list',
            SendMoneyTab: 'send',
            ProfileTab: 'user',
          };
          return <Feather name={icons[route.name]} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="TransactionsTab" component={TransactionsNavigator} options={{ title: 'Activity' }} />
      <Tab.Screen name="SendMoneyTab" component={SendNavigator} options={{ title: 'Send' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile', headerShown: true }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { palette } = useAppTheme();

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: palette.background }]}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? <RootStack.Screen name="Main" component={MainTabs} /> : <RootStack.Screen name="Login" component={LoginScreen} />}
    </RootStack.Navigator>
  );
}

function SettingRow({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  const { palette } = useAppTheme();
  return (
    <View style={styles.settingRow}>
      <Text style={{ color: palette.text }}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function ActionButton({ label, icon, onPress }: { label: string; icon: keyof typeof Feather.glyphMap; onPress: () => void }) {
  const { palette } = useAppTheme();
  return (
    <Pressable onPress={onPress} style={[styles.actionButton, { backgroundColor: palette.background }]}>
      <Feather name={icon} size={18} color={palette.primary} />
      <Text style={{ color: palette.text, marginTop: 6 }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centeredBody: { flex: 1, padding: 16 },
  screenBody: { padding: 16, gap: 14 },
  authCard: { width: '90%', padding: 20, borderRadius: 20 },
  appTitle: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  demoHint: { marginBottom: 14 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  errorText: { marginBottom: 8 },
  primaryButton: { alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 },
  secondaryButton: { marginTop: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  balanceCard: { borderRadius: 18, padding: 18 },
  balanceLabel: { color: '#DBEAFE', marginBottom: 8 },
  balanceValue: { color: '#fff', fontSize: 34, fontWeight: '800' },
  balanceSubtext: { color: '#D1FAE5', marginTop: 4 },
  block: { borderWidth: 1, borderRadius: 14, padding: 14 },
  blockTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  quickActions: { flexDirection: 'row', gap: 8 },
  actionButton: { borderRadius: 12, padding: 12, flex: 1, alignItems: 'center' },
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100 },
  chartColumn: { width: 20, justifyContent: 'flex-end' },
  chartBar: { width: '100%', borderRadius: 8 },
  creditScore: { fontSize: 40, fontWeight: '800' },
  notificationItem: { borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 12 },
  notificationTitle: { fontWeight: '700', marginBottom: 4 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  transactionItem: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
});
