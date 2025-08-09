import React, { useEffect, useMemo, useState } from 'react'
import logoUrl from '/tilla-logo.svg'

const fmtCurrency = (n) => (Number.isFinite(n) ? n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) : '-')
const fmtNumber   = (n) => (Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '-')
const fmtPercent  = (n) => (Number.isFinite(n) ? `${(n * 100).toFixed(1)}%` : '-')

const presets = {
  'Cruise': {
    avgCrewPerVessel: 800, changesPerMonthPerVessel: 3.0, averageTravelCostPerChange: 1500,
    latePremiumToday: 0.15, latePremiumWithTilla: 0.07,
    adminHoursPerChangeToday: 7.0, adminHoursPerChangeWithTilla: 4.0,
    adminHoursPerNewHireToday: 4.0, adminHoursPerNewHireWithTilla: 2.0,
    breachesToday: 3.0, breachesWithTilla: 2.0, breachCost: 30000,
  },
  'Cargo/Heavy Goods': {
    avgCrewPerVessel: 22, changesPerMonthPerVessel: 2.0, averageTravelCostPerChange: 1000,
    latePremiumToday: 0.10, latePremiumWithTilla: 0.05,
    adminHoursPerChangeToday: 5.0, adminHoursPerChangeWithTilla: 3.0,
    adminHoursPerNewHireToday: 3.0, adminHoursPerNewHireWithTilla: 1.5,
    breachesToday: 2.0, breachesWithTilla: 1.0, breachCost: 15000,
  },
  'Offshore/Energy': {
    avgCrewPerVessel: 60, changesPerMonthPerVessel: 2.5, averageTravelCostPerChange: 1200,
    latePremiumToday: 0.12, latePremiumWithTilla: 0.06,
    adminHoursPerChangeToday: 6.0, adminHoursPerChangeWithTilla: 3.5,
    adminHoursPerNewHireToday: 3.5, adminHoursPerNewHireWithTilla: 2.0,
    breachesToday: 3.0, breachesWithTilla: 2.0, breachCost: 25000,
  },
}

const fieldLabels = {
  avgCrewPerVessel: 'Average crew per vessel',
  changesPerMonthPerVessel: 'Crew changes / month / vessel',
  averageTravelCostPerChange: 'Average travel cost per crew change',
  latePremiumToday: 'Late-booking premium (today)',
  latePremiumWithTilla: 'Late-booking premium (with Tilla)',
  adminHoursPerChangeToday: 'Admin hours per crew change (today)',
  adminHoursPerChangeWithTilla: 'Admin hours per crew change (with Tilla)',
  breachesToday: 'Compliance breaches / year (today)',
  breachesWithTilla: 'Compliance breaches / year (with Tilla)',
  breachCost: 'Average total cost per breach',
  adminHoursPerNewHireToday: 'Admin hours per new hire (today)',
  adminHoursPerNewHireWithTilla: 'Admin hours per new hire (with Tilla)',
}

const useQueryState = (initial) => {
  const [state, setState] = useState(initial)
  useEffect(() => {
    const p = new URLSearchParams(location.search)
    const s = { ...initial }
    for (const k of Object.keys(initial)) {
      if (p.has(k)) {
        const raw = p.get(k)
        s[k] = k === 'industry' ? raw : Number(raw)
      }
    }
    setState(s)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [state, setState]
}

export default function App(){
  const [qs, setQs] = useQueryState({
    industry: 'Cargo/Heavy Goods',
    vessels: 50,
    hourlyCost: 35,
    turnover: 0.2,
    softwareReplaced: 20000,
    tillaCost: 120000,
  })
  const [overrides, setOverrides] = useState({})

  const preset = presets[qs.industry]
  const getVal = (key) => {
    const ov = overrides[key]
    const v = ov === undefined || ov === null || ov === '' ? preset[key] : parseFloat(ov)
    return Number.isFinite(v) ? v : 0
  }

  const effective = useMemo(() => ({
    avgCrewPerVessel: getVal('avgCrewPerVessel'),
    changesPerMonthPerVessel: getVal('changesPerMonthPerVessel'),
    averageTravelCostPerChange: getVal('averageTravelCostPerChange'),
    latePremiumToday: getVal('latePremiumToday'),
    latePremiumWithTilla: getVal('latePremiumWithTilla'),
    adminHoursPerChangeToday: getVal('adminHoursPerChangeToday'),
    adminHoursPerChangeWithTilla: getVal('adminHoursPerChangeWithTilla'),
    breachesToday: getVal('breachesToday'),
    breachesWithTilla: getVal('breachesWithTilla'),
    breachCost: getVal('breachCost'),
    adminHoursPerNewHireToday: getVal('adminHoursPerNewHireToday'),
    adminHoursPerNewHireWithTilla: getVal('adminHoursPerNewHireWithTilla'),
  }), [qs.industry, overrides])

  // Calculations
  const annualCrewChanges = qs.vessels * effective.changesPerMonthPerVessel * 12
  const totalCrew = qs.vessels * effective.avgCrewPerVessel
  const adminHoursSavedPerChange = Math.max(effective.adminHoursPerChangeToday - effective.adminHoursPerChangeWithTilla, 0)
  const adminSavings = adminHoursSavedPerChange * annualCrewChanges * qs.hourlyCost
  const travelSavings = (effective.latePremiumToday - effective.latePremiumWithTilla) * effective.averageTravelCostPerChange * annualCrewChanges
  const complianceSavings = Math.max(effective.breachesToday - effective.breachesWithTilla, 0) * effective.breachCost
  const newHiresPerYear = totalCrew * qs.turnover
  const turnoverSavings = Math.max(effective.adminHoursPerNewHireToday - effective.adminHoursPerNewHireWithTilla, 0) * newHiresPerYear * qs.hourlyCost
  const totalGross = adminSavings + travelSavings + complianceSavings + turnoverSavings + qs.softwareReplaced
  const netSavings = totalGross - qs.tillaCost
  const roi = qs.tillaCost > 0 ? netSavings / qs.tillaCost : 0
  const paybackMonths = netSavings > 0 ? Math.ceil((qs.tillaCost / netSavings) * 12 * 10) / 10 : null

  const handleOverrideChange = (key, value) => setOverrides((o) => ({ ...o, [key]: value }))
  const resetOverrides = () => setOverrides({})

  const shareUrl = () => {
    const p = new URLSearchParams()
    p.set('industry', qs.industry)
    p.set('vessels', String(qs.vessels))
    p.set('hourlyCost', String(qs.hourlyCost))
    p.set('turnover', String(qs.turnover))
    p.set('softwareReplaced', String(qs.softwareReplaced))
    p.set('tillaCost', String(qs.tillaCost))
    const url = `${location.origin}${location.pathname}?${p.toString()}`
    navigator.clipboard.writeText(url)
    alert('Shareable link copied to clipboard!')
  }

  const Header = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={logoUrl} alt="Tilla" className="h-8 w-auto" />
        <span className="badge">ROI Calculator</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={shareUrl} className="btn">Share link</button>
        <a href="https://www.tilla.technology" target="_blank" rel="noreferrer" className="btn btn-primary">Learn about Tilla</a>
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <Header />

      {/* Hero */}
      <section className="card p-6 bg-gradient-to-r from-white to-[#f5fbff]">
        <h1 className="text-3xl font-semibold text-tilla-ink">Quantify your crew-ops ROI</h1>
        <p className="text-slate-600 mt-1">Estimate savings from digitising crew rotation workflows across admin, travel, compliance and turnover.</p>
      </section>

      {/* Industry + inputs */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <label>Industry</label>
          <select value={qs.industry} onChange={(e)=>setQs(s=>({...s, industry:e.target.value}))} className="mt-1">
            {Object.keys(presets).map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <p className="text-xs text-slate-500 mt-2">Switching industry updates defaults; you can still override any field below.</p>
        </div>

        <div className="card p-4">
          <label>Number of vessels</label>
          <input type="number" className="mt-1" value={qs.vessels} onChange={(e)=>setQs(s=>({...s, vessels:Number(e.target.value)||0}))} />
          <label className="mt-3">Admin hourly fully-loaded cost</label>
          <input type="number" className="mt-1" value={qs.hourlyCost} onChange={(e)=>setQs(s=>({...s, hourlyCost:Number(e.target.value)||0}))} />
        </div>

        <div className="card p-4">
          <label>Annual crew turnover (%)</label>
          <input type="number" step="0.01" className="mt-1" value={qs.turnover} onChange={(e)=>setQs(s=>({...s, turnover:Number(e.target.value)||0}))} />
          <label className="mt-3">Current software/process annual cost replaced</label>
          <input type="number" className="mt-1" value={qs.softwareReplaced} onChange={(e)=>setQs(s=>({...s, softwareReplaced:Number(e.target.value)||0}))} />
          <label className="mt-3">Tilla annual subscription cost</label>
          <input type="number" className="mt-1" value={qs.tillaCost} onChange={(e)=>setQs(s=>({...s, tillaCost:Number(e.target.value)||0}))} />
        </div>
      </section>

      {/* Overrides */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Industry parameters (override any):</h2>
          <button onClick={resetOverrides} className="btn">Reset overrides</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(fieldLabels).map(key => (
            <div key={key} className="card p-4">
              <label className="mb-1">{fieldLabels[key]}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step={key.includes('premium') ? '0.01' : '1'}
                  className="flex-1"
                  placeholder={`${presets[qs.industry][key]}`}
                  value={overrides[key] ?? ''}
                  onChange={(e)=>handleOverrideChange(key, e.target.value)}
                />
                <span className="text-xs text-slate-500 w-28">
                  Default: {key.includes('premium') ? fmtPercent(presets[qs.industry][key]) : (key.toLowerCase().includes('cost') ? fmtCurrency(presets[qs.industry][key]) : fmtNumber(presets[qs.industry][key]))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold mb-3">Scale & Activity</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Total crew</span><span className="font-medium">{fmtNumber(totalCrew)}</span></div>
            <div className="flex justify-between"><span>Annual crew changes</span><span className="font-medium">{fmtNumber(annualCrewChanges)}</span></div>
            <div className="flex justify-between"><span>Admin hours saved / change</span><span className="font-medium">{adminHoursSavedPerChange.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>New hires / year</span><span className="font-medium">{fmtNumber(Math.round(newHiresPerYear))}</span></div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-3">Savings (annual)</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Admin savings</span><span className="font-medium">{fmtCurrency(adminSavings)}</span></div>
            <div className="flex justify-between"><span>Travel savings</span><span className="font-medium">{fmtCurrency(travelSavings)}</span></div>
            <div className="flex justify-between"><span>Compliance savings</span><span className="font-medium">{fmtCurrency(complianceSavings)}</span></div>
            <div className="flex justify-between"><span>Turnover savings</span><span className="font-medium">{fmtCurrency(turnoverSavings)}</span></div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-3">Outcome</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Total gross savings</span><span className="font-medium">{fmtCurrency(totalGross)}</span></div>
            <div className="flex justify-between"><span>Net savings</span><span className="font-medium">{fmtCurrency(netSavings)}</span></div>
            <div className="flex justify-between"><span>ROI (Net / Tilla)</span><span className="font-medium">{fmtPercent(roi)}</span></div>
            <div className="flex justify-between"><span>Payback period</span><span className="font-medium">{paybackMonths ? `${paybackMonths.toFixed(1)} months` : 'N/A'}</span></div>
          </div>
        </div>
      </section>

      <footer className="text-xs text-slate-500">
        Tip: adjust the industry defaults via overrides to reflect pilot data for a specific prospect.
      </footer>
    </div>
  )
}
