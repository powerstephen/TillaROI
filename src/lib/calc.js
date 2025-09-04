export const defaultInputs = {
  agents: 25,
  agentCostYear: 60000,  // fully-loaded
  ticketsPerMonth: 30000,
  aht: 7,                // minutes
  hoursYear: 2080,
  currency: "$",

  ahtReductionPct: 12,   // %
  qaHoursBaseline: 6,    // hours / agent / month (manual QA)
  qaAutomationPct: 70,   // %
  managerHoursSaved: 1.5,// hours / agent / month
  revenueProtected: 0    // optional $/year
};

export function computeOutputs(i) {
  const hourlyCost = i.agentCostYear / i.hoursYear;

  // AHT savings
  const minutesSavedPerTicket = i.aht * (i.ahtReductionPct / 100);
  const hoursSavedPerMonth = (i.ticketsPerMonth * minutesSavedPerTicket) / 60;
  const ahtSavings = hoursSavedPerMonth * 12 * hourlyCost;

  // QA automation savings
  const qaHoursSavedPerAgentYear = i.qaHoursBaseline * (i.qaAutomationPct / 100) * 12;
  const qaSavings = qaHoursSavedPerAgentYear * i.agents * hourlyCost;

  // Manager time savings
  const mgrSavings = i.managerHoursSaved * 12 * i.agents * hourlyCost;

  const total = ahtSavings + qaSavings + mgrSavings + i.revenueProtected;

  return {
    hourlyCost,
    ahtSavings,
    qaSavings,
    mgrSavings,
    total
  };
}

export const fmtMoney = (v, cur = "$") =>
  `${cur}${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
