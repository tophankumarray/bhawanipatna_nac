import React from "react";
import { Camera, RotateCcw } from "lucide-react";
import Webcam from "react-webcam";

export default function CameraField({
  photo,
  onCapture,
  onRetake,
  webcamRef,
  isCameraActive,
}) {
  return (
    <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
      {!photo ? (
        isCameraActive ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 400, height: 300, facingMode: "user" }}
            className="rounded-xl w-full mb-4 shadow-md mx-auto"
          />
        ) : null
      ) : (
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Captured Image:
          </p>
          <img
            src={photo}
            alt="Captured evidence"
            className="rounded-xl max-h-40 mx-auto shadow-md border-2 border-emerald-200 object-contain"
          />
        </div>
      )}

      <div className="flex justify-center mt-4">
        {!photo ? (
          <button
            type="button"
            onClick={onCapture}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
          >
            <Camera className="h-5 w-5" />
            Capture Image
          </button>
        ) : (
          <button
            type="button"
            onClick={onRetake}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold"
          >
            <RotateCcw className="h-5 w-5" />
            Retake
          </button>
        )}
      </div>
    </div>
  );
}
