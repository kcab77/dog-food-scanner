import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dyzupdctgejwyuocqbtw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5enVwZGN0Z2Vqd3l1b2NxYnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODgxMTksImV4cCI6MjA4ODI2NDExOX0.-wjlNLrlIAgFVtWKTKO9ZknXhT_8bxcWBvfjj1BWB2U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})