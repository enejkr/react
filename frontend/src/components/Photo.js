import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../userContext';

function Photo(props) {
    const { user } = useContext(UserContext);
    const [likes, setLikes] = useState(props.photo.likes || 0);
    const [dislikes, setDislikes] = useState(props.photo.dislikes || 0);
    const [hasVoted, setHasVoted] = useState(props.photo.hasVoted || false);
    const [hasReported, setHasReported] = useState(props.photo.reportedBy?.includes(user?._id));
    const [votedType, setVotedType] = useState(null);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    //const [reports, setReports] = useState(props.photo.reports || 0);

    // pridobi komentarje ob nalaganju
    useEffect(() => {
        fetch(`http://localhost:3001/comments/photo/${props.photo._id}`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setComments(data));
    }, [props.photo._id]);

    const vote = async (type) => {
        if (hasVoted || !user) return;

        const res = await fetch(`http://localhost:3001/photos/${props.photo._id}/${type}`, {
            method: 'POST',
            credentials: 'include'
        });

        const data = await res.json();

        if (res.status === 200) {
            setLikes(data.likes);
            setDislikes(data.dislikes);
            setHasVoted(true);
            setVotedType(type); // "like" ali "dislike"
        }
        else {
            alert(data.message);
        }
    };

    const submitComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        fetch(`http://localhost:3001/comments/photo/${props.photo._id}`, {
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
        fetch(`http://localhost:3001/photos/${props.photo._id}/report`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                setHasReported(true);
            });
    };


    return (
        <div className="card bg-dark text-white mb-3">
            <img className="card-img-top" src={`http://localhost:3001/${props.photo.path}`} alt={props.photo.name} />
            <div className="card-body">
                <h5 className="card-title">{props.photo.name}</h5>
                <p className="card-text">{props.photo.message}</p>
                <p className="card-text">
                    <small>Objavljeno: {new Date(props.photo.date).toLocaleString()}</small>
                </p>
                <p className="card-text">
                    <small>Avtor: {props.photo.postedBy?.username || 'neznano'}</small>
                </p>
            </div>

            <div className="card-footer text-white">
                {user ? (
                    <>
                        <button
                            onClick={() => vote('like')}
                            className={`btn me-2 ${
                                hasVoted
                                    ? votedType === 'like'
                                        ? 'btn-success'
                                        : 'btn-outline-secondary'
                                    : 'btn-outline-success'
                            }`}
                            disabled={hasVoted}
                        >
                            👍 {likes}
                        </button>
                        <button
                            onClick={() => vote('dislike')}
                            className={`btn ${
                                hasVoted
                                    ? votedType === 'dislike'
                                        ? 'btn-danger'
                                        : 'btn-outline-secondary'
                                    : 'btn-outline-danger'
                            }`}
                            disabled={hasVoted}
                        >
                            👎 {dislikes}
                        </button>
                    </>
                ) : (
                    <p>{likes} 👍 | {dislikes} 👎</p>
                )}
            </div>



            <div className="card-body">
                <h6>Komentarji:</h6>
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
    );
}

export default Photo;

