import { testEquipment } from "@/lib/company";

const COLUMNS = ["Test equipment", "Make", "Least count", "Range", "Used for"] as const;

/**
 * The calibrated measurement register. Shown on both the infrastructure and the
 * certifications page, so it lives here rather than in either of them.
 */
export default function TestEquipmentTable() {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[46rem] border-collapse text-left">
        <thead className="bg-tint">
          <tr>
            {COLUMNS.map((h) => (
              <th key={h} className="label-caps px-6 py-4 text-[0.7rem] text-body">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-body text-sm">
          {testEquipment.map((t, i) => (
            <tr
              key={`${t.equipment}-${i}`}
              className="border-t border-line transition-colors hover:bg-tint/60"
            >
              <td className="px-6 py-3.5 font-medium text-navy">{t.equipment}</td>
              <td className="px-6 py-3.5 text-body">{t.make}</td>
              <td className="px-6 py-3.5 text-body">{t.leastCount}</td>
              <td className="px-6 py-3.5 text-body">{t.range}</td>
              <td className="px-6 py-3.5 text-body">{t.usedFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
