import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import Magnifier from 'react-magnifier';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import resumePdfUrl from '../../../assets/resume/samiylo-engineer.pdf';
import './InspectResume.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * Renders a PDF page off-screen, snapshots the canvas to a PNG data URL, then shows
 * react-magnifier (expects an image src). Falls back to plain react-pdf if snapshot fails.
 */
function PdfPageWithMagnifier({ pageNumber, width }) {
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    setImgSrc(null);
    setUseFallback(false);
  }, [width, pageNumber]);

  const onRenderSuccess = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      setImgSrc(canvas.toDataURL('image/png'));
    } catch {
      setUseFallback(true);
    }
  }, []);

  if (useFallback) {
    return (
      <Page
        pageNumber={pageNumber}
        width={width}
        renderTextLayer
        renderAnnotationLayer
      />
    );
  }

  if (imgSrc) {
    return (
      <div className="inspect-resume-magnifier-wrap">
        <Magnifier
          src={imgSrc}
          width={width}
          mgWidth={200}
          mgHeight={200}
          mgShape="circle"
          zoomFactor={0.6}
          mgBorderWidth={0}
          className="inspect-resume-magnifier"
          alt={`Resume page ${pageNumber}`}
        />
      </div>
    );
  }

  return (
    <div
      className="inspect-resume-page-prerender"
      aria-hidden
      style={{
        position: 'fixed',
        left: '-10000px',
        top: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
        width,
      }}
    >
      <Page
        pageNumber={pageNumber}
        width={width}
        canvasRef={canvasRef}
        onRenderSuccess={onRenderSuccess}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </div>
  );
}

const InspectResume = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(() =>
    typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 900) : 900,
  );
  const [loadError, setLoadError] = useState(null);

  const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
    setLoadError(null);
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    setLoadError(err?.message || 'Could not load PDF.');
  }, []);

  useEffect(() => {
    const onResize = () => {
      setPageWidth(Math.min(window.innerWidth - 32, 900));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a1a1a',
      }}
    >
      <header
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '12px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          zIndex: 1001,
        }}
      >
        <Link
          to="/"
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '5px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            cursor: 'pointer',
          }}
        >
          Back to Home
        </Link>
        <span style={{ color: '#e8e8e8', fontSize: '15px', fontWeight: 600 }}>
          Resume
        </span>
        <a
          href={resumePdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: 'auto',
            color: '#6eb3ff',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Open in new tab
        </a>
      </header>

      <div
        className="inspect-resume-viewer"
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
        }}
      >
        {loadError ? (
          <p style={{ color: '#f0a0a0', padding: '24px', textAlign: 'center' }}>
            {loadError}
          </p>
        ) : null}
        <Document
          file={resumePdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <p style={{ color: '#aaa', padding: '24px', textAlign: 'center' }}>
              Loading resume…
            </p>
          }
        >
          {numPages
            ? Array.from({ length: numPages }, (_, i) => (
                <PdfPageWithMagnifier
                  key={`${i + 1}-${pageWidth}`}
                  pageNumber={i + 1}
                  width={pageWidth}
                />
              ))
            : null}
        </Document>
      </div>
    </div>
  );
};

export default InspectResume;
