"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    // Cuando se selecciona una nueva imagen, reinicia los estados relacionados
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    // Limpiar predicción y otros estados
    setPrediction(null);
    setConfidence(null);
    setError(null);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      setError("Por favor, selecciona una imagen.");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);
    setConfidence(null);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPrediction(response.data.prediction);
      setConfidence(response.data.confidence);
    } catch (err) {
      setError("Error al realizar la predicción.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-400">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Reconocimiento de imágenes meteorológicas</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="block w-full text-sm text-gray-700"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Realizar Predicción"}
          </button>
        </form>

        {image && (
          <div className="mt-4 flex justify-center">
            <img src={URL.createObjectURL(image)} alt="Imagen seleccionada" className="max-w-full h-auto rounded-md" />
          </div>
        )}

        {error && <p className="mt-4 text-red-500">{error}</p>}
        {prediction && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold text-green-600">Predicción: {prediction}</p>
            <p className="text-sm text-gray-500">Confianza: {confidence * 100}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
