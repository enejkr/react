import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../userContext';

function Photo() {
    const { id } = useParams();
    const { user } = useContext(UserContext);

    const [photo, setPhoto] = useState(null);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [hasVoted, setHasVoted] = useState(false);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [hasReported, setHasReported] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3001/photos/${id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setPhoto(data);
                setLikes(data.likes);
                setDislikes(data.dislikes);

                if (user && data.reportedBy?.includes(user._id)) {
                    setHasReported(true);
                }
            });

        fetch(`http://localhost:3001/comments/photo/${id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(setComments);
    }, [id, user]);

    const vote = async (type) => {
        if (hasVoted || !user) return;

        const res = await fetch(`http://localhost:3001/photos/${id}/${type}`, {
            method: 'POST',
            credentials: 'include'
        });
        const data = await res.json();

        if (res.status === 200) {
            setLikes(data.likes);
            setDislikes(data.dislikes);
            setHasVoted(true);
        } else {
            alert(data.message);
        }
    };

    const submitComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        fetch(`http://localhost:3001/comments/photo/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ content: newComment })
        })
            .then(res => res.json())
            .then(data => {
                setComments(prev => [...prev, data]);
                setNewComment("");
            });
    };

    const reportPhoto = () => {
        fetch(`http://localhost:3001/photos/${photo._id}/report`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.message === "Prijava uspešna.") {
                    setHasReported(true);
                }
            });
    };

    if (!photo) return <p className="text-white">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
            <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <img
                    src={`http://localhost:3001/${photo.path}`}
                    alt={photo.name}
                    className="w-full h-80 object-cover"
                />
                <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{photo.name}</h3>
                    <p className="mb-3 text-gray-300">{photo.message}</p>
                    <p className="text-sm text-gray-400">
                        {new Date(photo.date).toLocaleString()} | Objavil: {photo.postedBy?.username || "neznano"}
                    </p>

                    <div className="mt-4">
                        {user && !hasVoted ? (
                            <div className="space-x-4">
                                <button
                                    onClick={() => vote('like')}
                                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                                >
                                    👍 {likes}
                                </button>
                                <button
                                    onClick={() => vote('dislike')}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                                >
                                    👎 {dislikes}
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-300 mt-2">👍 {likes} | 👎 {dislikes}</p>
                        )}
                    </div>

                    <div className="mt-4">
                        {user && !hasReported && (
                            <button
                                onClick={reportPhoto}
                                className="mt-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-black"
                            >
                                Prijavi neprimerno
                            </button>
                        )}
                        {user && hasReported && (
                            <p className="mt-2 text-yellow-400">Slika je že prijavljena.</p>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-700">
                    <h5 className="text-xl font-semibold mb-4">Komentarji:</h5>
                    {comments.length === 0 ? (
                        <p className="text-gray-500">Brez komentarjev.</p>
                    ) : (
                        <ul className="space-y-2 max-h-64 overflow-y-auto">
                            {comments.map((c, idx) => (
                                <li
                                    key={idx}
                                    className="bg-gray-800 p-3 rounded-lg border border-gray-700"
                                >
                                    <strong>{c.author?.username || "Uporabnik"}:</strong> {c.content}
                                </li>
                            ))}
                        </ul>
                    )}

                    {user && (
                        <form onSubmit={submitComment} className="mt-4 flex gap-2">
                            <input
                                type="text"
                                placeholder="Dodaj komentar..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1 px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                            >
                                Objavi
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Photo;
