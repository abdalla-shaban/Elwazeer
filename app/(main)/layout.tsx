import Footer from "@/components/Footer";
import MobileTabBar from "@/components/Navbar/MobileTabBar";
import Navbar from "@/components/Navbar/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="pt-21 relative pb-5 min-h-screen bg-gray-100">
        <div>{children}</div>
        <MobileTabBar />
      </main>
      <Footer />
    </>
  );
}
