import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../userContext';

function PhotoDetail() {
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


    if (!photo) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <div className="card bg-dark text-white">
                <img src={`http://localhost:3001/${photo.path}`} className="card-img-top" alt={photo.name} />
                <div className="card-body">
                    <h3>{photo.name}</h3>
                    <p>{photo.message}</p>
                    <p><small>{new Date(photo.date).toLocaleString()} | Objavil: {photo.postedBy?.username || "neznano"}</small></p>

                    <div>
                        {user && !hasVoted ? (
                            <>
                                <button onClick={() => vote('like')}>👍 {likes}</button>
                                <button onClick={() => vote('dislike')}>👎 {dislikes}</button>
                            </>
                        ) : (
                            <p>{likes} 👍 | {dislikes} 👎</p>
                        )}
                    </div>

                    <div>
                        {user && !hasReported && (
                            <button onClick={reportPhoto} className="btn btn-warning mt-3">
                                Prijavi neprimerno
                            </button>
                        )}
                    </div>
                </div>

                <div className="card-body">
                    <h5>Komentarji:</h5>
                    {comments.length === 0 && <p>Brez komentarjev.</p>}
                    <ul className="list-group list-group-flush">
                        {comments.map((c, idx) => (
                            <li key={idx} className="list-group-item bg-dark text-white border-secondary">
                                <strong>{c.author?.username || "Uporabnik"}:</strong> {c.content}
                            </li>
                        ))}
                    </ul>

                    {user && (
                        <form onSubmit={submitComment} className="mt-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Dodaj komentar..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary">Objavi</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PhotoDetail;
