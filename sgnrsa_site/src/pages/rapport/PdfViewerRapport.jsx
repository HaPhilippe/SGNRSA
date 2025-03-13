import React, { useEffect, useRef } from 'react';
import { pdfjs } from 'pdfjs-dist';

const PdfViewerRapport = ({ pdfUrl }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
      const loadingTask = pdfjs.getDocument(pdfUrl);
      loadingTask.promise.then(pdf => {
          pdf.getPage(1).then(page => {
              const canvas = canvasRef.current;
              const context = canvas.getContext('2d');
              const viewport = page.getViewport({ scale: 1 });
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              const renderContext = {
                  canvasContext: context,
                  viewport: viewport,
              };
              page.render(renderContext);
          });
      });

      return () => {
          // Cleanup if necessary
      };
  }, [pdfUrl]);

  return <canvas ref={canvasRef} style={{ width: '100%' }} />;
    
};

export default PdfViewerRapport;