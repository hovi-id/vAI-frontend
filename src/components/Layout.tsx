import React from 'react';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  return <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex flex-col py-0">
      <div className="w-full bg-primary text-primary-foreground py-2 px-4 text-center text-sm">
        <div className="max-w-screen-md mx-auto">Showcasing Verifiable AI — A project built for the cheqd Verifiable AI Hackathon</div>
      </div>
      
      <main className="flex-1 flex items-center justify-center p-6 mx-0 py-[25px] my-[30px]">
        <div className="w-full max-w-screen-md mx-auto">
          {children}
        </div>
      </main>
      
      <footer className="w-full px-6 py-4 text-center">
        <div className="max-w-screen-lg mx-auto flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">Powered by</p>
          <div className="flex items-center justify-center gap-8">
            <img src="/uploads/2682e570-ba15-4ecb-ac91-c67ba96a2866.png" alt="Bland" className="h-6 object-contain" />
            <img src="/uploads/fa44f062-6b58-4428-9cdc-863bd7834f84.png" alt="Hovi" className="h-6 object-contain" />
            <img src="/uploads/7ff404f5-5bc3-4a09-b0a2-d810fd7d9dc6.png" alt="Cheqd" className="h-6 object-contain" />
          </div>
          <div className="text-sm text-muted-foreground mt-4">This project is open source and licensed under the MIT License. <a target="_blank" href="https://github.com/hovi-id/vAI-frontend"><b>View it on GitHub</b></a></div>
        </div>
      </footer>
    </div>;
};
export default Layout;