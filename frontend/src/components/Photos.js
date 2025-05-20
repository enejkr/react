import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Photos() {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/photos")
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setPhotos(sorted);
            });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Vse slike</h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {photos.map(photo => (
                    <div
                        key={photo._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                    >
                        <Link to={`/photo/${photo._id}`}>
                            <img
                                src={`http://localhost:3001/${photo.path}`}
                                alt={photo.name}
                                className="w-full h-64 object-cover"
                            />
                        </Link>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900">{photo.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Objavil: {photo.postedBy?.username || "neznano"}<br />
                                Datum: {new Date(photo.date).toLocaleString()}<br />
                                👍 {photo.likes} | 👎 {photo.dislikes}
                            </p>
                            <Link
                                to={`/photo/${photo._id}`}
                                className="inline-block mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Poglej podrobnosti →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Photos;
