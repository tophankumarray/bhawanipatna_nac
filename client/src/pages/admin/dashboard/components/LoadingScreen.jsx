// @ts-nocheck
const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-emerald-50 via-green-50/50 to-teal-50 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="text-center relative z-10">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600"></div>
        </div>
        <p className="text-xl font-semibold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
          Loading dashboard...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Please wait while we fetch your data
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
