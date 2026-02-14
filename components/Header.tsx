export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">RP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Readmission Predictor
              </h1>
              <p className="text-xs text-gray-500">
                ML-Powered Risk Assessment
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
