import React from "react";

const PDFVista = ({ pdfUrl }) => {
  if (!pdfUrl) return null;

  return (
    <div className="mb-4">
      <embed src={pdfUrl} width="100%" height="600px" type="application/pdf" />
    </div>
  );
};

export default PDFVista;
