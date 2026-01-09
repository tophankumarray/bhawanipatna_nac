import { X, Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const AddDefectModal = ({ open, onClose }) => {
  const [form, setForm] = useState({
    supervisorName: "",
    contact: "",
    machine: "",
    description: "",
    image: null,
  });

  if (!open) return null;

  const handleSubmit = () => {
    if (
      !form.supervisorName ||
      !form.contact ||
      !form.machine ||
      !form.description
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    toast.success("Machinery defect submitted");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-600 to-teal-500 px-6 py-4 flex items-center justify-between text-white">
          <h2 className="font-semibold text-lg">
            Report Machinery Defect
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          <Input
            label="Supervisor Name *"
            value={form.supervisorName}
            onChange={(v) =>
              setForm({ ...form, supervisorName: v })
            }
          />

          <Input
            label="Contact Number *"
            value={form.contact}
            onChange={(v) =>
              setForm({ ...form, contact: v })
            }
          />

          <Select
            label="Machine Name *"
            value={form.machine}
            onChange={(v) =>
              setForm({ ...form, machine: v })
            }
          />

          {/* IMAGE */}
          <div>
            <label className="text-sm font-medium">
              Capture Image
            </label>
            <div className="mt-2 border-2 border-dashed rounded-xl p-4 text-center">
              <Camera className="mx-auto text-green-600" />
              <p className="text-sm text-gray-500 mt-2">
                Image will be geo-tagged in production
              </p>
            </div>
          </div>

          <Textarea
            label="Description *"
            value={form.description}
            onChange={(v) =>
              setForm({ ...form, description: v })
            }
          />

          {/* INFO */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
            <p>✔ Date & time auto-recorded</p>
            <p>✔ Geo-location enabled in production</p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-lg"
          >
            Submit Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDefectModal;

/* ---------- SMALL COMPONENTS ---------- */

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 border rounded-lg px-3 py-2"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full mt-1 border rounded-lg px-3 py-2"
    />
  </div>
);

const Select = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 border rounded-lg px-3 py-2"
    >
      <option value="">Select machine</option>
      <option>JCB</option>
      <option>Compactor</option>
      <option>Dumper</option>
    </select>
  </div>
);
