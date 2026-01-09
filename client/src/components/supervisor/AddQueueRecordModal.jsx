import { X, Camera } from "lucide-react";
import { toast } from "react-toastify";

const AddQueueRecordModal = ({ open, onClose }) => {
  if (!open) return null;

  const submit = () => {
    toast.success("Queue record submitted");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-600 to-red-500 text-white px-6 py-4 flex justify-between">
          <h2 className="font-semibold">
            Qube Fulfillment Record
          </h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">

          <Input label="Supervisor Name *" />
          <Input label="Contact Number *" />

          <Select label="Category *" />

          <div className="border-2 border-dashed rounded-xl p-4 text-center">
            <Camera className="mx-auto text-orange-600" />
            <p className="text-sm text-gray-500 mt-2">
              Capture Image
            </p>
          </div>

          <Textarea label="Description *" />

          <p className="text-xs text-red-500">
            Please fill all required fields and capture an image.
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg"
          >
            Submit Record
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddQueueRecordModal;

/* ---- small inputs ---- */
const Input = ({ label }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input className="w-full mt-1 border rounded-lg px-3 py-2" />
  </div>
);

const Textarea = ({ label }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <textarea rows={4} className="w-full mt-1 border rounded-lg px-3 py-2" />
  </div>
);

const Select = ({ label }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select className="w-full mt-1 border rounded-lg px-3 py-2">
      <option>Select Category</option>
      <option>MCC</option>
      <option>MRF</option>
    </select>
  </div>
);
