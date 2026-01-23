export const MACHINE_CATEGORIES = [
  "Sheaving/Screening Machine",
  "Balling Machine",
  "Incinerator",
  "Grass Cutter",
  "Tree Cutter",
  "Grease Gun",
  "Shredder Machine",
];

export const validateMachineryForm = (data) => {
  const errors = {};

  if (!data.supervisorName) errors.supervisorName = "Required";
  if (!/^\d{10}$/.test(data.contactNumber))
    errors.contactNumber = "Contact number must be exactly 10 digits.";
  if (!data.machineType) errors.machineType = "Required";
  if (!data.description) errors.description = "Required";
  if (!data.photo) errors.photo = "Image is required";

  return errors;
};

export const getNextStatus = (current) => {
  if (current === "started") return "inprogress";
  if (current === "inprogress") return "repaired";
  return "repaired";
};
