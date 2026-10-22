import { useState } from 'react';
import { Flower, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    sepal_length: '',
    sepal_width: '',
    petal_length: '',
    petal_width: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('https://flaskappaula2026.onrender.com/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sepal_length: parseFloat(formData.sepal_length),
          sepal_width: parseFloat(formData.sepal_width),
          petal_length: parseFloat(formData.petal_length),
          petal_width: parseFloat(formData.petal_width),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      setPrediction(data.predicao);
    } catch (err) {
      setError('An error occurred while predicting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Flower className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Iris Predictor</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {['sepal_length', 'sepal_width', 'petal_length', 'petal_width'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace('_', ' ')}</label>
              <input
                type="number"
                step="0.1"
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleInputChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Predict Species'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {prediction && (
          <div className="mt-6 p-6 bg-indigo-50 border border-indigo-100 rounded-lg text-center">
            <CheckCircle className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
            <p className="text-sm text-indigo-800 uppercase tracking-wider font-semibold">Predicted Species</p>
            <p className="text-3xl font-bold text-indigo-950 mt-1">{prediction}</p>
          </div>
        )}
      </div>
    </div>
  );
}
