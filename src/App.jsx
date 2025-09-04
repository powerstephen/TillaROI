import { useEffect, useMemo, useState } from "react";
import Overview from "./pages/Overview.jsx";
import Scenarios from "./pages/Scenarios.jsx";
import Teams from "./pages/Teams.jsx";
import Export from "./pages/Export.jsx";
import { defaultInputs, computeOutputs } from "./lib/calc.js";

const routes = ["overview", "scenarios", "teams", "export"];

function useHashRoute() {
  const [route, setRoute] = useState(() => {
    const h = window.location.hash.replace("#/", "") || "overview";
    return routes.includes(h) ? h : "overview";
  });
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace("#/", "") || "overview";
      setRoute(routes.includes(h) ? h : "overview");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return [route, (r) => (window.location.hash = `#/${r}`)];
}

export default function App() {
  const [route, nav] = useHashRoute();

  // Single source of truth for inputs across screens
  const [inputs, setInputs] = useState(defaultInputs);
  const outputs = useMemo(() => computeOutputs(inputs), [inputs]);

  const Tab = ({ to, children }) => (
    <button
      onClick={() => nav(to)}
      className={[
        "px-3 py-2 rounded-xl border",
        route === to
          ? "border-blue-400 ring-2 ring-blue-400/30"
          : "border-white/10",
        "bg-[#0b1228] text-white"
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen text-slate-100 bg-gradient-to-b from-[#0b1020] via-[#0b1020] to-[#0e1530]">
      <header className="max-w-5xl mx-auto px-5 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.7)]" />
          <h1 className="text-xl font-semibold tracking-tight">Kaizo ROI Calculator</h1>
        </div>
        <nav className="flex gap-2">
          <Tab to="overview">Overview</Tab>
          <Tab to="scenarios">Scenarios</Tab>
          <Tab to="teams">Team Presets</Tab>
          <Tab to="export">Export</Tab>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-5 pb-8">
        {route === "overview" && (
          <Overview inputs={inputs} setInputs={setInputs} outputs={outputs} />
        )}
        {route === "scenarios" && (
          <Scenarios inputs={inputs} setInputs={setInputs} />
        )}
        {route === "teams" && (
          <Teams setInputs={setInputs} />
        )}
        {route === "export" && (
          <Export inputs={inputs} outputs={outputs} />
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-5 pb-8 text-xs text-blue-200/70">
        Demo for Kaizo interview. Client-side only. Build: {new Date().toISOString()}
      </footer>
    </div>
  );
}
