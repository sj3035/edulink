import { Outlet } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img
                src="/lovable-uploads/9c2e0ef8-56c7-489c-a082-a92d9d582760.png"
                alt="EduLink Logo"
                className="h-12 w-auto transition-transform duration-300 hover:scale-105"
              />
            </div>
            <ProfileMenu />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};