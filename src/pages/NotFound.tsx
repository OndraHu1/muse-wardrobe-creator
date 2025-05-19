import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl mb-4">Stránka nenalezena</p>
          <Link to="/" className="text-primary hover:text-primary/80 underline">
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
