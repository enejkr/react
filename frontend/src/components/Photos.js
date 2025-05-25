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
        <div className="min-h-screen bg-gray-900 px-4 py-10 text-white">
            <h2 className="text-3xl font-bold mb-10 text-center">slike</h2>

            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                {photos.map(photo => (
                    <div
                        key={photo._id}
                        className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden group transition-transform hover:scale-[1.02]"
                    >
                        <Link to={`/photo/${photo._id}`} className="block relative">
                            <img
                                src={`http://localhost:3001/${photo.path}`}
                                alt={photo.name}
                                className="w-full h-64 object-cover group-hover:opacity-90 transition duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1">
                                {new Date(photo.date).toLocaleDateString("sl-SI", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </div>
                        </Link>

                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-white">{photo.name}</h3>
                            <p className="text-sm text-gray-400 mt-1">
                                Objavil: <span className="font-medium">{photo.postedBy?.username || "neznano"}</span>
                            </p>
                            <div className="flex justify-between items-center mt-2 text-gray-400 text-sm">
                                <span>👍 {photo.likes}</span>
                                <span>👎 {photo.dislikes}</span>
                            </div>
                            <Link
                                to={`/photo/${photo._id}`}
                                className="inline-block mt-4 text-blue-400 hover:text-blue-600 text-sm font-medium transition-colors"
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
