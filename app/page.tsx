export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Predict Hospital Readmission Risk
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Use machine learning to assess the likelihood of patient readmission within 30 days
          </p>
          {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> This application is for research and educational purposes only.
              Do not use for clinical decision-making.
            </p>
          </div> */}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="text-blue-600 text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Data-Driven</h3>
            <p className="text-sm text-gray-600">
              Trained on 101,766 patient records from 130 US hospitals
            </p>
          </div>
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="text-green-600 text-2xl mb-2">🧠</div>
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600">
              Neural network model with 64.5% ROC-AUC score
            </p>
          </div>
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="text-purple-600 text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-Time</h3>
            <p className="text-sm text-gray-600">
              Instant predictions in your browser using TensorFlow.js
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Getting Started
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Enter patient demographic and clinical information</li>
            <li>Submit the form to receive a risk prediction</li>
            <li>Review the risk level and probability score</li>
            <li>Use insights for research and analysis only</li>
          </ol>
          <div className="mt-6">
            <a href="/predict" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
              Start Prediction
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
