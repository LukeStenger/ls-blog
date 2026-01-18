import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://penctdxcnvndjkxmfbbo.supabase.co'
const supabaseAnonKey = 'sb_publishable_0Sh0Jf-gDrJz8Xt1wnkKcw_4AzIT3da'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)