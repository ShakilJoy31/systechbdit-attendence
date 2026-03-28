import Footer from "@/components/navigations/Footer";
import PublicNav from "@/components/navigations/PublicNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNav />
      <div>{children}</div>
      <Footer></Footer>
    </>
  );
}