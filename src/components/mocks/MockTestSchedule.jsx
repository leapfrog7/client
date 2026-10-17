import { MOCK_TEST_SCHEDULE, formatMockDateTime } from "../../util/mockSchedule";

export default function MockTestSchedule() {
  return (
    <section aria-labelledby="mock-schedule-title" className="my-5 overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm">
      <div className="bg-teal-50 px-4 py-4 sm:px-6">
        <h2 id="mock-schedule-title" className="text-lg font-bold text-slate-900">Mock test schedule</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Five tests before the December 2026 exam. Each opens at 9:00 AM IST and remains open for 36 hours, until 9:00 PM IST the next day.
        </p>
        <p className="mt-1 text-sm text-slate-600">No test is scheduled for 7–8 November.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">October to December 2026 mock tests. All dates and times are in Indian Standard Time.</caption>
          <thead className="border-b bg-slate-50 text-slate-600">
            <tr><th scope="col" className="px-4 py-3">Test</th><th scope="col" className="px-4 py-3">Opens (IST)</th><th scope="col" className="px-4 py-3">Closes (IST)</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_TEST_SCHEDULE.map((slot) => (
              <tr key={slot.startAt}>
                <th scope="row" className="px-4 py-3 font-semibold text-slate-900">{slot.title}</th>
                <td className="px-4 py-3 text-slate-700"><time dateTime={slot.startAt}>{formatMockDateTime(slot.startAt)}</time></td>
                <td className="px-4 py-3 text-slate-700"><time dateTime={slot.endAt}>{formatMockDateTime(slot.endAt)}</time></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-4 py-3 text-sm text-slate-500">Start or resume an available test below during its open window. Each timed attempt lasts 30 minutes.</p>
    </section>
  );
}
