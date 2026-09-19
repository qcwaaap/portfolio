import { Loader } from '@/components/loader/Loader';

export default function Home() {
  return (
    <>
      <Loader />
      {/* ЗАГЛУШКА — сюда придёт hero */}
      <main className="home-placeholder">
        <div>
          Maria
          <br />
          Nedbailova
          <small>hero goes here</small>
        </div>
      </main>
    </>
  );
}
