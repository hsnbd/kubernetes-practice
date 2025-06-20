import Link from "next/link";
import { RiSearch2Fill } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { FaTruckFast } from "react-icons/fa6";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { IoArrowUndoCircleSharp } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-[80vh] justify-between">
        <section className="h-full w-full bg-[url('/images/HeroImage.jpg')] bg-cover bg-center bg-no-repeat shadow-xl">
          {/* top header */}
          <section className="flex h-8 w-full items-center justify-center bg-gray-300">
            <h1 className="font-montserrat text-2xl text-gray-400">
              Entregas a domicilio gratis
            </h1>
          </section>
          {/* top header left links */}
          <section className="flex w-full items-center justify-end gap-6 px-12 pt-2">
            <section className="flex gap-6 text-2xl text-white transition-all">
              <Link
                href="#"
                className="text-2xl text-white transition-all hover:underline hover:underline-offset-4"
              >
                Plantasy
              </Link>
              <Link
                href="#"
                className="text-2xl text-white transition-all hover:underline hover:underline-offset-4"
              >
                Semillas
              </Link>
              <Link
                href="#"
                className="text-2xl text-white transition-all hover:underline hover:underline-offset-4"
              >
                Macetas
              </Link>
              <Link
                href="#"
                className="text-2xl text-white transition-all hover:underline hover:underline-offset-4"
              >
                Accesorios
              </Link>
              <Link
                href="#"
                className="text-2xl text-white transition-all hover:underline hover:underline-offset-4"
              >
                Blog
              </Link>
              <Link
                href="#"
                className="text-2xl text-white transition-all hover:underline hover:underline-offset-4"
              >
                Contacto
              </Link>
            </section>

            {/* top right links */}
            <section className="flex items-center justify-end gap-2">
              <RiSearch2Fill size={25} color="white" />
              <IoPerson size={25} color="white" />
              <FaShoppingCart size={25} color="white" />
            </section>
          </section>
          {/* hero image text */}
          <section className="flex h-full w-full flex-col items-center justify-center">
            <h1 className="font-montserrat text-7xl font-extrabold text-white uppercase">
              Green Land
            </h1>

            <h2 className="font-montserrat mt-10 text-3xl font-bold text-white uppercase">
              El planeta de las plantas
            </h2>

            <h3 className="font-montserrat mt-3 text-xl text-white uppercase">
              De nuestra tierra hasta tu hogar
            </h3>
          </section>
        </section>
      </header>

      {/* main */}
      <main className="min-h-[1000px] flex-1/3">
        {/* feature overview */}
        <section className="mt-10 flex h-full w-full items-center justify-center gap-10">
          {/* fast delivery */}
          <div className="flex h-full w-96 items-center justify-center bg-gray-200 px-4 py-3 shadow-xl">
            <FaTruckFast size={30} />
            <p className="font-montserrat pl-3 text-center text-xl">
              Envío gratuito todo España
            </p>
          </div>
          {/* call support */}
          <div className="flex h-full w-96 items-center justify-center bg-gray-200 px-4 py-3 shadow-xl">
            <FaPhoneSquareAlt size={30} />
            <p className="font-montserrat pl-3 text-center text-xl">
              Atención al cliente las 24hrs
            </p>
          </div>
          {/* refund */}
          <div className="flex h-full w-96 items-center justify-center bg-gray-200 px-4 py-3 shadow-xl">
            <IoArrowUndoCircleSharp size={30} />
            <p className="font-montserrat pl-3 text-center text-xl">
              Garantía de devolución
            </p>
          </div>
        </section>

        {/* products listings */}
        <section className="mx-auto mt-15 grid grid-cols-4 gap-6 px-12">
          {/* product */}
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="flex h-85 w-64 flex-col items-center justify-center gap-2 bg-gray-100"
            >
              <div className="h-[60%]">
                <Image
                  width={200}
                  height={200}
                  src="/images/Product_Laptop.webp"
                  alt="Product Laptop"
                  className="w-full"
                />
              </div>
              <section className="flex h-[40%] w-full flex-col items-center justify-start gap-1">
                <h1 className="font-montserrat text-center text-lg font-bold">
                  Nombre Producto
                </h1>
                <p className="font-montserrat text-center text-sm font-bold text-gray-400">
                  Descripción Producto
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 pb-2">
                  <p className="font-montserrat text-sm font-bold">13$</p>
                  <Button
                    size="xs"
                    variant="default"
                    className="cursor-pointer bg-emerald-600 font-bold text-white shadow-lg hover:bg-emerald-700"
                  >
                    Agregar al carrito
                  </Button>
                  <div className="rounded-full bg-white p-[5px]">
                    <GoHeartFill size={15} color="black" />
                  </div>
                </div>
              </section>
            </div>
          ))}
        </section>
      </main>
      {/* footer */}
      <footer className="flex h-[10vh] justify-between">footer</footer>
    </div>
  );
}
