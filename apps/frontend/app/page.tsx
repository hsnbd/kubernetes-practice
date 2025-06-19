import Link from "next/link";
import { RiSearch2Fill } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-[80vh] justify-between">
        <div className="h-full w-full bg-[url('/images/HeroImage.jpg')] bg-cover bg-center bg-no-repeat">
          {/* top header */}
          <div className="flex h-8 w-full items-center justify-center bg-gray-300">
            <h1 className="font-montserrat text-2xl text-gray-400">
              top header part
            </h1>
          </div>

          {/* top header left links */}
          <div className="flex w-full items-center justify-end gap-6 px-12 pt-2">
            <div className="flex gap-6 text-2xl text-gray-300 transition-all">
              <Link
                href="#"
                className="text-2xl text-gray-200 transition-all hover:underline hover:underline-offset-4"
              >
                link1
              </Link>
              <Link
                href="#"
                className="text-2xl text-gray-200 transition-all hover:underline hover:underline-offset-4"
              >
                link2
              </Link>
              <Link
                href="#"
                className="text-2xl text-gray-200 transition-all hover:underline hover:underline-offset-4"
              >
                link3
              </Link>
              <Link
                href="#"
                className="text-2xl text-gray-200 transition-all hover:underline hover:underline-offset-4"
              >
                link4
              </Link>
              <Link
                href="#"
                className="text-2xl text-gray-200 transition-all hover:underline hover:underline-offset-4"
              >
                link5
              </Link>
            </div>

            {/* top right links */}
            <div className="flex items-center justify-end gap-2">
              <RiSearch2Fill size={25} color="white" />
              <IoPerson size={25} color="white" />
              <FaShoppingCart size={25} color="white" />
            </div>
          </div>

          {/* hero image text */}
          <div className="flex h-full w-full flex-col items-center justify-center">
            <h1 className="font-montserrat text-7xl text-white uppercase">
              Green Land
            </h1>

            <h2 className="font-montserrat mt-10 text-3xl text-white uppercase">
              El planeta de las plantas
            </h2>

            <h3 className="font-montserrat mt-3 text-xl text-white uppercase">
              Descubre la belleza de la naturaleza
            </h3>
          </div>
        </div>
      </header>
      {/* main */}
      <main className="flex-1/3">main</main>
      {/* footer */}
      <footer className="flex h-[10vh] justify-between">footer</footer>
    </div>
  );
}
