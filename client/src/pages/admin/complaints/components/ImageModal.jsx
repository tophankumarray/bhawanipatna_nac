// @ts-nocheck
const ImageModal = ({ src, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <img
        src={src}
        alt="Full View"
        className="max-w-full max-h-[90vh] rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ImageModal;
