// NpsCalculator.js

import { differenceInMonths, addMonths, getYear, getMonth } from "date-fns";

export function calculateNpsProjection(formData, payMatrixData) {
  const {
    payLevel,
    payCell,
    incrementMonth,
    daRate,
    expectedDaIncreaseRate,
    employeeContribution,
    employerContribution,
    dob,
    currentCorpus = 0,
    expectedReturn,
    enablePayCommission,
    payCommissionHikePercent,
  } = formData;

  const result = [];

  const dobDate = new Date(dob);
  const today = new Date();
  const retirementDate = new Date(dobDate);
  retirementDate.setFullYear(retirementDate.getFullYear() + 60);

  let monthsRemaining = differenceInMonths(retirementDate, today);
  const r = parseFloat(expectedReturn) / 100 / 12 || 0;

  let corpusNps = parseFloat(currentCorpus) || 0;
  let corpusUps = parseFloat(currentCorpus) || 0;

  const levelData = payMatrixData[payLevel] || [];
  const initialBasic = levelData[levelData.indexOf(parseInt(payCell))] || 0;
  let maxBasicInLevel = Math.max(...levelData);

  let basic = initialBasic;
  let currentDate = new Date(today);

  const payCommissionYears = [2026, 2036, 2046, 2056, 2066];

  let currentDAValue = parseFloat(daRate) || 0;
  const daIncreaseRate = parseFloat(expectedDaIncreaseRate) || 0;
  const parsedEmployeeContribution = parseFloat(employeeContribution) || 0;
  const parsedEmployerContribution = parseFloat(employerContribution) || 0;
  const parsedPayCommissionHike = parseFloat(payCommissionHikePercent) || 0;

  for (let i = 0; i <= monthsRemaining; i++) {
    const year = getYear(currentDate);
    const monthIndex = getMonth(currentDate);
    const month = currentDate.toLocaleString("default", { month: "long" });

    const isIncrementMonth =
      (incrementMonth === "January" && monthIndex === 0) ||
      (incrementMonth === "July" && monthIndex === 6);

    const isDARevisionMonth = monthIndex === 0 || monthIndex === 6;
    const isPayCommissionMonth =
      enablePayCommission &&
      payCommissionYears.includes(year) &&
      monthIndex === 0;

    let daResetThisMonth = false;

    // 1. Apply Pay Commission (reset DA, merge into Basic)
    if (isPayCommissionMonth) {
      const daBeforePC = Math.round((basic * currentDAValue) / 100);
      basic = Math.round(
        (basic + daBeforePC) * (1 + parsedPayCommissionHike / 100)
      );
      currentDAValue = 0;
      daResetThisMonth = true;
      maxBasicInLevel = basic * 3; // revise ceiling
    }

    // 2. Apply DA Increase (unless DA was just reset by Pay Commission)
    if (isDARevisionMonth && !daResetThisMonth) {
      currentDAValue += daIncreaseRate;
    }

    // 3. Calculate DA Amount
    const daAmount = Math.round((basic * currentDAValue) / 100) || 0;

    // 4. Apply Annual Increment if eligible
    if (isIncrementMonth && i !== 0 && basic < maxBasicInLevel) {
      basic = Math.round((basic * 1.03) / 100) * 100;
    }

    // 5. Calculate Contributions
    const totalContributionNps = Math.round(
      ((basic + daAmount) *
        (parsedEmployeeContribution + parsedEmployerContribution)) /
        100
    );
    corpusNps = Math.round((corpusNps + totalContributionNps) * (1 + r));

    const totalContributionUps = Math.round((basic + daAmount) * 0.2);
    corpusUps = Math.round((corpusUps + totalContributionUps) * (1 + r));

    const age = year - dobDate.getFullYear();

    result.push({
      year,
      month,
      age,
      basic,
      da: daAmount,
      totalContributionNps,
      corpusNps,
      totalContributionUps,
      corpusUps,
      isIncrementMonth,
      isPayCommissionMonth,
    });

    currentDate = addMonths(currentDate, 1);
  }

  return result;
}
