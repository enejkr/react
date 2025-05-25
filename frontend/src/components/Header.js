import { useContext, useState } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Header({ title }) {
    const { user } = useContext(UserContext);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-blue-600 shadow-md sticky top-0 z-50 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <h1 className="text-2xl font-bold tracking-wide">{title}</h1>

                {/* Desktop nav */}
                <nav className="hidden md:flex space-x-4 items-center">
                    <NavLink to="/" label="Domov" />
                    {user ? (
                        <>
                            <NavLink to="/sorted" label="Popularno" />
                            <NavLink to="/publish" label="Objavi" />
                            <NavLink to="/profile" label="Profil" />
                            <NavLink to="/logout" label="Odjava" red />
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" label="Prijava" />
                            <NavLink to="/register" label="Registracija" />
                        </>
                    )}
                </nav>

                {/* Mobile menu toggle */}
                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white focus:outline-none">
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile nav */}
            {menuOpen && (
                <div className="md:hidden bg-blue-500 px-4 py-3 space-y-2">
                    <NavLink to="/" label="Domov" mobile />
                    {user ? (
                        <>
                            <NavLink to="/sorted" label="Popularno" mobile />
                            <NavLink to="/publish" label="Objavi" mobile />
                            <NavLink to="/profile" label="Profil" mobile />
                            <NavLink to="/logout" label="Odjava" red mobile />
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" label="Prijava" mobile />
                            <NavLink to="/register" label="Registracija" mobile />
                        </>
                    )}
                </div>
            )}
        </header>
    );
}

// ✅ Reusable nav link component
function NavLink({ to, label, red = false, mobile = false }) {
    const baseStyles = `transition-colors duration-200 ${
        red ? "text-red-200 hover:text-red-400" : "hover:text-blue-200"
    }`;

    const desktopClass = `px-3 py-1 rounded-full border border-white text-sm font-medium ${baseStyles}`;
    const mobileClass = `block px-3 py-2 rounded-md text-base ${baseStyles}`;

    return (
        <Link to={to} className={mobile ? mobileClass : desktopClass}>
            {label}
        </Link>
    );
}

export default Header;
