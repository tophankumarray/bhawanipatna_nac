const ImagePreviewModal = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-xl shadow-xl">
        <img src={src} className="max-w-md rounded" alt="preview" />
        <button
          onClick={onClose}
          className="mt-3 w-full bg-green-600 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
