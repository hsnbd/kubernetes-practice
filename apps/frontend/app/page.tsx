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
        <div className="h-full w-full bg-[url('/images/HeroImage.jpg')] bg-cover bg-center bg-no-repeat shadow-xl">
          {/* top header */}
          <div className="flex h-8 w-full items-center justify-center bg-gray-300">
            <h1 className="font-montserrat text-2xl text-gray-400">
              Entregas a domicilio gratis
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
      <main className="min-h-[1000px] flex-1/3">
        {/* feature overview */}
        <div className="mt-10 flex h-full w-full items-center justify-center gap-10">
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
        </div>

        {/* products listings */}
        <div className="mx-auto mt-15 grid grid-cols-4 gap-6 px-12">
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
              <div className="flex h-[40%] w-full flex-col items-center justify-start gap-1">
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
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* footer */}
      <footer className="flex h-[10vh] justify-between">footer</footer>
    </div>
  );
}
