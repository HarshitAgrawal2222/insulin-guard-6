import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Truck, Box, Thermometer, Bell, History, User, LogOut, X, Battery, BatteryLow, BatteryFull, ShieldCheck, ShieldAlert, Loader2, CheckCircle2, Sun, Moon, HeartPulse, Pill, FileText, Settings as SettingsIcon } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceArea, ResponsiveContainer } from 'recharts'
import { useSim } from '../hooks/useSim'
import { colors, solid } from '../theme'
export const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard }, { to: '/delivery', label: 'Active Delivery', icon: Truck },
  { to: '/container', label: 'Smart Container', icon: Box }, { to: '/temperature', label: 'Temperature', icon: Thermometer },
  { to: '/alerts', label: 'Alerts', icon: Bell }, { to: '/history', label: 'Delivery History', icon: History }, { to: '/reports', label: 'Reports', icon: FileText }, { to: '/profile', label: 'Profile', icon: User }, { to: '/settings', label: 'Settings', icon: SettingsIcon }
]
const lvl = { safe: 'bg-teal-600', warning: 'bg-teal-600', critical: 'bg-teal-600' }
export const Switch = ({ checked, onChange, small }) => (
  <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative shrink-0 rounded-full transition-colors duration-300 ${small ? 'w-9 h-5' : 'w-11 h-6'} ${checked ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
    <span className={`absolute top-0.5 left-0.5 rounded-full bg-[#ffffff] shadow transition-transform duration-300 ${small ? 'w-4 h-4' : 'w-5 h-5'} ${checked ? (small ? 'translate-x-4' : 'translate-x-5') : ''}`} />
  </button>
)
export const ThemeToggle = () => {
  const [d, setD] = useState(() => document.documentElement.classList.contains('dark'))
  const set = () => { const v = !d; setD(v); document.documentElement.classList.toggle('dark', v); try { localStorage.setItem('theme', v ? 'dark' : 'light') } catch {} }
  return (
    <button onClick={set} aria-label="Toggle theme" className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-between px-2 transition-colors">
      <Sun size={14} className="text-amber-500" /><Moon size={14} className="text-slate-400 dark:text-sky-300" />
      <span className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-[#ffffff] shadow flex items-center justify-center transition-transform duration-300 ${d ? 'translate-x-6' : ''}`}>{d ? <Moon size={14} className="text-slate-700" /> : <Sun size={14} className="text-amber-500" />}</span>
    </button>
  )
}
export const Sidebar = () => {
  const { s } = useSim()
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border border-slate-100 rounded-3xl p-5 m-3 h-[calc(100vh-1.5rem)] sticky top-3 shadow-card bg-white">
      <div className="flex items-center gap-3 mb-8"><div className="w-11 h-11 rounded-2xl text-white flex items-center justify-center shadow-lg" style={{ background: solid.brand }}><HeartPulse size={24} /></div><div><div className="font-extrabold text-lg leading-none text-slate-800">InsuGuard</div><div className="text-[11px] text-slate-500 mt-1">Care on the move</div></div></div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(n => <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}><n.icon size={18} />{n.label}</NavLink>)}
      </nav>
      <div className="rounded-2xl bg-teal-50 p-3 mb-3 text-xs"><div className="font-semibold text-teal-700 flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${s.sensor ? 'bg-emerald-500' : 'bg-red-500'}`} />INS-001</div><div className="text-slate-500 mt-1">{s.esp === 'connected' ? 'ESP32 live data' : 'Simulated data'}</div></div>
      <NavLink to="/login" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:text-red-600"><LogOut size={18} />Logout</NavLink>
    </aside>
  )
}
export const MobileNavbar = () => (
  <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-100 flex justify-around py-1.5">
    {[navItems[0], navItems[1], navItems[2], navItems[4], navItems[7]].map(n => <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `flex flex-col items-center text-[10px] px-2 py-1 ${isActive ? 'text-teal-700' : 'text-slate-500'}`}><n.icon size={20} />{n.label.split(' ')[0]}</NavLink>)}
  </nav>
)
export const BatteryIndicator = ({ value }) => {
  const I = value < 20 ? BatteryLow : value > 80 ? BatteryFull : Battery
  return <span className={`inline-flex items-center gap-1 font-semibold ${value < 20 ? 'text-red-600' : 'text-emerald-600'}`}><I size={18} />{Math.round(value)}%</span>
}
export const TemperatureIndicator = ({ value }) => {
  const { s } = useSim()
  const c = value > s.hi || value < s.lo ? 'text-red-600' : value > s.hi - 0.8 || value < s.lo + 0.8 ? 'text-amber-500' : 'text-emerald-600'
  return <span className={`font-bold transition-all ${c}`}>{value.toFixed(1)}°C</span>
}
export const SafetyBanner = () => {
  const { s, status, medicines, selectedId } = useSim()
  const med = medicines.find(m => m.id === selectedId)
  const Icon = status.level === 'safe' ? ShieldCheck : ShieldAlert
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-card ${status.level === 'critical' ? 'animate-pulse' : ''}`} style={{ background: solid[status.level === 'safe' ? 'safe' : status.level === 'warning' ? 'warning' : 'critical'] }}>
      <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-white/10" />
      <svg className="absolute inset-x-0 bottom-0 w-full h-16 opacity-40" viewBox="0 0 400 60" preserveAspectRatio="none"><path className="ecg" pathLength="400" d="M0 35 H90 L105 35 L115 10 L128 55 L140 35 H220 L235 35 L245 15 L258 50 L270 35 H400" fill="none" stroke="#fff" strokeWidth="2" /></svg>
      <div className="relative flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0"><Icon size={32} /></div>
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center gap-1 text-[11px] bg-white/20 rounded-full px-2.5 py-1 mb-2"><Pill size={12} />{med?.name} · {s.lo}–{s.hi}°C</span>
          <div className="text-lg font-extrabold tracking-wide flex items-center"><span className="relative flex w-2.5 h-2.5 mr-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" /></span>{status.label}</div>
          <div className="text-sm opacity-90">{status.note}</div>
        </div>
        <div className="text-right"><div className="text-4xl font-extrabold">{s.sensor ? `${s.temp.toFixed(1)}°` : '--'}</div><div className="text-xs opacity-90">Range {s.lo}–{s.hi}°C</div></div>
      </div>
    </div>
  )
}
export const StatusCard = ({ icon: Icon, label, value, sub, tone = 'text-teal-700' }) => (
  <div className="card"><div className="flex items-center gap-2 text-slate-500 text-xs mb-2"><span className="p-2 rounded-xl bg-teal-50 text-teal-600"><Icon size={16} /></span>{label}</div><div className={`text-2xl font-bold ${tone}`}>{value}</div>{sub && <div className="text-xs text-slate-400">{sub}</div>}</div>
)
export const TemperatureChart = ({ height = 220 }) => {
  const { s } = useSim()
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={s.history}>
        <ReferenceArea y1={s.lo} y2={s.hi} fill={colors.safe} fillOpacity={0.08} />
        <XAxis dataKey="t" hide /><YAxis domain={[Math.min(0, s.lo - 2), s.hi + 5]} width={28} tick={{ fontSize: 11, fill: colors.muted }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.15)' }} />
        <Area type="monotone" dataKey="temp" stroke={colors.primary} strokeWidth={2} fill={colors.primary} fillOpacity={0.15} isAnimationActive={false} /></AreaChart>
    </ResponsiveContainer>
  )
}
export const ContainerVisualization = () => {
  const { s } = useSim()
  return (
    <div className="relative mx-auto w-64 max-w-full">
      <div className={`h-6 rounded-t-2xl border-2 origin-left transition-transform duration-500 ${s.lid === 'open' ? '-rotate-12 border-amber-400 bg-amber-100' : 'border-teal-600 bg-teal-100'}`} />
      <div className="border-2 border-t-0 border-teal-600 rounded-b-2xl bg-sky-50 p-4 grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }, (_, i) => <div key={i} className="h-16 rounded-lg bg-white border border-sky-200 flex flex-col items-center justify-center text-[10px] text-sky-700 shadow-sm"><div className="w-3 h-8 rounded-sm bg-sky-400/70" />Insulin</div>)}
        <div className="col-span-3 text-center text-sm font-semibold"><TemperatureIndicator value={s.temp} /></div>
      </div>
    </div>
  )
}
export const DeliveryTimeline = ({ step }) => {
  const steps = ['Medicine Picked Up', 'Container Sealed', 'In Transit', 'Near Destination', 'Delivered']
  return (
    <ol>{steps.map((t, i) => (
      <li key={t} className="flex gap-3"><div className="flex flex-col items-center"><div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white transition-colors ${i <= step ? 'bg-teal-600' : 'bg-slate-300'}`}>{i < step ? <CheckCircle2 size={14} /> : i + 1}</div>{i < 4 && <div className={`w-0.5 h-8 ${i < step ? 'bg-teal-600' : 'bg-slate-200'}`} />}</div>
        <div className={`text-sm pt-0.5 ${i <= step ? 'font-semibold' : 'text-slate-400'}`}>{t}</div></li>))}
    </ol>
  )
}
export const AlertCard = ({ a, onResolve }) => (
  <div className={`card page border-l-4 ${a.severity === 'Critical' ? 'border-l-red-500' : 'border-l-amber-400'}`}>
    <div className="flex justify-between items-start gap-2"><div><div className="font-semibold">{a.type}</div><div className="text-sm text-slate-500">{a.desc}</div></div>
      <span className={`text-xs px-2 py-1 rounded-full ${a.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{a.status}</span></div>
    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs text-slate-400"><span>{a.severity} · {a.container} · {a.time}</span>
      {a.status !== 'Resolved' && <button className="btn-o !py-1 !text-xs" onClick={() => onResolve(a.id)}>Resolve</button>}</div>
  </div>
)
export const ConfirmationModal = ({ open, title, text, onConfirm, onCancel, danger }) => open ? (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"><div className="card max-w-sm w-full page"><div className="flex justify-between mb-2"><h3 className="font-bold">{title}</h3><button onClick={onCancel}><X size={18} /></button></div>
    <p className="text-sm text-slate-600 mb-4">{text}</p><div className="flex gap-2 justify-end"><button className="btn-o" onClick={onCancel}>Cancel</button><button className={danger ? 'btn-d' : 'btn-p'} onClick={onConfirm}>Confirm</button></div></div></div>
) : null
export const LoadingSpinner = () => <div className="flex justify-center p-10 text-teal-600"><Loader2 className="animate-spin" /></div>
export const ToastNotification = () => {
  const { toasts } = useSim()
  const c = { success: 'bg-emerald-600', error: 'bg-red-600', warn: 'bg-amber-500', info: 'bg-slate-800' }
  return <div className="fixed top-4 right-4 z-[60] space-y-2">{toasts.map(t => <div key={t.id} className={`page text-white text-sm px-4 py-2.5 rounded-xl shadow-lg ${c[t.type]}`}>{t.msg}</div>)}</div>
}
export const NotificationPanel = ({ onClose }) => {
  const { alerts } = useSim()
  return <div className="absolute right-0 top-12 w-72 card shadow-xl z-40 page"><div className="flex justify-between mb-2 font-semibold text-sm">Notifications<button onClick={onClose}><X size={16} /></button></div>
    {alerts.slice(0, 4).map(a => <div key={a.id} className="text-xs py-2 border-t border-slate-100"><b>{a.type}</b><div className="text-slate-500">{a.time}</div></div>)}</div>
}
