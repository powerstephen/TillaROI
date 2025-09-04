export default function Scenarios({ inputs, setInputs }) {
  const apply = (fields) => {
    setInputs((p) => ({ ...p, ...fields }));
    window.location.hash = "#/overview";
  };

  return (
    <section className="bg-[#111936] border border-white/10 rounded-2xl p-4 shadow-md">
      <h2 className="text-base font-semibold mb-4">Scenario Planner</h2>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Scenario AHT reduction (%)" id="sAht" min={0} max={100} step={1} defaultValue={10} />
        <Field label="Scenario QA automation (%)" id="sQa" min={0} max={100} step={1} defaultValue={60} />
        <Field label="Scenario manager hours saved / agent / month" id="sMgr" min={0} step={0.1} defaultValue={1.0} />
        <Field label="Scenario revenue protected (annual)" id="sRev" min={0} step={1000} defaultValue={0} />
      </div>
      <button
        className="mt-4 px-3 py-2 rounded-xl border border-white/15 bg-[#0b1228]"
        onClick={() => {
          const v = (id) => document.getElementById(id).value;
          apply({
            ahtReductionPct: +v("sAht"),
            qaAutomationPct: +v("sQa"),
            managerHoursSaved: +v("sMgr"),
            revenueProtected: +v("sRev")
          });
        }}
      >
        Apply to Overview
      </button>
      <p className="text-xs text-blue-200/70 mt-2">Use scenarios to pressure-test assumptions before exporting.</p>
    </section>
  );
}

function Field({ label, id, ...rest }) {
  return (
    <div>
      <label className="block text-xs text-blue-100/80 mb-1">{label}</label>
      <input
        id={id}
        type="number"
        className="w-full bg-[#0b1228] text-white border border-white/15 rounded-xl px-3 py-2 outline-none focus:border-blue-400"
        {...rest}
      />
    </div>
  );
}
