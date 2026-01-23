import { X } from "lucide-react";

const FormModal = ({ title, children, isOpen, onClose, onSubmit, extraActions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white p-6 sm:p-8 flex justify-between items-center rounded-t-3xl shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-6">
          {children}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            {extraActions}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 shadow-lg flex items-center justify-center gap-2"
            >
              Submit Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
