export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <article style={{ padding: 40, fontFamily: 'monospace' }}>
      <h1>статья: {slug}</h1>
    </article>
  );
}

export async function generateStaticParams() {
  return [{ slug: 'nextjs-vvedenie' }, { slug: 'react-osnovy' }];
}
