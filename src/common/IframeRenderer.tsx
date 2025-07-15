import React, { useEffect, useRef } from "react";

interface Props {
  htmlString: string;
}

const IframeRenderer: React.FC<Props> = ({ htmlString }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(htmlString);
        doc.close();
      }
    }
  }, [htmlString]);

  return (
    <iframe
      ref={iframeRef}
      title="HTML Viewer"
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
};

export default IframeRenderer;
