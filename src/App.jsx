import { useState, useEffect } from 'react'
import { Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, FlaskConical, Siren } from 'lucide-react'
import { Sidebar, MobileNavbar, ToastNotification, NotificationPanel, LoadingSpinner, Switch, ThemeToggle, ConfirmationModal } from './components/ui'
import { useSim } from './hooks/useSim'
import { Login, Dashboard, Delivery, Container, Temperature, Alerts, HistoryPage, Profile, Reports, Settings } from './pages/pages'
const DemoPanel = () => {
  const { s, setScenario, act } = useSim()
  const opts = [['normal', 'Normal'], ['high', 'High temp'], ['low', 'Low temp'], ['battery', 'Low battery'], ['lid', 'Lid open'], ['sensor', 'Sensor off']]
  return (
    <div className="card !p-3 flex items-center gap-2 flex-wrap text-xs">
      <div className="flex items-center gap-2 font-semibold text-sm mr-2"><FlaskConical size={16} className="text-teal-600" />Demo Mode<Switch checked={s.demo} onChange={() => act.toggle('demo')} /></div>
      {s.demo && opts.map(([k, l]) => <button key={k} onClick={() => setScenario(k)} className={`px-2.5 py-1 rounded-full border ${s.scenario === k ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 bg-white'}`}>{l}</button>)}
    </div>
  )
}
const Header = () => {
  const { s, act, alerts } = useSim()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [sos, setSos] = useState(false)
  const n = alerts.filter(a => a.status === 'Active').length
  const h = new Date().getHours()
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  return (
    <header className="flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 sticky top-0 z-20">
      <div><div className="font-bold">{greet}, Rahul</div><div className="flex items-center gap-2 text-xs text-slate-500 mt-1"><Switch small checked={s.online} onChange={() => act.toggle('online')} />{s.online ? 'Online' : 'Offline'}</div></div>
      <div className="flex items-center gap-3 relative"><button className="btn-d !px-3 !py-1.5 !text-xs" onClick={() => setSos(true)}><Siren size={14} />SOS</button><ConfirmationModal open={sos} danger title="Send emergency SOS?" text="Support and your emergency contact will be alerted with your location." onCancel={() => setSos(false)} onConfirm={() => { act.sos(); setSos(false) }} /><ThemeToggle />
        <button className="relative" onClick={() => setOpen(!open)}><Bell size={20} />{n > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{n}</span>}</button>
        <button onClick={() => nav('/profile')} className="flex items-center gap-1"><span className="w-8 h-8 rounded-full bg-teal-600 text-white text-sm flex items-center justify-center">RV</span><ChevronDown size={14} /></button>
        {open && <NotificationPanel onClose={() => setOpen(false)} />}
      </div>
    </header>
  )
}
const Layout = () => {
  const loc = useLocation()
  const [load, setLoad] = useState(true)
  useEffect(() => { setLoad(true); const t = setTimeout(() => setLoad(false), 250); return () => clearTimeout(t) }, [loc.pathname])
  return (
    <div className="flex min-h-screen"><Sidebar />
      <div className="flex-1 min-w-0 pb-20 md:pb-6"><Header />
        <main className="p-4 space-y-4 max-w-6xl mx-auto"><DemoPanel />{load ? <LoadingSpinner /> : <Outlet />}</main></div>
      <MobileNavbar />
    </div>
  )
}
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} /><Route path="delivery" element={<Delivery />} /><Route path="container" element={<Container />} />
          <Route path="temperature" element={<Temperature />} /><Route path="alerts" element={<Alerts />} /><Route path="history" element={<HistoryPage />} /><Route path="reports" element={<Reports />} /><Route path="profile" element={<Profile />} /><Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastNotification />
    </>
  )
}
