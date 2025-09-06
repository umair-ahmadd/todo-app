import Image from "next/image";
import landing_bg from "./landing_bg.jpeg";
import Navbar from "@/ui/Navbar";
import Link from "next/link";

export  default function Home() {
  return (
    <>
    <div className="fixed  inset-0 -z-10 overflow-hidden">
      <Image 
      className="object-cover" 
      src={landing_bg}
      alt="Background"
      fill
      placeholder="blur"
      priority
      ></Image>
    </div>
    <Navbar />
    <div className="relative z-10 flex flex-col items-center justify-center mt-40 border-red-600 text-white px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Todo App</h1>
      <p className="text-lg">Manage your tasks efficiently!</p>
      <Link className="bg-amber-100 rounded-full hover:bg-amber-200 text-blue-950 font-bold py-2 px-5 mt-4" href="/auth/login">Start for Free</Link>
    </div>

    </>

  );
}

