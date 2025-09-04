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
        <button className="px-4 py-2 rounded-xl border border-white/15 bg-[#0b1228]" onCli
