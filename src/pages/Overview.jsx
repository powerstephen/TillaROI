import { fmtMoney } from "../lib/calc.js";

const Card = ({ title, children }) => (
  <section className="bg-[#111936] border border-white/10 rounded-2xl p-4 shadow-md mb-4">
    <h2 className="text-base font-semibold mb-2">{title}</h2>
    {children}
  </section>
);

const Row2 = ({ children }) => (
  <div className="grid md:grid-cols-2 gap-3">{children}</div>
);

const Label = ({ children }) => (
  <label className="block text-xs text-blue-100/80 mb-1">{children}</label>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full bg-[#0b1228] text-white border border-white/15 rounded-xl px-3 py-2 outline-none focus:border-blue-400"
  />
);

export default function Overview({ inputs, setInputs, outputs }) {
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
            <p className="text-xs text-blue-200/70 mt-1">
              If you expect fewer churned customers or upsell gains, add a conservative estimate here.
            </p>
          </div>
        </Card>
      </div>

      <Card title="Annual Impact (Estimated)">
        <div className="space-y-2">
          <KPI label="Labor savings from faster handling (AHT)" value={fmtMoney(outputs.ahtSavings, inputs.currency)} />
          <KPI label="Labor savings from QA automation" value={fmtMoney(outputs.qaSavings, inputs.currency)} />
          <KPI label="Manager time savings" value={fmtMoney(outputs.mgrSavings, inputs.currency)} />
          <KPI label="Revenue protected (optional)" value={fmtMoney(inputs.revenueProtected, inputs.currency)} />
          <KPI label={<span className="text-lg">Total Annual Impact</span>} value={<span className="text-lg text-emerald-400">{fmtMoney(outputs.total, inputs.currency)}</span>} />
          <p className="text-xs text-blue-200/70">All figures are directional estimates for planning. Adjust inputs to fit your environment.</p>
        </div>
      </Card>
    </>
  );
}

function KPI({ label, value }) {
  return (
    <div className="flex items-center justify-between bg-[#0c1430] border border-white/10 rounded-xl px-3 py-2">
      <div className="text-xs text-blue-100/80">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
