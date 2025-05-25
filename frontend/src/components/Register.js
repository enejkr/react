import { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [captchaToken, setCaptchaToken] = useState("");
    const [csrfToken, setCsrfToken] = useState("");

    useEffect(() => {
        fetch('http://localhost:3001/users/csrf-token', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setCsrfToken(data.csrfToken))
            .catch(() => setError("Napaka pri pridobivanju CSRF žetona."));
    }, []);

    async function handleRegister(e) {
        e.preventDefault();

        if (!captchaToken) {
            setError("Prosimo, potrdite CAPTCHA.");
            return;
        }

        if (!csrfToken) {
            setError("Napaka pri pridobivanju CSRF žetona.");
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/users", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ email, username, password, captchaToken })
            });

            const data = await res.json();
            if (data._id) {
                window.location.href = "/";
            } else {
                setUsername("");
                setPassword("");
                setEmail("");
                setCaptchaToken("");
                setError(data.message || "Registracija ni uspela.");
            }
        } catch (err) {
            setError("Napaka pri registraciji: " + err.message);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-4xl font-bold mb-6 text-center">Registracija</h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="peer w-full px-4 pt-6 pb-2 bg-gray-700 text-white rounded-md placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email"
                        />
                        <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">
                            Email
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="peer w-full px-4 pt-6 pb-2 bg-gray-700 text-white rounded-md placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Uporabniško ime"
                        />
                        <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">
                            Uporabniško ime
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="peer w-full px-4 pt-6 pb-2 bg-gray-700 text-white rounded-md placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Geslo"
                        />
                        <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">
                            Geslo
                        </label>
                    </div>

                    <div className="flex justify-center">
                        <ReCAPTCHA
                            sitekey="6Lcs2y4rAAAAAP-VkZsfX2RomonLOAnGfg1be-4y"
                            onChange={(token) => setCaptchaToken(token)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Registriraj se
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
