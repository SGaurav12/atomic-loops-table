import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button"; // if you're using shadcn's Button
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate("/login");
  }

  return (
    <header className="text-black pr-4 pb-4">
      <div className="max-w-8xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Application</h1>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Hi, {user.email}</span>
            <Button className="cursor-pointer" variant="outline" size="sm" onClick={handleClick}>
              Logout
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
