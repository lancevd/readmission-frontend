export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            <p>Patient Readmission Prediction System v1.0.0</p>
            <p className="text-xs text-gray-500 mt-1">
              Built with TensorFlow.js, Next.js, and Express
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-red-600">
              ⚠ Not for clinical decision-making
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Research and educational purposes only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
