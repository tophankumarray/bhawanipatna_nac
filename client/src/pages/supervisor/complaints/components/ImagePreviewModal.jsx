const ImagePreviewModal = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-4 rounded-2xl shadow-xl w-full max-w-lg">
        <img src={src} className="w-full max-h-[420px] object-cover rounded-xl" alt="preview" />

        <button
          onClick={onClose}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 transition text-white py-2.5 rounded-xl font-semibold"
        >
          Close Preview
        </button>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
