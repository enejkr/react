import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SortedPhotos() {
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch('http://localhost:3001/photos/sorted')
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Napaka ${res.status}: ${text}`);
                }
                return res.json();
            })
            .then(data => setPhotos(data))
            .catch(err => {
                console.error("Napaka pri fetchu:", err);
                setError(err.message);
            });
    }, []);

    return (  <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="container bg-gray-900 mx-auto px-6 py-10">
            <h2 className="text-4xl font-bold text-center text-white mb-10"> Najbolje ocenjene slike</h2>

            {error && <p className="text-red-500 text-center mb-6">{error}</p>}

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {photos.map(photo => (
                    <div
                        key={photo._id}
                        className="bg-gray-800 text-white rounded-2xl shadow-xl hover:scale-105 transform transition duration-300"
                    >
                        <Link to={`/photo/${photo._id}`}>
                            <img
                                src={`http://localhost:3001/${photo.path}`}
                                alt={photo.name || 'Foto'}
                                className="w-full h-60 object-cover rounded-t-2xl"
                            />
                        </Link>
                        <div className="p-5">
                            <h3 className="text-xl font-semibold mb-1 truncate">{photo.name}</h3>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span>{photo.likes}</span>
                                <span>{photo.score.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-gray-400">{new Date(photo.date).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
        </div>
    );
}

export default SortedPhotos;
