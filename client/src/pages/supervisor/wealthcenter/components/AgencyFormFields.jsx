import { BadgeIndianRupee } from "lucide-react";
import InputField from "./InputField";
import SelectField from "./SelectField";

const AgencyFormFields = ({ agencyForm, setAgencyForm, materials }) => {
  return (
    <>
      <InputField
        label="Agency Name"
        value={agencyForm.agencyName}
        onChange={(v) => setAgencyForm((p) => ({ ...p, agencyName: v }))}
      />

      <SelectField
        label="Material"
        value={agencyForm.material}
        onChange={(v) => setAgencyForm((p) => ({ ...p, material: v }))}
        options={materials}
      />

      <InputField
        label="Weight (KG)"
        type="number"
        value={agencyForm.weightKg}
        onChange={(v) => setAgencyForm((p) => ({ ...p, weightKg: v }))}
        min={0}
      />

      <InputField
        label="Rate (₹/KG)"
        type="number"
        value={agencyForm.ratePerKg}
        onChange={(v) => setAgencyForm((p) => ({ ...p, ratePerKg: v }))}
        min={0}
      />

      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 font-semibold text-gray-800 flex items-center gap-2">
        <BadgeIndianRupee className="h-5 w-5 text-green-700" />
        Total: ₹{" "}
        {Number(agencyForm.weightKg || 0) * Number(agencyForm.ratePerKg || 0)}
      </div>
    </>
  );
};

export default AgencyFormFields;
