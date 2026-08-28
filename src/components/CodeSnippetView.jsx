import React from 'react';

export function CodeSnippetView({ code, language = 'C' }) {
  if (!code) return null;
  const lines = code.split('\\n');

  return (
    <div className="code-snippet-box">
      <div className="code-snippet-header">
        <div className="code-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <span className="code-lang-label">💻 {language} Code Snippet</span>
      </div>
      <pre className="code-snippet-body">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="code-line">
              <span className="line-num">{i + 1}</span>
              <span className="line-text">{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
