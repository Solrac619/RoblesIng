import React, { useState } from "react";
import axios from "axios";

const PDFUploader = ({ onFileUpload }) => {
  const [fileList, setFileList] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file);
      setFileUrl(fileUrl);
      setFileList([...fileList, file]); // Agregar archivo a la lista
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleDownload = (fileUrl) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = "archivo.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("formato", fileList[0]);

      const response = await axios.post("http://localhost:3001/formato/formatos", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const uploadedFilePath = `/assets/${response.data.nombre}`; // Usar el nombre devuelto por el servidor
      alert("Archivo subido correctamente.");
      setFileList([]);
      setFileUrl(null);
      onFileUpload(uploadedFilePath); // Pasar la URL correcta
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo.");
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Agregar archivo PDF
        </label>
        <div className="flex items-center justify-center">
          <label
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V8m0 0L3.5 11.5M7 8L10.5 11.5M7 8v8m10-4h-4m0 0l3.5-3.5M17 12l-3.5 3.5M17 12H3"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Haz click para subir</span> o arrastra y suelta
              </p>
              <p className="text-xs text-gray-500">Solo archivos PDF</p>
            </div>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {fileList.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Archivos subidos:</h2>
          <ul className="border border-gray-200 rounded-md p-4">
            {fileList.map((file, index) => (
              <li key={index} className="flex justify-between items-center py-2">
                <span className="truncate w-full">{file.name}</span>
                <div>
                  <button
                    onClick={() => handleDownload(URL.createObjectURL(file))}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Descargar
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={handleUpload}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Subir Archivo
          </button>
        </div>
      )}

      {fileUrl && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Vista previa del archivo:</h2>
          <iframe src={fileUrl} className="w-full h-64 border-none"></iframe>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
