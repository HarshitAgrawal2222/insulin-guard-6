import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
const Ctx = createContext()
export const useSim = () => useContext(Ctx)
const fmt = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const seed = Array.from({ length: 30 }, (_, i) => ({ t: `-${30 - i}`, temp: +(5 + Math.sin(i / 4) * 0.8).toFixed(1) }))
const baseAlerts = [
  { id: 1, type: 'Low Battery', severity: 'Warning', time: '08:42', container: 'INS-001', desc: 'Battery dropped below 25% during a previous trip.', status: 'Resolved' },
  { id: 2, type: 'Lid Open', severity: 'Warning', time: '07:15', container: 'INS-001', desc: 'Lid was open for 40 seconds at pickup.', status: 'Resolved' },
  { id: 3, type: 'Temperature Too High', severity: 'Critical', time: 'Yesterday', container: 'INS-001', desc: 'Temperature reached 9.1°C for 3 minutes.', status: 'Resolved' }
]
export const getStatus = s => {
  if (!s.sensor) return { level: 'critical', label: 'SENSOR DISCONNECTED', note: 'Temperature cannot be verified' }
  if (s.temp > s.hi) return { level: 'critical', label: 'TEMPERATURE CRITICAL', note: 'Too high' }
  if (s.temp < s.lo) return { level: 'critical', label: 'TEMPERATURE CRITICAL', note: 'Too low' }
  if (s.lid === 'open') return { level: 'warning', label: 'LID OPEN', note: 'Close the lid immediately' }
  if (s.battery < 20) return { level: 'warning', label: 'LOW BATTERY', note: 'Charge or swap power source' }
  if (s.temp > s.hi - 0.8 || s.temp < s.lo + 0.8) return { level: 'warning', label: 'TEMPERATURE WARNING', note: 'Approaching limit' }
  return { level: 'safe', label: 'INSULIN SAFE', note: 'All systems normal' }
}
export function SimProvider({ children }) {
  const [s, setS] = useState({ temp: 5.2, battery: 82, cooling: true, lid: 'closed', gps: true, sensor: true, scenario: 'normal', demo: true, online: true, locked: false, step: 2, updated: fmt(new Date()), history: seed, humidity: 46, lo: 2, hi: 8, esp: 'disconnected', espHost: '', autoCool: true, sound: true, notify: true })
  const [alerts, setAlerts] = useState(baseAlerts)
  const [toasts, setToasts] = useState([])
  const [ack, setAck] = useState(false)
  const [medicines, setMedicines] = useState([{ id: 1, name: 'Insulin (Regular)', lo: 2, hi: 8 }, { id: 2, name: 'Insulin (Glargine)', lo: 2, hi: 8 }, { id: 3, name: 'Vaccine (General)', lo: 2, hi: 8 }])
  const [selectedId, setSelectedId] = useState(1)
  const wsRef = useRef(null)
  const toast = useCallback((msg, type = 'info') => {
    const id = Math.random()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])
  const tick = useCallback(() => setS(p => {
    if (!p.sensor || p.esp === 'connected') return p
    const mid = (p.lo + p.hi) / 2
    const target = p.scenario === 'high' ? p.hi + 2.4 : p.scenario === 'low' ? p.lo - 1.2 : p.cooling ? mid : p.hi + 0.6
    const temp = +(p.temp + (target - p.temp) * 0.25 + (Math.random() - 0.5) * 0.3).toFixed(1)
    const battery = p.scenario === 'battery' ? 12 : Math.max(0, +(p.battery - 0.05).toFixed(2))
    const time = fmt(new Date())
    return { ...p, temp, battery, cooling: p.autoCool && temp > p.hi - 1 ? true : p.cooling, updated: time, humidity: Math.round(46 + (Math.random() - 0.5) * 4), history: [...p.history.slice(-39), { t: time, temp }] }
  }), [])
  useEffect(() => { const i = setInterval(tick, 2000); return () => clearInterval(i) }, [tick])
  const addAlert = (type, severity, desc) => setAlerts(a => [{ id: Date.now(), type, severity, time: fmt(new Date()), container: 'INS-001', desc, status: 'Active' }, ...a])
  const setScenario = name => {
    setAck(false)
    setS(p => {
      const n = { ...p, scenario: name, lid: 'closed', sensor: true }
      if (name === 'lid') n.lid = 'open'
      if (name === 'sensor') n.sensor = false
      if (name === 'normal') n.temp = (p.lo + p.hi) / 2
      return n
    })
    const map = { high: ['Temperature Too High', 'Critical', 'Temperature exceeded the safe range.'], low: ['Temperature Too Low', 'Critical', 'Temperature fell below the safe range.'], battery: ['Low Battery', 'Warning', 'Battery below 20%.'], lid: ['Lid Open', 'Warning', 'Container lid was opened.'], sensor: ['Sensor Disconnected', 'Critical', 'DS18B20 stopped responding.'] }
    if (map[name]) { addAlert(...map[name]); if (s.notify) toast(map[name][0], 'error') } else toast('Demo reset to normal', 'success')
  }
  const lvlRef = useRef('safe')
  useEffect(() => {
    const l = getStatus(s).level
    if (l === 'critical' && lvlRef.current !== 'critical' && s.sound) {
      try {
        const c = new (window.AudioContext || window.webkitAudioContext)()
        const o = c.createOscillator()
        o.connect(c.destination)
        o.frequency.value = 880
        o.start()
        setTimeout(() => { o.stop(); c.close() }, 400)
      } catch {}
    }
    lvlRef.current = l
  }, [s])
  const selectMedicine = id => {
    const m = medicines.find(x => x.id === id)
    if (!m) return
    setSelectedId(id)
    setS(p => ({ ...p, lo: m.lo, hi: m.hi }))
    toast(`${m.name} selected (${m.lo}–${m.hi}°C)`, 'success')
  }
  const addMedicine = (name, lo, hi) => {
    const m = { id: Date.now(), name, lo, hi }
    setMedicines(a => [...a, m])
    toast('Medicine added', 'success')
  }
  const removeMedicine = id => {
    setMedicines(a => a.filter(x => x.id !== id))
    toast('Medicine removed', 'warn')
  }
  const connectEsp = host => {
    if (wsRef.current) wsRef.current.close()
    setS(p => ({ ...p, esp: 'connecting', espHost: host }))
    try {
      const ws = new WebSocket(`ws://${host}:81`)
      ws.onopen = () => { setS(p => ({ ...p, esp: 'connected' })); toast('ESP32 connected', 'success') }
      ws.onmessage = e => {
        try {
          const d = JSON.parse(e.data)
          setS(p => {
            const temp = typeof d.temperature === 'number' ? d.temperature : p.temp
            const time = fmt(new Date())
            return { ...p, temp, battery: d.battery ?? p.battery, cooling: d.cooling ?? p.cooling, lid: d.lid ?? p.lid, gps: d.gps ?? p.gps, sensor: d.sensor ?? p.sensor, humidity: d.humidity ?? p.humidity, updated: time, history: [...p.history.slice(-39), { t: time, temp }] }
          })
        } catch {}
      }
      ws.onerror = () => toast('Could not reach ESP32', 'error')
      ws.onclose = () => setS(p => ({ ...p, esp: 'disconnected' }))
      wsRef.current = ws
    } catch {
      setS(p => ({ ...p, esp: 'disconnected' }))
      toast('Invalid ESP32 address', 'error')
    }
  }
  const disconnectEsp = () => { if (wsRef.current) wsRef.current.close(); toast('ESP32 disconnected, using simulated data', 'warn') }
  const act = {
    cooling: on => { if (wsRef.current?.readyState === 1) wsRef.current.send(JSON.stringify({ cmd: 'cooling', value: on })); setS(p => ({ ...p, cooling: on })); toast(on ? 'Cooling started' : 'Cooling stopped', on ? 'success' : 'warn') },
    lock: () => { setS(p => ({ ...p, locked: !p.locked })); toast('Container lock updated', 'success') },
    refresh: () => { tick(); toast('Sensor data refreshed', 'success') },
    resolve: id => { setAlerts(a => a.map(x => x.id === id ? { ...x, status: 'Resolved' } : x)); toast('Alert resolved', 'success') },
    sos: () => { addAlert('Emergency SOS', 'Critical', 'Delivery partner triggered an emergency alert.'); toast('SOS sent to support and emergency contact', 'error') },
    step: n => setS(p => ({ ...p, step: n })),
    toggle: k => setS(p => ({ ...p, [k]: !p[k] }))
  }
  const temps = s.history.map(h => h.temp)
  const stats = { min: Math.min(...temps), max: Math.max(...temps), avg: +(temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1), outside: temps.filter(t => t < s.lo || t > s.hi).length * 2 }
  return <Ctx.Provider value={{ medicines, selectedId, selectMedicine, addMedicine, removeMedicine, connectEsp, disconnectEsp, s, alerts, toasts, toast, act, setScenario, stats, status: getStatus(s), ack, setAck }}>{children}</Ctx.Provider>
}
