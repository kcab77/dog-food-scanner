import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

const supabaseUrl = 'https://dyzupdctgejwyuocqbtw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5enVwZGN0Z2Vqd3l1b2NxYnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODgxMTksImV4cCI6MjA4ODI2NDExOX0.-wjlNLrlIAgFVtWKTKO9ZknXhT_8bxcWBvfjj1BWB2U'

const getStorage = () => {
  if (Platform.OS === 'web') return undefined
  const AsyncStorage = require('@react-native-async-storage/async-storage').default
  return AsyncStorage
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getStorage(),
    autoRefreshToken: true,
    persistSession: Platform.OS !== 'web',
    detectSessionInUrl: false,
  },
})

// ---------------------------------------------------------------------------
// Auth — email one-time code (no password to forget, no reset flow to build).
// A 6-digit code is used rather than a magic link because tapping a link on a
// phone often opens the wrong browser and never returns to the app.
// ---------------------------------------------------------------------------

/** Send a 6-digit sign-in code. Creates the account if it's a new email. */
export async function sendLoginCode(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email: String(email).trim().toLowerCase(),
    options: { shouldCreateUser: true },
  });
  if (error) throw new Error(error.message);
  return true;
}

/** Exchange the emailed code for a signed-in session. */
export async function verifyLoginCode(email, code) {
  const { data, error } = await supabase.auth.verifyOtp({
    email: String(email).trim().toLowerCase(),
    token: String(code).trim(),
    type: 'email',
  });
  if (error) throw new Error(error.message);
  return data.session ?? null;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
}

export async function signOut() {
  await supabase.auth.signOut();
}

// ---------------------------------------------------------------------------
// Dog profile — one per account. Row Level Security scopes every read/write to
// the signed-in user, so no user_id filtering is needed (or trusted) here.
// ---------------------------------------------------------------------------

export const EMPTY_PROFILE = {
  dog_name: '', breed: '', age: '', weight: '',
  diet: '', supplements: '', conditions: '', goals: '',
};

/** Returns the signed-in user's dog profile, or null if none saved yet. */
export async function getDogProfile() {
  const session = await getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('dog_profiles')
    .select('dog_name, breed, age, weight, diet, supplements, conditions, goals')
    .maybeSingle();
  if (error) return null;
  return data;
}

/** Create or update the profile. dog_name is the only required field. */
export async function saveDogProfile(profile) {
  const session = await getSession();
  if (!session) throw new Error('Please sign in first.');
  const name = String(profile.dog_name ?? '').trim();
  if (!name) throw new Error("Please enter your dog's name.");

  const row = {
    user_id: session.user.id,
    dog_name: name,
    breed: profile.breed?.trim() || null,
    age: profile.age?.trim() || null,
    weight: profile.weight?.trim() || null,
    diet: profile.diet?.trim() || null,
    supplements: profile.supplements?.trim() || null,
    conditions: profile.conditions?.trim() || null,
    goals: profile.goals?.trim() || null,
    updated_at: new Date().toISOString(),
  };
  // One profile per account (user_id is unique), so upsert keeps this idempotent.
  const { error } = await supabase.from('dog_profiles').upsert(row, { onConflict: 'user_id' });
  if (error) throw new Error(error.message);
  return true;
}

/**
 * Log a scan. Fire-and-forget: never blocks the UI, never surfaces an error.
 *
 * `user_id` is attached only when someone is signed in, and stays null otherwise —
 * scanning works signed-out and stays anonymous, which is the default experience.
 * That nullable column is what makes per-user scan history possible later without
 * forcing anyone to create an account first.
 *
 * The RLS policy requires user_id to be either null or the caller's own id, so a
 * client can't attribute a scan to somebody else.
 */
export async function logScan({ productName, score, processingMethod, ingredientCount, scanMethod }) {
  try {
    // Don't let an auth hiccup cost us the scan row — fall back to anonymous.
    let userId = null;
    try {
      const { data } = await supabase.auth.getSession();
      userId = data?.session?.user?.id ?? null;
    } catch (_) {}

    await supabase.from('scans').insert({
      product_name: productName,
      score,
      processing_method: processingMethod,
      ingredient_count: ingredientCount,
      scan_method: scanMethod,
      platform: Platform.OS,
      user_id: userId,
      // Flags scans made from a dev/simulator build so Kyle's own testing can be
      // filtered out of the numbers. `__DEV__` is false in TestFlight/App Store
      // builds, so this catches development testing but NOT testing on a release
      // build — which is why user_id above matters as the second signal.
      is_dev: typeof __DEV__ !== 'undefined' ? __DEV__ : false,
    });
  } catch (_) {
    // fire-and-forget — never block the UI
  }
}

/**
 * A signed-in user's own scan history, newest first. Returns [] when signed out.
 * RLS ("own scans readable") enforces the scoping server-side — this is not the
 * only thing standing between one user and another's data.
 */
export async function getMyScans(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('id, product_name, score, processing_method, scan_method, scanned_at')
      .order('scanned_at', { ascending: false })
      .limit(limit);
    if (error) return [];
    return data ?? [];
  } catch (_) {
    return [];
  }
}

export async function submitFeedback(message) {
  try {
    await supabase.from('feedback').insert({
      message,
      platform: Platform.OS,
    });
    return true;
  } catch (_) {
    return false;
  }
}