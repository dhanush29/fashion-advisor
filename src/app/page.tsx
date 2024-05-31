import Navbar from '../components/Navbar'; 
import "../app/globals.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="relative">
        <div className="hero-section bg-cover bg-center h-screen" >
          <div className="container mx-auto h-full flex flex-col justify-center items-center text-center text-white relative z-10">
            <h1 className="text-6xl font-bold mb-4">Welcome to Fashion Advisor</h1>
            <p className="text-xl mb-8">Get personalized fashion advice by uploading your photos.</p>
            <a href="/register" className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition">Get Started</a>
          </div>
          <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        </div>
      </div>
    </>
  );
}
