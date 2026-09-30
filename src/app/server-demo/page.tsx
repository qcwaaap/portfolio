
export default async function ServerDemo() {
  const time = new Date().toISOString();
  console.log('terminal');

  return (
    <main style={{ padding: 40, fontFamily: 'monospace' }}>
      <h1>server component</h1>
      <p>server's time: {time}</p>
      <p style={{ opacity: 0.6, marginTop: 24 }}>
        reload the page - time will change, the component renders again and again if you send a request.
      </p>
    </main>
  );
}
