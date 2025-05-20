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

    return (
        <div className="container mx-auto mt-8 px-4">
            <h2 className="text-3xl font-semibold mb-6 text-center">Najbolje ocenjene slike</h2>

            {error && <p className="text-red-600 text-center">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map(photo => (
                    <div key={photo._id} className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
                        <Link to={`/photo/${photo._id}`}>
                            <img
                                src={`http://localhost:3001/${photo.path}`}
                                alt={photo.name || 'Foto'}
                                className="w-full h-64 object-cover rounded-t-lg"
                            />
                        </Link>
                        <div className="p-4">
                            <h3 className="text-xl font-medium mb-2">{photo.name}</h3>
                            <p className="text-sm mb-2">Glasovi: {photo.likes}</p>
                            <p className="text-sm mb-2">Ocena (score): {photo.score.toFixed(2)}</p>
                            <p className="text-xs text-gray-400">Naloženo: {new Date(photo.date).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SortedPhotos;
