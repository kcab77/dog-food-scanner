/**
 * Dog profile — the memory the AI coach reads on every question.
 *
 * Fields map 1:1 to the `dog_profiles` table. Everything except the name is
 * optional and free-text on purpose: owners describe a dog in their own words
 * ("7ish, rescue"), and forcing dropdowns would lose the detail that actually
 * makes the AI's answers specific.
 *
 * Colours come only from lib/theme.ts (the project forbids raw hex in components).
 */
import { useCallback, useEffect, useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router, type Href } from 'expo-router';
import t, { radius, space, type } from '../lib/theme';
import {
  getSession, getDogProfile, saveDogProfile, signOut, EMPTY_PROFILE,
} from '../lib/supabase';

type Profile = typeof EMPTY_PROFILE;

const FIELDS: {
  key: keyof Profile; label: string; placeholder: string; hint?: string; multiline?: boolean;
}[] = [
  { key: 'dog_name', label: "Dog's name", placeholder: 'Hershey' },
  { key: 'breed', label: 'Breed', placeholder: 'Labrador mix' },
  { key: 'age', label: 'Age', placeholder: '8 years' },
  { key: 'weight', label: 'Weight', placeholder: '75 lbs' },
  {
    key: 'diet', label: 'What they eat', multiline: true,
    placeholder: 'Freeze-dried raw + gently cooked, one raw egg each morning',
    hint: 'Brands and rough proportions help the most.',
  },
  {
    key: 'supplements', label: 'Supplements', multiline: true,
    placeholder: 'Fish oil, probiotic, liver & kidney support',
    hint: 'So the coach never suggests something you already give.',
  },
  {
    key: 'conditions', label: 'Health issues', multiline: true,
    placeholder: 'Lipomas, runs hot, sensitive stomach',
    hint: 'The most important field — this is what tailors the advice.',
  },
  {
    key: 'goals', label: "What you're working on", multiline: true,
    placeholder: 'Reduce lipomas, transition fully off kibble',
  },
];

export default function DogProfileScreen() {
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) { router.replace('/login' as Href); return; }
      const existing = await getDogProfile();
      if (existing) setProfile({ ...EMPTY_PROFILE, ...stripNulls(existing) });
      setLoading(false);
    })();
  }, []);

  const update = useCallback((key: keyof Profile, value: string) => {
    setProfile((p) => ({ ...p, [key]: value }));
    setSaved(false);
    setError(null);
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await saveDogProfile(profile);
      setSaved(true);
      setTimeout(() => router.back(), 700);
    } catch (e) {
      setError((e as Error).message || "Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.replace('/' as Href);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={t.good} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>
          {profile.dog_name ? `${profile.dog_name}'s profile` : 'Your dog'}
        </Text>
        <Text style={styles.sub}>
          The AI coach reads this every time you ask a question, so its answers fit your dog
          instead of a generic one. You can change it any time.
        </Text>

        {FIELDS.map((f) => (
          <View key={f.key} style={styles.field}>
            <Text style={styles.label}>
              {f.label}
              {f.key === 'dog_name' && <Text style={styles.req}> *</Text>}
            </Text>
            <TextInput
              style={[styles.input, f.multiline && styles.inputMulti]}
              value={profile[f.key]}
              onChangeText={(v) => update(f.key, v)}
              placeholder={f.placeholder}
              placeholderTextColor={t.textDim}
              multiline={f.multiline}
              autoCapitalize={f.key === 'dog_name' ? 'words' : 'sentences'}
              editable={!saving}
            />
            {f.hint && <Text style={styles.hint}>{f.hint}</Text>}
          </View>
        ))}

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.btn, (saving || !profile.dog_name.trim()) && styles.btnDisabled]}
          onPress={handleSave}
          disabled={saving || !profile.dog_name.trim()}
        >
          {saving
            ? <ActivityIndicator color={t.bg} />
            : <Text style={styles.btnText}>{saved ? '✓ Saved' : 'Save profile'}</Text>}
        </Pressable>

        <Pressable onPress={() => router.back()} disabled={saving}>
          <Text style={styles.secondary}>Cancel</Text>
        </Pressable>
        <Pressable onPress={handleSignOut} disabled={saving}>
          <Text style={styles.signout}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** DB nulls would render as the string "null" in a TextInput. */
function stripNulls(row: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(row)) out[k] = v == null ? '' : String(v);
  return out;
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: t.bg },
  center: { flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: space.xl, gap: space.md, paddingBottom: space.xxl * 2 },
  title: { fontSize: type.size.xl, fontWeight: type.weight.heavy, color: t.text },
  sub: { fontSize: type.size.md, color: t.textMuted, lineHeight: 20, marginBottom: space.sm },
  field: { gap: space.xs },
  label: { fontSize: type.size.base, fontWeight: type.weight.bold, color: t.text },
  req: { color: t.critical },
  input: {
    backgroundColor: t.surface, borderWidth: 1, borderColor: t.border,
    borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: space.md,
    fontSize: type.size.lg, color: t.text,
  },
  inputMulti: { minHeight: 78, textAlignVertical: 'top' },
  hint: { fontSize: type.size.xs, color: t.textDim, lineHeight: 15 },
  btn: {
    backgroundColor: t.good, borderRadius: radius.md, paddingVertical: space.md,
    alignItems: 'center', justifyContent: 'center', minHeight: 50, marginTop: space.md,
  },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: t.bg, fontSize: type.size.lg, fontWeight: type.weight.bold },
  secondary: { color: t.textMuted, fontSize: type.size.md, textAlign: 'center', paddingVertical: space.md },
  signout: { color: t.textDim, fontSize: type.size.base, textAlign: 'center', paddingVertical: space.sm },
  error: {
    color: t.critical, fontSize: type.size.md, backgroundColor: t.criticalTint,
    padding: space.md, borderRadius: radius.sm,
  },
});
