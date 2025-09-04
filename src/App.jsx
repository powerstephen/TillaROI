import { useMemo, useState } from "react";
import Inputs from "./pages/Inputs.jsx";
import Scenarios from "./pages/Scenarios.jsx";
import Results from "./pages/Results.jsx";
import { defaultInputs, computeOutputs } from "./lib/calc.js";

export default function App() {
  // Steps: 1 = Inputs, 2 = Scenarios, 3 = Results
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState(defaultInputs);
  const outputs = useMemo(() => computeOutputs(inputs), [inputs]);

  const go = (n) => () => setStep(n);

  return (
    <div className="min-h-screen text-slate-100 bg-gradient-to-b from-[#0b1020] via-[#0b1020] to-[#0e1530]">
      <header className="max-w-4xl mx-auto px-5 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.7)]" />
          <h1 className="text-xl font-semibold tracking-tight">Kaizo ROI Calculator</h1>
        </div>
        <Stepper step={step} />
      </header>

      <main className="max-w-4xl mx-auto px-5 pb-8">
        {step === 1 && (
          <Inputs inputs={inputs} setInputs={setInputs} onContinue={go(2)} />
        )}
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

function Stepper({ step }) {
  const common = "flex-1 h-2 rounded-full";
  return (
    <div className="mt-4 flex items-center gap-2">
      <div className={`${common} ${step >= 1 ? "bg-emerald-400" : "bg-white/10"}`} />
      <div className={`${common} ${step >= 2 ? "bg-emerald-400" : "bg-white/10"}`} />
      <div className={`${common} ${step >= 3 ? "bg-emerald-400" : "bg-white/10"}`} />
    <
