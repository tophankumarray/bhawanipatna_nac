import Webcam from "react-webcam";
import { Camera } from "lucide-react";

const CameraField = ({ photo, onCapture, onRetake, webcamRef }) => {
  return (
    <div className="border-2 border-dashed border-amber-300 rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-orange-50">
      {!photo ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 400,
              height: 300,
              facingMode: "environment",
            }}
            className="rounded-xl w-full mb-4 shadow-md"
          />

          <div className="flex justify-center">
            <button
              type="button"
              onClick={onCapture}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
            >
              <Camera className="h-5 w-5" />
              Capture Image
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mt-2">
            <p className="text-xs text-gray-600 font-semibold mb-3">Preview:</p>
            <img
              src={photo}
              alt="Captured"
              className="rounded-xl max-h-44 mx-auto shadow-md border-2 border-amber-200 object-contain"
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={onRetake}
              className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
            >
              Retake Photo
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraField;
