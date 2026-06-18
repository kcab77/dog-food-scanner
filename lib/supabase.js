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

export async function logScan({ productName, score, processingMethod, ingredientCount, scanMethod }) {
  try {
    await supabase.from('scans').insert({
      product_name: productName,
      score,
      processing_method: processingMethod,
      ingredient_count: ingredientCount,
      scan_method: scanMethod,
      platform: Platform.OS,
    });
  } catch (_) {
    // fire-and-forget — never block the UI
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