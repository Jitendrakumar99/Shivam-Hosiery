import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1 relative">
        <Sidebar />
        <main className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 overflow-auto md:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

