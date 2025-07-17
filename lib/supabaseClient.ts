// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wzmfprzmogvzgbdqlvyn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bWZwcnptb2d2emdiZHFsdnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NDE1MjksImV4cCI6MjA2ODAxNzUyOX0.eNvKT5zEoxksFIiy2Y4iS03MEsArq74dVDfQT0W7MkA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)