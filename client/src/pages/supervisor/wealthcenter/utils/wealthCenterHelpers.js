export const formatDateTime = () => new Date().toISOString();

export const validatePhone = (value) => /^\d{10}$/.test(value);

export const canSubmitRecord = (form) => {
  return (
    form.supervisorName.trim() &&
    validatePhone(form.phoneNo) &&
    form.cubeNumber &&
    form.photo
  );
};
