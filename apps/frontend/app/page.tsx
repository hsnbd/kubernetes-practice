import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* header */}
      <header className="flex justify-between h-12 bg-red-400">
        <div className="">logo</div>
        <div className="flex gap-2">
          <Link href="/auth/signup" className="">signup</Link>
          <Link href="/auth/signin" className="">signin</Link>
        </div>
      </header>
      {/* main */}
      <main className="flex-1">main</main>
      {/* footer */}
      <footer className="flex justify-between h-12 bg-red-400">footer</footer>
   </div>
  );
}
