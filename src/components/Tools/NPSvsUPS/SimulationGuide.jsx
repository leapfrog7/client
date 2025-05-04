import { useState } from "react";

const SimulationGuide = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-6 bg-slate-100 border border-gray-300 rounded">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 font-semibold text-blue-800 hover:bg-gray-200 transition ease-in duration-200 text-sm md:text-base"
      >
        📘 Assumptions & Limitations of the Model {open ? "➖" : "➕"}
      </button>
      {open && (
        <div className="px-5 pt-2 pb-5 text-sm text-gray-800 space-y-4 transition ease-in duration-200 bg-white">
          <p>
            <strong>1. Purpose of the Tool:</strong> This tool provides an
            indicative comparison between the National Pension System (NPS) and
            the Unified Pension Scheme (UPS). It is not meant to offer financial
            advice or exact predictions.
          </p>

          <p>
            <strong>2. How Pay Commission Hike is Modeled:</strong> A decadal
            Pay Commission revision is assumed to occur every 10 years — in
            2026, 2036, 2046, and so on. To simulate this, the accumulated
            Dearness Allowance (DA) up to the point of revision is merged with
            the Basic Pay. The revised Basic Pay is then increased by a
            user-defined hike percentage. A hike in the range of 10% to 25%
            would be a reasonable assumption.
          </p>

          <p>
            <strong>3. Increments & DA Increases:</strong> Regular increments
            are granted once a year — either in January or July, as chosen by
            the user. Each increment increases the Basic Pay by 3%, rounded off
            to the nearest ₹100, simulating actual government pay progression.
            Additionally, Dearness Allowance (DA) is revised every 6 months
            based on a user-defined rate (typically 2%–5%). This DA not only
            influences ongoing salary but also directly impacts post-retirement
            Dearness Relief (DR) under the UPS, ensuring inflation-indexed
            pension growth.
          </p>

          <p>
            <strong>4. Are Promotions Accounted For?</strong> To keep the model
            simple and conservative, the model does not factor in promotions
            while projecting future pay or pension. However, users expecting two
            or more promotions during their service may adjust the Pay
            Commission hike percentage to reflect the cumulative effect of those
            promotions. While this is not a perfect substitute, it offers a
            reasonable approximation. The absence of a promotion component means
            the model tends to produce conservative estimates, which can be
            helpful for prudent financial planning.
          </p>

          <p>
            <strong>5. Present Value (PV) Explained:</strong> Present Value (PV)
            is a way to calculate how much a future stream of money is worth in
            today’s terms — or in this case, at the time of retirement. When you
            receive money over many years — like a pension every month — its
            total value isn’t just a simple sum.
            <span className="block">
              That’s because: Money you receive in the future is less valuable
              than money today (due to inflation and lost investment
              opportunities). So we apply a discount rate to adjust for this —
              like saying, “₹1,000 next year is only worth ₹940 today.”
            </span>{" "}
            In this model, we calculate the PV of monthly pensions (under NPS or
            UPS), and in some cases, the value of lump sum amounts too.
            <span className="p-2 bg-teal-50 block">
              <strong>Important:</strong> The Present Value in this model is
              calculated as on the date of retirement, not today. This allows
              for a fair comparison of the total future benefits under both NPS
              and UPS starting from the same point. You can think of PV as the
              retirement-day worth of all the money you will receive over your
              remaining life.
            </span>
          </p>

          <p>
            <strong>6. Life Expectancy:</strong> This sets the duration over
            which pension is assumed to be received. It significantly impacts
            the PV — longer expectancy increases PV of pensions.
          </p>

          <p>
            <strong>7. Discount Rate:</strong> The discount rate is a percentage
            used to calculate the present value of future cash flows, helping us
            understand how much those future amounts are worth at the time of
            retirement. In simple terms, money you receive in the future is not
            as valuable as money you have today, because of factors like
            inflation and the opportunity to invest that money and earn returns.
            The discount rate helps adjust for this difference. For example, if
            you are expecting a monthly pension for 20 years after retirement,
            the discount rate helps estimate what all those future payments
            would be worth in a lump sum as of your retirement date. This gives
            a clearer picture of the total benefit you are getting, making it
            easier to compare different retirement schemes like NPS and UPS.
            Typically, a discount rate between 6% and 9% is used in such
            projections.
            <span className="p-2 bg-teal-50 block">
              <strong>Important: </strong>The Government bonds (e.g., 10-year
              G-Sec) offer yields in the range of 7% to 7.5%, which are
              considered a benchmark for risk-free return. Since pensions are
              relatively stable and predictable, aligning the discount rate with
              long-term G-Sec yields is reasonable.
            </span>
          </p>

          <p>
            <strong>8. Annuity Returns:</strong> Annuity returns represent the
            annual percentage payout a retiree receives from the annuity
            provider in exchange for the annuitized portion of their NPS corpus.
            In India, annuity rates typically range from 5% to 7%, depending on
            the provider, plan type, and age at the time of purchase. In this
            model, we allow users to select an annuity interest rate, which is
            applied to the annuitized corpus to estimate the monthly pension
            under NPS. Additionally, we assume a common annuity option where the
            purchase price (i.e., the annuitized corpus) is returned to the
            nominee upon the death of the retiree. This ensures that the
            remaining value is not lost and is accounted for in the total
            present value of benefits under NPS.
          </p>

          <p>
            <strong>9. Dearness Relief (DR):</strong> In UPS, DR is modeled to
            increase semi-annually at the same rate as DA. This makes the UPS
            more inflation-protected over time.
          </p>

          <p>
            <strong>10. Make realistic Assumptions:</strong> Users are
            encouraged to adjust parameters such as life expectancy, DR/DA
            increase rate, discount rate, and expected pay commission hike to
            better reflect realistic or conservative scenarios. Overly
            optimistic assumptions may lead to an inflated sense of financial
            security and should be avoided for a more balanced projection.
          </p>

          <p className="text-red-700 font-semibold text-xs p-2 bg-pink-50 rounded-md">
            ❗Disclaimer: The above analysis is a simulation tool intended to
            provide a general idea of how retirement benefits under NPS and UPS
            might evolve over time, based on a set of assumed variables. This
            should <span className="font-semibold">not</span> be construed as
            financial planning advice or a recommendation to opt for either
            scheme.While every effort has been made to ensure accuracy, the
            calculations are based on user inputs, average assumptions, and
            simplifications of applicable rules. The actual benefits may vary
            significantly due to changes in government policy, market behavior,
            or individual circumstances. We accept no liability for decisions
            made based on this tool. Users are encouraged to consult qualified
            financial advisors or official government sources for detailed
            guidance.
          </p>
        </div>
      )}
    </div>
  );
};

export default SimulationGuide;
