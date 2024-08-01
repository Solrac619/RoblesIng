import React, { useState } from 'react';
import PDFUploader from './pdfSubir';
import PDFLista from './pdfLista';
import PDFViewer from './pdfVista';

const DocPDF = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [activeView, setActiveView] = useState('upload');

  const handleFileUpload = (fileUrl) => {
    setPdfUrl(fileUrl);
    setActiveView('view');
  };

  const handleFileSelect = (fileUrl) => {
    setPdfUrl(fileUrl);
    setActiveView('view');
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            onClick={() => setActiveView('upload')}
            className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 ${
              activeView === 'upload' ? 'bg-blue-600' : ''
            }`}
          >
            Subir PDF
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 ${
              activeView === 'list' ? 'bg-blue-600' : ''
            }`}
          >
            Ver Lista de PDFs
          </button>
        </div>
      </div>
      {activeView === 'upload' && <PDFUploader onFileUpload={handleFileUpload} />}
      {activeView === 'list' && <PDFLista onFileSelect={handleFileSelect} />}
      {activeView === 'view' && <PDFViewer pdfUrl={pdfUrl} />}
    </div>
  );
};

export default DocPDF;
