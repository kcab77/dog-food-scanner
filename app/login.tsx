/**
 * Sign-in screen — email + 6-digit code.
 *
 * Deliberately a CODE, not a magic link: tapping a link on a phone frequently
 * opens the wrong browser and never returns to the app. Typing 6 digits always
 * works. There's no password, so there's no reset flow to build or support.
 *
 * Colours come only from lib/theme.ts (the project forbids raw hex in components).
 */
import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router, type Href } from 'expo-router';
import t, { radius, space, type } from '../lib/theme';
import { sendLoginCode, verifyLoginCode } from '../lib/supabase';

export default function LoginScreen() {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailLooksValid = /^\S+@\S+\.\S+$/.test(email.trim());

  async function handleSendCode() {
    setError(null);
    if (!emailLooksValid) { setError('Please enter a valid email address.'); return; }
    setBusy(true);
    try {
      await sendLoginCode(email);
      setStep('code');
    } catch (e) {
      setError((e as Error).message || "Couldn't send the code. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify() {
    setError(null);
    if (code.trim().length < 6) { setError('Enter the 6-digit code from your email.'); return; }
    setBusy(true);
    try {
      await verifyLoginCode(email, code);
      // Straight to the profile — signing in is only ever a means to that end.
      router.replace('/dog-profile' as Href);
    } catch {
      setError('That code didn\'t work. Check it and try again, or resend.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.emoji}>🐾</Text>
        <Text style={styles.title}>
          {step === 'email' ? 'Save your dog’s profile' : 'Check your email'}
        </Text>
        <Text style={styles.sub}>
          {step === 'email'
            ? 'Add your dog once, and the AI coach remembers their diet, supplements, and health issues every time you scan.'
            : `We sent a 6-digit code to ${email}. It expires in a few minutes.`}
        </Text>

        {step === 'email' ? (
          <>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor={t.textDim}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              editable={!busy}
              onSubmitEditing={handleSendCode}
              returnKeyType="go"
            />
            <Pressable
              style={[styles.btn, (!emailLooksValid || busy) && styles.btnDisabled]}
              onPress={handleSendCode}
              disabled={!emailLooksValid || busy}
            >
              {busy ? <ActivityIndicator color={t.bg} /> : <Text style={styles.btnText}>Send me a code</Text>}
            </Pressable>
          </>
        ) : (
          <>
            <TextInput
              style={[styles.input, styles.codeInput]}
              value={code}
              onChangeText={(v) => setCode(v.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="123456"
              placeholderTextColor={t.textDim}
              keyboardType="number-pad"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              editable={!busy}
              onSubmitEditing={handleVerify}
              returnKeyType="go"
            />
            <Pressable
              style={[styles.btn, (code.length < 6 || busy) && styles.btnDisabled]}
              onPress={handleVerify}
              disabled={code.length < 6 || busy}
            >
              {busy ? <ActivityIndicator color={t.bg} /> : <Text style={styles.btnText}>Verify &amp; continue</Text>}
            </Pressable>
            <Pressable onPress={() => { setStep('email'); setCode(''); setError(null); }} disabled={busy}>
              <Text style={styles.link}>Use a different email</Text>
            </Pressable>
          </>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable onPress={() => router.back()} disabled={busy}>
          <Text style={styles.skip}>Not now</Text>
        </Pressable>

        <Text style={styles.fine}>
          We only use your email to save your dog’s profile and sign you in. Scanning always works
          without an account.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: t.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: space.xl, gap: space.md },
  emoji: { fontSize: 44, textAlign: 'center' },
  title: {
    fontSize: type.size.xl, fontWeight: type.weight.heavy, color: t.text,
    textAlign: 'center',
  },
  sub: {
    fontSize: type.size.md, color: t.textMuted, textAlign: 'center',
    lineHeight: 20, marginBottom: space.sm,
  },
  input: {
    backgroundColor: t.surface, borderWidth: 1, borderColor: t.border,
    borderRadius: radius.md, paddingHorizontal: space.lg, paddingVertical: space.md,
    fontSize: type.size.lg, color: t.text,
  },
  codeInput: { textAlign: 'center', letterSpacing: 8, fontWeight: type.weight.bold },
  btn: {
    backgroundColor: t.good, borderRadius: radius.md, paddingVertical: space.md,
    alignItems: 'center', justifyContent: 'center', minHeight: 50,
  },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: t.bg, fontSize: type.size.lg, fontWeight: type.weight.bold },
  link: { color: t.good, fontSize: type.size.md, textAlign: 'center', paddingVertical: space.sm },
  skip: { color: t.textMuted, fontSize: type.size.md, textAlign: 'center', paddingVertical: space.md },
  error: {
    color: t.critical, fontSize: type.size.md, textAlign: 'center',
    backgroundColor: t.criticalTint, padding: space.md, borderRadius: radius.sm,
  },
  fine: {
    fontSize: type.size.xs, color: t.textDim, textAlign: 'center',
    lineHeight: 16, marginTop: space.sm,
  },
});
