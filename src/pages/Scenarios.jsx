const Label = ({ children }) => (
  <label className="block text-xs text-blue-100/80 mb-1">{children}</label>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full bg-[#0b1228] text-white border border-white/15 rounded-xl px-3 py-2 outline-none focus:border-blue-400"
  />
);

export default function Scenarios({ inputs, setInputs, onBack, onContinue }) {
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
