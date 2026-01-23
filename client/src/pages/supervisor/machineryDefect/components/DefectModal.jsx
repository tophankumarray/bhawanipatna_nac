import React from "react";
import { Shield } from "lucide-react";

import FormModal from "./ui/FormModal";
import InputField from "./ui/InputField";
import SelectField from "./ui/SelectField";
import TextareaField from "./ui/TextareaField";
import CameraField from "./ui/CameraField";

export default function DefectModal({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  recordFormData,
  setRecordFormData,
  formErrors,
  capturePhoto,
  handleRetake,
  webcamRef,
  isCameraActive,
  MACHINE_CATEGORIES,
}) {
  return (
    <FormModal
      title="Report Machinery Defect"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      loading={submitting}
    >
      <InputField
        label="Supervisor Name"
        value={recordFormData.supervisorName}
        onChange={(v) =>
          setRecordFormData((p) => ({ ...p, supervisorName: v }))
        }
        error={formErrors.supervisorName}
      />

      <InputField
        label="Contact Number"
        type="tel"
        value={recordFormData.contactNumber}
        onChange={(v) => {
          const sanitized = v.replace(/\D/g, "").slice(0, 10);
          setRecordFormData((p) => ({ ...p, contactNumber: sanitized }));
        }}
        error={formErrors.contactNumber}
      />

      <SelectField
        label="Machine Type"
        value={recordFormData.machineType}
        onChange={(v) => setRecordFormData((p) => ({ ...p, machineType: v }))}
        options={MACHINE_CATEGORIES}
      />

      {formErrors.photo && (
        <p className="text-red-500 text-sm">{formErrors.photo}</p>
      )}

      <CameraField
        photo={recordFormData.photo}
        onCapture={capturePhoto}
        onRetake={handleRetake}
        webcamRef={webcamRef}
        isCameraActive={isCameraActive}
      />

      <TextareaField
        label="Description"
        value={recordFormData.description}
        onChange={(v) => setRecordFormData((p) => ({ ...p, description: v }))}
      />

      <div className="text-sm text-gray-700 bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
        <div className="flex gap-2 items-start">
          <Shield className="h-5 w-5 text-emerald-600 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-800 mb-1">Auto-filled</p>
            <p>📅 Date & Time auto-added on submit</p>
            <p>
              🛠 Status starts as <b>started</b>
            </p>
          </div>
        </div>
      </div>
    </FormModal>
  );
}
