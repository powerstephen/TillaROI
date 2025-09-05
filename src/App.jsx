import kaizoLogo from "./assets/kaizo-logo.svg";
import resultsHero from "./assets/results-hero.png";

import { useMemo, useState } from "react";

/* ---------- math / formatting ---------- */
const defaultInputs = {
  agents: 25,
  agentCostYear: 60000,
  ticketsPerMonth: 30000,
  aht: 7,
  hoursYear: 2080,
  currency: "$",
  ahtReductionPct: 12,
  qaHoursBaseline: 6,
  qaAutomationPct: 70,
  managerHoursSaved: 1.5,
  revenueProtected: 0,
};
const fmtMoney = (v, cur = "$") =>
  `${cur}${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
function computeOutputs(i) {
  const hourlyCost = i.agentCostYear / i.hoursYear;
  const minutesSavedPerTicket = i.aht * (i.ahtReductionPct / 100);
  const hoursSavedPerMonth = (i.ticketsPerMonth * minutesSavedPerTicket) / 60;
  const ahtSavings = hoursSavedPerMonth * 12 * hourlyCost;
  const qaHoursSavedPerAgentYear = i.qaHoursBaseline * (i.qaAutomationPct / 100) * 12;
  const qaSavings = qaHoursSavedPerAgentYear * i.agents * hourlyCost;
  const mgrSavings = i.managerHoursSaved * 12 * i.agents * hourlyCost;
  const total = ahtSavings + qaSavings + mgrSavings + i.revenueProtected;
  return { hourlyCost, ahtSavings, qaSavings, mgrSavings, total };
}

/* ---------- shared UI bits ---------- */
const Card = ({ title, children }) => (
  <section className="bg-[#111936] border border-white/10 rounded-2xl p-4 shadow-md mb-4">
    <h2 className="text-base font-semibold mb-2">{title}</h2>
    {children}
  </section>
);
const Row2 = ({ children }) => <div className="grid md:grid-cols-2 gap-3">{children}</div>;
const Label = ({ children }) => (
  <label className="block text-xs text-blue-100/80 mb-1">{children}</label>
);
const Input = (props) => (
  <input
    {...props}
    className="w-full bg-[#0b1228] text-white border border-white/15 rounded-xl px-3 py-2 outline-none focus:border-blue-400"
  />
);
const KPI = ({ label, value, big }) => (
  <div className="flex items-center justify-between bg-[#0c1430] border border-white/10 rounded-xl px-3 py-2">
    <div className="text-xs text-blue-100/80">{label}</div>
    <div className={big ? "text-lg font-semibold text-emerald-400" : "font-semibold"}>{value}</div>
  </div>
);

/* ---------- step screens (inline) ---------- */
function Stepper({ step }) {
  const common = "flex-1 h-2 rounded-full";
  return (
    <div className="mt-4 flex items-center gap-2">
      <div className={`${common} ${step >= 1 ? "bg-emerald-400" : "bg-white/10"}`} />
      <div className={`${common} ${step >= 2 ? "bg-emerald-400" : "bg-white/10"}`} />
      <div className={`${common} ${step >= 3 ? "bg-emerald-400" : "bg-white/10"}`} />
    </div>
  );
}

function Inputs({ inputs, setInputs, onContinue }) {
  const set = (k) => (e) =>
    setInputs((p) => ({ ...p, [k]: e.target.type === "number" ? +e.target.value : e.target.value }));
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Team & Cost Assumptions">
          <Row2>
            <div>
              <Label>Number of agents</Label>
              <Input type="number" min="1" step="1" value={inputs.agents} onChange={set("agents")} />
            </div>
            <div>
              <Label>Fully-loaded cost per agent / year (USD)</Label>
              <Input type="number" min="0" step="500" value={inputs.agentCostYear} onChange={set("agentCostYear")} />
            </div>
          </Row2>
          <Row2>
            <div>
              <Label>Tickets per month (total)</Label>
              <Input type="number" min="0" step="100" value={inputs.ticketsPerMonth} onChange={set("ticketsPerMonth")} />
            </div>
            <div>
              <Label>Baseline AHT (minutes)</Label>
              <Input type="number" min="0" step="0.1" value={inputs.aht} onChange={set("aht")} />
            </div>
          </Row2>
          <Row2>
            <div>
              <Label>Work hours per agent / year</Label>
              <Input type="number" min="1" step="10" value={inputs.hoursYear} onChange={set("hoursYear")} />
            </div>
            <div>
              <Label>Currency symbol</Label>
              <Input type="text" value={inputs.currency} onChange={set("currency")} />
            </div>
          </Row2>
        </Card>

        <Card title="Expected Kaizo Impact">
          <Row2>
            <div>
              <Label>AHT reduction (%) via coaching insights</Label>
              <Input type="number" min="0" max="100" step="1" value={inputs.ahtReductionPct} onChange={set("ahtReductionPct")} />
            </div>
            <div>
              <Label>QA hours per agent / month (baseline manual)</Label>
              <Input type="number" min="0" step="0.5" value={inputs.qaHoursBaseline} onChange={set("qaHoursBaseline")} />
            </div>
          </Row2>
          <Row2>
            <div>
              <Label>QA automation coverage with Kaizo (%)</Label>
              <Input type="number" min="0" max="100" step="1" value={inputs.qaAutomationPct} onChange={set("qaAutomationPct")} />
            </div>
            <div>
              <Label>Manager coaching hours saved / agent / month</Label>
              <Input type="number" min="0" step="0.1" value={inputs.managerHoursSaved} onChange={set("managerHoursSaved")} />
            </div>
          </Row2>
          <div>
            <Label>Optional: Annual revenue protected from CSAT uplift (USD)</Label>
            <Input type="number" min="0" step="1000" value={inputs.revenueProtected} onChange={set("revenueProtected")} />
            <p className="text-xs text-blue-200/70 mt-1">If you expect fewer churned customers or upsell gains, add a conservative estimate here.</p>
          </div>
        </Card>
      </div>

      <div className="flex justify-end mt-4">
        <button className="px-4 py-2 rounded-xl border border-white/15 bg-[#0b1228]" onClick={onContinue}>
          Continue
        </button>
      </div>
    </>
  );
}

function Scenarios({ inputs, setInputs, onBack, onContinue }) {
  const set = (k) => (e) =>
    setInputs((p) => ({ ...p, [k]: e.target.type === "number" ? +e.target.value : e.target.value }));
  return (
    <section className="bg-[#111936] border border-white/10 rounded-2xl p-4 shadow-md">
      <h2 className="text-base font-semibold mb-4">Scenario Planner</h2>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <Label>Scenario AHT reduction (%)</Label>
          <Input type="number" min="0" max="100" step="1" value={inputs.ahtReductionPct} onChange={set("ahtReductionPct")} />
        </div>
        <div>
          <Label>Scenario QA automation (%)</Label>
          <Input type="number" min="0" max="100" step="1" value={inputs.qaAutomationPct} onChange={set("qaAutomationPct")} />
        </div>
        <div>
          <Label>Scenario manager hours saved / agent / month</Label>
          <Input type="number" min="0" step="0.1" value={inputs.managerHoursSaved} onChange={set("managerHoursSaved")} />
        </div>
        <div>
          <Label>Scenario revenue protected (annual)</Label>
          <Input type="number" min="0" step="1000" value={inputs.revenueProtected} onChange={set("revenueProtected")} />
        </div>
      </div>
      <p className="text-xs text-blue-200/70 mt-2">Tune assumptions here — you’ll see the totals on the next screen.</p>

      <div className="flex justify-between mt-4">
        <button className="px-4 py-2 rounded-xl border border-white/15 bg-[#0b1228]" onClick={onBack}>
          Back
        </button>
        <button className="px-4 py-2 rounded-xl border border-white/15 bg-[#0b1228]" onClick={onContinue}>
          Continue
        </button>
      </div>
    </section>
  );
}

function Results({ inputs, outputs, onBack, onRestart }) {
  const download = () => {
    const rows = [
      ["Metric", "Value"],
      ["Number of agents", inputs.agents],
      ["Cost per agent / year", inputs.agentCostYear],
      ["Tickets per month", inputs.ticketsPerMonth],
      ["Baseline AHT (min)", inputs.aht],
      ["AHT reduction %", inputs.ahtReductionPct],
      ["QA hours baseline / agent / month", inputs.qaHoursBaseline],
      ["QA automation %", inputs.qaAutomationPct],
      ["Manager hours saved / agent / month", inputs.managerHoursSaved],
      ["Revenue protected (annual)", inputs.revenueProtected],
      ["AHT labor savings (annual)", Math.round(outputs.ahtSavings)],
      ["QA automation savings (annual)", Math.round(outputs.qaSavings)],
      ["Manager time savings (annual)", Math.round(outputs.mgrSavings)],
      ["Total annual impact", Math.round(outputs.total)],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kaizo-roi-snapshot.csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 500);
  };

  return (
    <section className="bg-[#111936] border border-white/10 rounded-2xl p-4 shadow-md">
      <h2 className="text-base font-semibold mb-4">Annual Impact (Estimated)</h2>
      <div className="space-y-2">
        <KPI label="Labor savings from faster handling (AHT)" value={fmtMoney(outputs.ahtSavings, inputs.currency)} />
        <KPI label="Labor savings from QA automation" value={fmtMoney(outputs.qaSavings, inputs.currency)} />
        <KPI label="Manager time savings" value={fmtMoney(outputs.mgrSavings, inputs.currency)} />
        <KPI label="Revenue protected (optional)" value={fmtMoney(inputs.revenueProtected, inputs.currency)} />
        <KPI label="Total Annual Impact" value={fmtMoney(outputs.total, inputs.currency)} big />
        <p className="text-xs text-blue-200/70">All figures are directional estimates for planning. Adjust inputs to fit your environment.</p>
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl border border-white/15 bg-[#0b1228]" onClick={onBack}>
            Back
          </button>
          <button className="px-4 py-2 rounded-xl border border-white/15 bg-[#0b1228]" onClick={onRestart}>
            Start Over
          </button>
        </div>
        <button className="px-4 py-2 rounded-xl border border-white/15 bg-[#0b1228]" onClick={download}>
          Download CSV
        </button>
      </div>
    </section>
  );
}

/* ---------- main App ---------- */
export default function App() {
  const [step, setStep] = useState(1);              // 1=Inputs, 2=Scenarios, 3=Results
  const [inputs, setInputs] = useState(defaultInputs);
  const outputs = useMemo(() => computeOutputs(inputs), [inputs]);

  const go = (n) => () => setStep(n);

  return (
    <div className="min-h-screen text-slate-100 bg-gradient-to-b from-[#0b1020] via-[#0b1020] to-[#0e1530]">
      <header className="max-w-4xl mx-auto px-5 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.7)]" />
          <h1 className="text-xl font-semibold tracking-tight">
            Kaizo ROI Calculator — Step {step} of 3
          </h1>
        </div>
        <Stepper step={step} />
      </header>

      <main className="max-w-4xl mx-auto px-5 pb-8">
        {step === 1 && <Inputs inputs={inputs} setInputs={setInputs} onContinue={go(2)} />}
        {step === 2 && (
          <Scenarios inputs={inputs} setInputs={setInputs} onBack={go(1)} onContinue={go(3)} />
        )}
        {step === 3 && (
          <Results inputs={inputs} outputs={outputs} onBack={go(2)} onRestart={go(1)} />
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-5 pb-8 text-xs text-blue-200/70">
        Demo for Kaizo interview. Client-side only. Build: {new Date().toISOString()}
      </footer>
    </div>
  );
}
