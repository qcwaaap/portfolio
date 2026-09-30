'use client';

import { useState } from 'react';
import { greet } from '../actions';

export default function GreetDemo() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    setMessage(await greet('student'));
    setLoading(false);
  };

  return (
    <main style={{ padding: 40, fontFamily: 'monospace' }}>
      <h1>server function demo</h1>
      <button onClick={onClick} disabled={loading}>
        {loading ? '...' : 'say hi'}
      </button>
      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </main>
  );
}
