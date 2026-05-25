import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { isSupabaseConfigured } from './lib/supabase.ts'

if (!isSupabaseConfigured) {
  document.getElementById('root')!.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f172a;font-family:sans-serif;padding:24px">
      <div style="background:#1e293b;border:1px solid #334155;border-radius:16px;padding:40px;max-width:480px;width:100%;text-align:center">
        <div style="font-size:48px;margin-bottom:16px">⚙️</div>
        <h1 style="color:#f1f5f9;font-size:22px;margin:0 0 12px">Missing Environment Variables</h1>
        <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px">
          This app requires Supabase credentials to run.<br/>
          Add the following to your Vercel project settings under <strong style="color:#e2e8f0">Environment Variables</strong>:
        </p>
        <div style="background:#0f172a;border-radius:8px;padding:16px;text-align:left;font-family:monospace;font-size:12px;color:#7dd3fc;margin-bottom:24px">
          VITE_SUPABASE_URL<br/>
          VITE_SUPABASE_ANON_KEY<br/>
          VITE_OPENROUTER_API_KEY
        </div>
        <p style="color:#64748b;font-size:12px;margin:0">Then redeploy your project on Vercel.</p>
      </div>
    </div>
  `
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
