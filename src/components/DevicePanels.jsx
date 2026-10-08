import { useState } from 'react'
import { Pill, Trash2, Plus, Cpu, Wifi, WifiOff } from 'lucide-react'
import { useSim } from '../hooks/useSim'
import { ConfirmationModal } from './ui'
export const MedicineSelector = () => {
  const { medicines, selectedId, selectMedicine, addMedicine, removeMedicine, toast } = useSim()
  const [del, setDel] = useState(null)
  const [f, setF] = useState({ name: '', lo: '', hi: '' })
  const add = e => {
    e.preventDefault()
    const lo = parseFloat(f.lo), hi = parseFloat(f.hi)
    if (!f.name.trim() || isNaN(lo) || isNaN(hi) || lo >= hi) return toast('Enter a name and a valid range', 'error')
    addMedicine(f.name.trim(), lo, hi)
    setF({ name: '', lo: '', hi: '' })
  }
  const target = medicines.find(m => m.id === del)
  return (
    <div className="card page">
      <div className="flex items-center gap-2 font-semibold mb-3"><Pill size={18} className="text-teal-600" />Stored medicine</div>
      <div className="space-y-2">
        {medicines.map(m => (
          <div key={m.id} onClick={() => selectMedicine(m.id)} className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${m.id === selectedId ? 'border-teal-600 bg-teal-50' : 'border-slate-200 hover:bg-slate-50'}`}>
            <div><div className="text-sm font-semibold">{m.name}</div><div className="text-xs text-slate-500">Safe range {m.lo}°C – {m.hi}°C</div></div>
            <div className="flex items-center gap-2">
              {m.id === selectedId && <span className="text-xs text-teal-700 font-semibold">Active</span>}
              {m.id !== selectedId && <button onClick={e => { e.stopPropagation(); setDel(m.id) }} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={add} className="mt-3 grid grid-cols-[1fr_64px_64px_auto] gap-2">
        <input className="inp" placeholder="Medicine name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
        <input className="inp" placeholder="Min" value={f.lo} onChange={e => setF({ ...f, lo: e.target.value })} />
        <input className="inp" placeholder="Max" value={f.hi} onChange={e => setF({ ...f, hi: e.target.value })} />
        <button className="btn-p"><Plus size={16} /></button>
      </form>
      <ConfirmationModal open={!!target} danger title="Remove medicine?" text={`${target?.name} will be removed from the list.`} onCancel={() => setDel(null)} onConfirm={() => { removeMedicine(del); setDel(null) }} />
    </div>
  )
}
export const Esp32Connect = () => {
  const { s, connectEsp, disconnectEsp, toast } = useSim()
  const [host, setHost] = useState(s.espHost || '192.168.4.1')
  const on = s.esp === 'connected'
  const tone = on ? 'bg-emerald-50 text-emerald-700' : s.esp === 'connecting' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
  const go = () => { if (!host.trim()) return toast('Enter the ESP32 IP address', 'error'); connectEsp(host.trim()) }
  return (
    <div className="card page">
      <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2 font-semibold"><Cpu size={18} className="text-teal-600" />ESP32 connection</div>
        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${tone}`}>{on ? <Wifi size={12} /> : <WifiOff size={12} />}{on ? 'Live data' : s.esp === 'connecting' ? 'Connecting' : 'Simulated data'}</span></div>
      <label className="text-xs text-slate-500">ESP32 IP address</label>
      <input className="inp mb-3" value={host} onChange={e => setHost(e.target.value)} disabled={on} placeholder="192.168.1.50" />
      {on ? <button className="btn-d w-full" onClick={disconnectEsp}>Disconnect</button> : <button className="btn-p w-full" onClick={go} disabled={s.esp === 'connecting'}>{s.esp === 'connecting' ? 'Connecting...' : 'Connect to ESP32'}</button>}
      <p className="text-xs text-slate-400 mt-3">Connects over WebSocket on port 81. Use the same Wi-Fi network as the ESP32, or its access point address.</p>
    </div>
  )
}
