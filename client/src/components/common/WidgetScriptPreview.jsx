import React, { useState } from 'react';

const WidgetScriptPreview = ({ rawScript }) => {
    
  const [copied, setCopied] = useState(false);

  // Parse: remove \n and decode escaped quotes
  const cleanScript = rawScript
    .replace(/\\n/g, '')     // Remove newlines
    .replace(/\\"/g, '"');   // Replace escaped quotes

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', background: '#f9f9f9' }}>
      <h3>Here is your Widget Snippet</h3>
      <p>Copy and paste this snippet within the <code>&lt;head&gt;</code> tag of your webpage.</p>
      <pre style={{ background: '#fff', padding: '1rem', borderRadius: '6px', overflowX: 'auto' }}>
        <code>{cleanScript}</code>
      </pre>
      <button onClick={handleCopy} style={{
        marginTop: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        {copied ? 'Copied!' : 'Copy Snippet'}
      </button>
    </div>
  );
};

export default WidgetScriptPreview;
