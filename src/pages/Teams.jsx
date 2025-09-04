const presets = [
  { name: "Startup Support", agents: 10, ticketsPerMonth: 8000, aht: 6.5 },
  { name: "Scale-up Team", agents: 40, ticketsPerMonth: 45000, aht: 7.0 },
  { name: "Enterprise Ops", agents: 120, ticketsPerMonth: 150000, aht: 8.0 }
];

export default function Teams({ setInputs }) {
  const apply = (p) => {
    setInputs((prev) => ({ ...prev, ...p }));
    window.location.hash = "#/overview";
  };

  return (
    <section className="bg-[#111936] border border-white/10 rounded-2xl p-4 shadow-md">
      <h2 className="text-base font-semibold mb-4">Team Presets</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-blue-100/80">
              <th className="px-3 py-2 bg-[#0c1430] border border-white/10 rounded-l-lg">Preset</th>
              <th className="px-3 py-2 bg-[#0c1430] border border-white/10">Agents</th>
              <th className="px-3 py-2 bg-[#0c1430] border border-white/10">Tickets/mo</th>
              <th className="px-3 py-2 bg-[#0c1430] border border-white/10">AHT (min)</th>
              <th className="px-3 py-2 bg-[#0c1430] border border-white/10 rounded-r-lg">Apply</th>
            </tr>
          </thead>
          <tbody>
            {presets.map((p) => (
              <tr key={p.name}>
                <td className="px-3 py-2 bg-[#0c1430] border border-white/10 rounded-l-lg">{p.name}</td>
                <td className="px-3 py-2 bg-[#0c1430] border border-white/10">{p.agents}</td>
                <td className="px-3 py-2 bg-[#0c1430] border border-white/10">{p.ticketsPerMonth}</td>
                <td className="px-3 py-2 bg-[#0c1430] border border-white/10">{p.aht}</td>
                <td className="px-3 py-2 bg-[#0c1430] border border-white/10 rounded-r-lg">
                  <button
                    className="px-3 py-2 rounded-xl border border-white/15 bg-[#0b1228]"
                    onClick={() => apply(p)}
                  >
                    Use
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-blue-200/70 mt-2">Click a preset to push values to Overview.</p>
    </section>
  );
}
