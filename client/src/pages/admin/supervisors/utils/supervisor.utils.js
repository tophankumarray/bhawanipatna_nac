// @ts-nocheck
export const buildSupervisorPayload = (formData) => ({
  supervisorName: formData.name,
  username: formData.username,
  email: formData.email,
  phoneNumber: formData.mobile,
  password: formData.password,
  status: formData.status,
});

export const generateRandomPassword = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += charset.charAt(
      Math.floor(Math.random() * charset.length)
    );
  }
  return password;
};
