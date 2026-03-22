import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-4xl font-bold">Border Checker</h1>
        <p className="text-lg">
          Policy-based data sovereignty and cross-border transfer assessment tool
        </p>
        <div className="rounded-xl border p-4">
          <p>Frontend is running successfully.</p>
        </div>
      </div>
    </main>
  );
}