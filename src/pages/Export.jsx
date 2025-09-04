import { fmtMoney } from "../lib/calc.js";

export default function Export({ inputs, outputs }) {
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
      <h2 className="text-base font-semibold mb-4">Shareable Summary</h2>
      <ul className="text-sm space-y-1">
        <li>• Total annual impact: <strong className="text-emerald-400">{fmtMoney(outputs.total, inputs.currency)}</strong></li>
        <li>• Key drivers: AHT reduction, QA automation, manager time saved</li>
        <li>• Add optional “revenue protected” to reflect CSAT/retention uplifts</li>
      </ul>
      <button className="mt-4 px-3 py-2 rounded-xl border border-white/15 bg-[#0b1228]" onClick={download}>
        Download CSV
      </button>
      <div className="text-xs text-blue-200/70 mt-3">
        For a Kaizo-branded version, drop in logo/brand colors or wire to product data later.
      </div>
    </section>
  );
}
