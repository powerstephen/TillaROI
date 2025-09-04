import { fmtMoney } from "../lib/calc.js";

function KPI({ label, value, big }) {
  return (
    <div className="flex items-center justify-between bg-[#0c1430] border border-white/10 rounded-xl px-3 py-2">
      <div className="text-xs text-blue-100/80">{label}</div>
      <div className={big ? "text-lg font-semibold text-emerald-400" : "font-semibold"}>{value}</div>
    </div>
  );
}

export default function Results({ inputs, outputs, onBack, onRestart }) {
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
      ["Total annual impact", Math.round(outputs.total)]
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
