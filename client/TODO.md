# TODO: Implement Citizen Login with Navigation and Toast

- [x] Add necessary imports to Login.jsx (useNavigate, useContext, AuthContext, toast)
- [x] Modify handleVerifyOtp function to:
  - Call login({ role: "citizen", phone }) on success
  - Navigate to "/citizen"
  - Show toast.success("Login successful!")
