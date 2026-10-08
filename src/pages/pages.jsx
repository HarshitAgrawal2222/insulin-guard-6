import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Thermometer, Battery, Truck, ShieldCheck, MapPin, Phone, Navigation, Snowflake, Lock, RefreshCw, Wifi, Search, AlertTriangle, Droplets, HeartPulse, Clock, Download, Printer, Mail, Eye, EyeOff, ArrowRight, LifeBuoy, BatteryFull, DoorClosed } from 'lucide-react'
import { useSim } from '../hooks/useSim'
import { solid } from '../theme'
import { MedicineSelector, Esp32Connect } from '../components/DevicePanels'
import { StatusCard, TemperatureChart, TemperatureIndicator, BatteryIndicator, ContainerVisualization, DeliveryTimeline, AlertCard, ConfirmationModal, LoadingSpinner, SafetyBanner, Switch, ThemeToggle } from '../components/ui'
const Row = ({ k, v }) => <div className="flex justify-between py-1.5 text-sm border-b border-slate-50"><span className="text-slate-500">{k}</span><span className="font-medium">{v}</span></div>
const Title = ({ children }) => <h1 className="text-xl font-bold mb-3">{children}</h1>
export const Login = () => {
  const nav = useNavigate()
  const { toast } = useSim()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const go = e => {
    e.preventDefault()
    if (id.trim().length < 3) return setErr('Enter your registered email or mobile number')
    if (pw.length < 4) return setErr('Password must be at least 4 characters')
    setErr('')
    setBusy(true)
    setTimeout(() => nav('/'), 900)
  }
  const features = [[Thermometer, 'Live temperature monitoring', 'Continuous 2–8°C cold-chain tracking'], [MapPin, 'Real-time delivery tracking', 'Route, ETA and handover status'], [ShieldCheck, 'Instant safety alerts', 'Lid, battery and sensor warnings']]
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden" style={{ background: solid.brand }}>
        <div className="absolute -top-28 -right-24 w-96 h-96 rounded-full bg-white/10" /><div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] rounded-full bg-white/10" />
        <div className="relative flex items-center gap-3"><div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center"><HeartPulse size={24} /></div><div className="text-xl font-extrabold">InsuGuard</div></div>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">Safe insulin, delivered on time.</h2>
          <p className="opacity-90 mt-3">Monitor every container, every degree, every delivery.</p>
          <div className="mt-8 space-y-4">{features.map(([I, t, d]) => <div key={t} className="flex items-start gap-3"><span className="p-2.5 rounded-xl bg-white/15 shrink-0"><I size={18} /></span><div><div className="font-semibold text-sm">{t}</div><div className="text-xs opacity-80">{d}</div></div></div>)}</div>
        </div>
        <div className="relative bg-white text-slate-800 rounded-3xl shadow-xl p-5 max-w-md">
          <div className="flex items-center justify-between"><div><div className="text-xs text-slate-500">Container INS-001</div><div className="text-3xl font-extrabold text-teal-600">5.2°C</div></div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1.5"><ShieldCheck size={14} />INSULIN SAFE</span></div>
          <svg className="w-full h-12 my-2" viewBox="0 0 400 60" preserveAspectRatio="none"><path className="ecg" pathLength="400" d="M0 35 H90 L105 35 L115 10 L128 55 L140 35 H220 L235 35 L245 15 L258 50 L270 35 H400" fill="none" stroke={solid.brand} strokeWidth="2.5" /></svg>
          <div className="grid grid-cols-3 gap-2 text-xs">{[[BatteryFull, 'Battery', '82%'], [Snowflake, 'Cooling', 'ON'], [DoorClosed, 'Lid', 'Closed']].map(([I, k, v]) => <div key={k} className="rounded-2xl bg-slate-50 p-2.5"><div className="flex items-center gap-1 text-slate-500"><I size={12} />{k}</div><div className="font-bold mt-0.5">{v}</div></div>)}</div>
        </div>
      </div>
      <div className="relative flex items-center justify-center p-6">
        <div className="absolute top-5 right-5"><ThemeToggle /></div>
        <form onSubmit={go} className="w-full max-w-md page">
          <div className="lg:hidden flex items-center gap-2 text-teal-700 font-extrabold text-xl mb-8"><HeartPulse />InsuGuard</div>
          <div className="card !p-8 space-y-5 hover:!translate-y-0">
            <div><h1 className="text-2xl font-extrabold">Welcome back</h1><p className="text-sm text-slate-500 mt-1">Sign in to monitor your insulin container</p></div>
            <div><label className="text-xs font-semibold text-slate-500">Email or mobile number</label>
              <div className="relative mt-1.5"><Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input className="inp !pl-10" placeholder="rahul@insuguard.in" value={id} onChange={e => setId(e.target.value)} /></div></div>
            <div><label className="text-xs font-semibold text-slate-500">Password</label>
              <div className="relative mt-1.5"><Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input className="inp !pl-10 !pr-10" type={show ? 'text' : 'password'} placeholder="Enter your password" value={pw} onChange={e => setPw(e.target.value)} />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
            <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 accent-teal-600" />Remember me</label>
              <button type="button" className="text-teal-700 font-semibold" onClick={() => toast('Password reset link sent', 'success')}>Forgot password?</button></div>
            {err && <div className="text-sm text-red-700 bg-red-50 rounded-xl px-3 py-2 page">{err}</div>}
            <button className="btn-p w-full !py-3" disabled={busy}>{busy ? 'Signing in...' : <>Login<ArrowRight size={16} /></>}</button>
            <div className="text-center text-xs text-slate-500">Demo mode: any email and a 4+ character password works</div>
          </div>
          <button type="button" onClick={() => toast('Support will call you shortly')} className="mx-auto mt-5 flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700"><LifeBuoy size={16} />Need help? Contact support</button>
        </form>
      </div>
    </div>
  )
}
export const Dashboard = () => {
  const { s, stats, alerts } = useSim()
  const mins = s.battery * 5.4
  return (
    <div className="space-y-4 page">
      <SafetyBanner />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatusCard icon={Truck} label="Active Delivery" value="ORD-4821" sub="In transit" />
        <StatusCard icon={Thermometer} label="Temperature" value={<TemperatureIndicator value={s.temp} />} sub={`Target ${s.lo}°C – ${s.hi}°C`} />
        <StatusCard icon={Battery} label="Battery" value={<BatteryIndicator value={s.battery} />} />
        <StatusCard icon={ShieldCheck} label="Insulin Safety" value={s.temp >= s.lo && s.temp <= s.hi && s.sensor ? 'SAFE' : 'UNSAFE'} tone={s.temp >= s.lo && s.temp <= s.hi && s.sensor ? 'text-emerald-600' : 'text-red-600'} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatusCard icon={Clock} label="Est. battery runtime" value={`${Math.floor(mins / 60)}h ${Math.round(mins % 60)}m`} sub="At current load" />
        <StatusCard icon={AlertTriangle} label="Active alerts" value={alerts.filter(a => a.status === 'Active').length} sub="Unresolved" tone={alerts.some(a => a.status === 'Active') ? 'text-red-600' : 'text-emerald-600'} />
        <StatusCard icon={MapPin} label="Distance remaining" value="3.8 km" sub="ETA 14 min" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2"><div className="flex justify-between items-end mb-2"><div><div className="text-xs text-slate-500">Live temperature</div><div className="text-3xl"><TemperatureIndicator value={s.temp} /></div></div>
          <div className="text-xs text-slate-500 text-right">Min {stats.min}° · Max {stats.max}°<br />Updated {s.updated}</div></div><TemperatureChart /></div>
        <div className="card"><div className="font-semibold mb-2">Container status</div>
          <Row k="Temperature" v={s.temp >= s.lo && s.temp <= s.hi ? 'Normal' : 'Abnormal'} /><Row k="Cooling" v={s.cooling ? 'ON' : 'OFF'} /><Row k="Lid" v={s.lid === 'open' ? 'Open' : 'Closed'} />
          <Row k="Battery" v={`${Math.round(s.battery)}%`} /><Row k="GPS" v={s.gps ? 'Active' : 'Disabled'} /><Row k="Sensor" v={s.sensor ? 'Connected' : 'Disconnected'} /></div>
      </div>
    </div>
  )
}
export const Delivery = () => {
  const { s, act, toast } = useSim()
  const [confirm, setConfirm] = useState(false)
  const [chk, setChk] = useState([true, true, false, false, false])
  const items = ['Container sealed and locked', 'Cooling system running', 'Temperature within safe range', 'Insulin boxes counted', 'Customer identity verified']
  return (
    <div className="space-y-4 page"><Title>Active Delivery</Title>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card"><Row k="Order ID" v="ORD-4821" /><Row k="Customer" v="Anita Verma" /><Row k="Pickup" v="CityCare Pharmacy, Civil Lines" /><Row k="Delivery" v="42 Shanti Nagar, Raipur" /><Row k="ETA" v="14 min" /><Row k="Distance left" v="3.8 km" /><Row k="Status" v={['Picked up', 'Sealed', 'In transit', 'Near destination', 'Delivered'][s.step]} /></div>
        <div className="card"><DeliveryTimeline step={s.step} /></div>
      </div>
      <div className="card"><div className="flex justify-between mb-2"><div className="font-semibold">Delivery checklist</div><div className="text-xs text-slate-500">{chk.filter(Boolean).length}/{items.length} done</div></div>
        <div className="h-2 rounded-full bg-slate-100 mb-3 overflow-hidden"><div className="h-full bg-teal-600 transition-all" style={{ width: `${chk.filter(Boolean).length / items.length * 100}%` }} /></div>
        {items.map((t, i) => <label key={t} className="flex items-center gap-3 py-1.5 text-sm cursor-pointer"><input type="checkbox" checked={chk[i]} onChange={() => setChk(chk.map((v, j) => j === i ? !v : v))} className="w-4 h-4 accent-teal-600" />{t}</label>)}</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button className="btn-p" onClick={() => { act.step(Math.min(s.step + 1, 3)); toast('Navigation started', 'success') }}><Navigation size={16} />Start Navigation</button>
        <button className="btn-o" onClick={() => toast('Calling customer...')}><Phone size={16} />Contact Customer</button>
        <button className="btn-p !bg-blue-700" disabled={!chk.every(Boolean)} onClick={() => setConfirm(true)}><MapPin size={16} />Mark as Delivered</button>
      </div>
      <ConfirmationModal open={confirm} title="Mark as delivered?" text="Confirm the insulin has been handed over to the customer." onCancel={() => setConfirm(false)} onConfirm={() => { act.step(4); setConfirm(false); toast('Delivery completed', 'success') }} />
    </div>
  )
}
export const Container = () => {
  const { s, act } = useSim()
  const [modal, setModal] = useState(null)
  const [busy, setBusy] = useState(false)
  const refresh = () => { setBusy(true); setTimeout(() => { act.refresh(); setBusy(false) }, 700) }
  const actions = { stop: ['Stop cooling?', 'Insulin may warm above 8°C without cooling.', () => act.cooling(false), true], start: ['Start cooling?', 'The Peltier module will start cooling.', () => act.cooling(true)], lock: [s.locked ? 'Unlock container?' : 'Lock container?', 'The lid will be electronically locked or unlocked.', act.lock] }
  const m = modal && actions[modal]
  return (
    <div className="space-y-4 page"><Title>Smart Container</Title>
      <div className="grid lg:grid-cols-2 gap-4"><MedicineSelector /><Esp32Connect /></div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card flex items-center justify-center py-6"><ContainerVisualization /></div>
        <div className="card"><Row k="Container ID" v="INS-001" /><Row k="Connection" v={s.sensor ? 'Online' : 'Offline'} /><Row k="Temperature" v={<TemperatureIndicator value={s.temp} />} /><Row k="Humidity" v={`${s.humidity}%`} /><Row k="Battery" v={<BatteryIndicator value={s.battery} />} />
          <Row k="Cooling" v={s.cooling ? 'ON' : 'OFF'} /><Row k="Lid" v={s.lid} /><Row k="Lock" v={s.locked ? 'Locked' : 'Unlocked'} /><Row k="GPS" v={s.gps ? 'Active' : 'Disabled'} /><Row k="Last sync" v={s.updated} /></div>
      </div>
      <div className="card page">
        <div className="font-semibold mb-1">Controls</div>
        {[['Cooling system', 'Peltier module', s.cooling, () => setModal(s.cooling ? 'stop' : 'start')], ['Container lock', 'Electronic lid lock', s.locked, () => setModal('lock')]].map(([t, d, v, f]) => (
          <div key={t} className="flex items-center justify-between py-3 border-b border-slate-100"><div><div className="text-sm font-medium">{t}</div><div className="text-xs text-slate-500">{d}</div></div><Switch checked={v} onChange={f} /></div>
        ))}
        {busy ? <LoadingSpinner /> : <button className="btn-o w-full mt-3" onClick={refresh}><RefreshCw size={16} />Refresh sensor data</button>}
      </div>
      <ConfirmationModal open={!!m} title={m?.[0]} text={m?.[1]} danger={m?.[3]} onCancel={() => setModal(null)} onConfirm={() => { m[2](); setModal(null) }} />
    </div>
  )
}
export const Temperature = () => {
  const { s, stats, ack, setAck, toast, status } = useSim()
  const bad = status.level === 'critical' && s.sensor
  const day = Array.from({ length: 24 }, (_, i) => ({ t: `${i}:00`, temp: +(5 + Math.sin(i / 3) * 1.2).toFixed(1) }))
  return (
    <div className="space-y-4 page"><Title>Temperature Monitoring</Title>
      {bad && !ack && <div className="card border-2 border-red-500 bg-red-50 page"><div className="flex gap-2 font-bold text-red-700"><AlertTriangle />Temperature Alert</div><p className="text-sm text-red-700 my-2">Temperature Alert: Insulin storage temperature is outside the recommended range.</p>
        <div className="flex gap-2"><button className="btn-d" onClick={() => { setAck(true); toast('Alert acknowledged', 'success') }}>Acknowledge Alert</button><button className="btn-o" onClick={() => toast('Connecting to support...')}>Contact Support</button></div></div>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3"><StatusCard icon={Thermometer} label="Minimum" value={`${stats.min}°C`} /><StatusCard icon={Thermometer} label="Maximum" value={`${stats.max}°C`} /><StatusCard icon={Thermometer} label="Average" value={`${stats.avg}°C`} /><StatusCard icon={AlertTriangle} label="Time outside range" value={`${stats.outside}s`} tone={stats.outside ? 'text-red-600' : 'text-emerald-600'} /></div>
      <div className="card"><div className="font-semibold mb-2">Live</div><TemperatureChart height={240} /></div>
      <div className="card"><div className="font-semibold mb-2">24-hour history</div><div className="flex items-end gap-1 h-32">{day.map(d => <div key={d.t} title={`${d.t} ${d.temp}°C`} className={`flex-1 rounded-t ${d.temp > 8 || d.temp < 2 ? 'bg-red-500' : d.temp > 7.2 || d.temp < 2.8 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ height: `${d.temp * 10}%` }} />)}</div></div>
    </div>
  )
}
export const Alerts = () => {
  const { alerts, act } = useSim()
  const [f, setF] = useState('All')
  const list = alerts.filter(a => f === 'All' || (f === 'Resolved' ? a.status === 'Resolved' : a.severity === f))
  return (
    <div className="space-y-3 page"><Title>Alerts</Title>
      <div className="flex gap-2">{['All', 'Critical', 'Warning', 'Resolved'].map(x => <button key={x} onClick={() => setF(x)} className={`btn !py-1.5 ${f === x ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200'}`}>{x}</button>)}</div>
      {list.length ? list.map(a => <AlertCard key={a.id} a={a} onResolve={act.resolve} />) : <div className="card text-center text-slate-400 py-10">No alerts in this category</div>}
    </div>
  )
}
const rows = [
  ['DEL-1042', '2026-10-08', 'Rohit Sharma', 'Telibandha', 'INS-001', '28 min', 'Safe', 'Delivered'], ['DEL-1041', '2026-10-08', 'Meera Das', 'Shankar Nagar', 'INS-001', '35 min', 'Safe', 'Delivered'],
  ['DEL-1040', '2026-10-07', 'Kiran Patel', 'Devendra Nagar', 'INS-002', '41 min', 'Excursion', 'Delivered'], ['DEL-1039', '2026-10-07', 'Sunita Rao', 'Avanti Vihar', 'INS-001', '--', 'Safe', 'Cancelled'], ['DEL-1038', '2026-10-06', 'Amit Jain', 'Pandri', 'INS-002', '22 min', 'Safe', 'Delivered']
]
export const HistoryPage = () => {
  const [q, setQ] = useState('')
  const [st, setSt] = useState('All')
  const list = rows.filter(r => r.join(' ').toLowerCase().includes(q.toLowerCase()) && (st === 'All' || r[6] === st || r[7] === st))
  return (
    <div className="space-y-3 page"><Title>Delivery History</Title>
      <div className="flex gap-2 flex-wrap"><div className="relative flex-1 min-w-[180px]"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input className="inp !pl-9" placeholder="Search deliveries" value={q} onChange={e => setQ(e.target.value)} /></div>
        <select className="inp !w-auto" value={st} onChange={e => setSt(e.target.value)}>{['All', 'Safe', 'Excursion', 'Delivered', 'Cancelled'].map(x => <option key={x}>{x}</option>)}</select></div>
      <div className="card overflow-x-auto !p-0"><table className="w-full text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr>{['Delivery ID', 'Date', 'Customer', 'Destination', 'Container', 'Duration', 'Temp Status', 'Status'].map(h => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr></thead>
        <tbody>{list.map(r => <tr key={r[0]} className="border-t border-slate-50">{r.map((c, i) => <td key={i} className="p-3 whitespace-nowrap">{i === 6 ? <span className={`px-2 py-0.5 rounded-full text-xs ${c === 'Safe' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{c}</span> : c}</td>)}</tr>)}</tbody></table>
        {!list.length && <div className="text-center text-slate-400 py-10">No deliveries found</div>}</div>
    </div>
  )
}
export const Profile = () => {
  const { toast } = useSim()
  const [edit, setEdit] = useState(false)
  const [p, setP] = useState({ Name: 'Rahul Verma', Phone: '+91 98765 43210', Email: 'rahul.verma@insuguard.in', 'Partner ID': 'DP-2031', Region: 'Raipur Central', Vehicle: 'CG 04 AB 1234', 'Emergency contact': '+91 91234 56789' })
  return (
    <div className="space-y-3 page"><Title>Profile</Title>
      <div className="card max-w-xl">{Object.entries(p).map(([k, v]) => <div key={k} className="py-2">{edit && k !== 'Partner ID' ? <><label className="text-xs text-slate-500">{k}</label><input className="inp" value={v} onChange={e => setP({ ...p, [k]: e.target.value })} /></> : <Row k={k} v={v} />}</div>)}
        <button className="btn-p mt-3" onClick={() => { if (edit) toast('Profile updated', 'success'); setEdit(!edit) }}>{edit ? 'Save changes' : 'Edit Profile'}</button></div>
    </div>
  )
}

const dl = (name, rows) => {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}
export const Reports = () => {
  const { s, alerts, stats, toast } = useSim()
  const exportTemp = () => { dl('temperature-log.csv', [['Time', 'Temperature (C)'], ...s.history.map(h => [h.t, h.temp])]); toast('Temperature log downloaded', 'success') }
  const exportAlerts = () => { dl('alert-log.csv', [['Type', 'Severity', 'Time', 'Container', 'Status', 'Description'], ...alerts.map(a => [a.type, a.severity, a.time, a.container, a.status, a.desc])]); toast('Alert log downloaded', 'success') }
  return (
    <div className="space-y-4 page"><Title>Reports</Title>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="font-semibold">Temperature log</div><div className="text-xs text-slate-500 mb-3">{s.history.length} readings · avg {stats.avg}°C</div><button className="btn-p w-full" onClick={exportTemp}><Download size={16} />Download CSV</button></div>
        <div className="card"><div className="font-semibold">Alert log</div><div className="text-xs text-slate-500 mb-3">{alerts.length} events recorded</div><button className="btn-p w-full" onClick={exportAlerts}><Download size={16} />Download CSV</button></div>
        <div className="card"><div className="font-semibold">Delivery report</div><div className="text-xs text-slate-500 mb-3">Print or save as PDF</div><button className="btn-o w-full" onClick={() => window.print()}><Printer size={16} />Print report</button></div>
      </div>
      <div className="card"><div className="font-semibold mb-2">Recent excursions</div>
        {alerts.length ? alerts.slice(0, 6).map(a => <Row key={a.id} k={`${a.type} · ${a.time}`} v={a.status} />) : <div className="text-center text-slate-400 py-6">No excursions recorded</div>}</div>
    </div>
  )
}
export const Settings = () => {
  const { s, act } = useSim()
  const rows = [['autoCool', 'Auto cooling control', 'Turn cooling on automatically when temperature nears the upper limit'], ['sound', 'Sound alerts', 'Play a tone when the container goes critical'], ['notify', 'Alert notifications', 'Show pop-up notifications for new alerts'], ['gps', 'Share live location', 'Allow support to track this delivery']]
  return (
    <div className="space-y-3 page"><Title>Settings</Title>
      <div className="card max-w-xl">{rows.map(([k, t, d]) => <div key={k} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0"><div><div className="text-sm font-medium">{t}</div><div className="text-xs text-slate-500">{d}</div></div><Switch checked={s[k]} onChange={() => act.toggle(k)} /></div>)}</div>
    </div>
  )
}
