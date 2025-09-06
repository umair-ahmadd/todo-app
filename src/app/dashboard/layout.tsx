import SideNav from "@/ui/SideNav";
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-white flex-row">
      <div className="w-auto h-screen">
        <SideNav />
      </div>
      <div className="flex-1 h-screen overflow-y-auto">{children}</div>
    </div>
  );
}