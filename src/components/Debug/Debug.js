import React, { useEffect, useState } from 'react';
import './Debug.css';

export default function Debug() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const keys = Object.keys(localStorage || {});
    const data = keys.map((k) => {
      const raw = localStorage.getItem(k);
      let parsed = raw;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        // keep raw
      }
      return { key: k, raw, parsed };
    });
    setItems(data);
  }, []);

  const refresh = () => {
    const keys = Object.keys(localStorage || {});
    const data = keys.map((k) => {
      const raw = localStorage.getItem(k);
      let parsed = raw;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        // keep raw
      }
      return { key: k, raw, parsed };
    });
    setItems(data);
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
  };

  const download = (key, content) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${key}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeKey = (key) => {
    localStorage.removeItem(key);
    refresh();
  };

  const clearAll = () => {
    if (window.confirm('Clear all localStorage data for this origin?')) {
      localStorage.clear();
      refresh();
    }
  };

  return (
    <div className="debug-container">
      <h2>Local Storage Debug</h2>
      <div className="debug-actions">
        <button onClick={refresh}>Refresh</button>
        <button onClick={clearAll}>Clear All</button>
      </div>

      {items.length === 0 ? (
        <p>No items in localStorage.</p>
      ) : (
        <div className="debug-list">
          {items.map((it) => (
            <div className="debug-item" key={it.key}>
              <div className="debug-key">{it.key}</div>
              <pre className="debug-value">{typeof it.parsed === 'string' ? it.parsed : JSON.stringify(it.parsed, null, 2)}</pre>
              <div className="debug-buttons">
                <button onClick={() => copyToClipboard(it.raw)}>Copy Raw</button>
                <button onClick={() => download(it.key, it.raw)}>Download</button>
                <button onClick={() => removeKey(it.key)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
