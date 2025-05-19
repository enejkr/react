import React, { useState } from 'react';

function Photo(props) {
    const [likes, setLikes] = useState(props.photo.likedBy?.length || 0);
    const [dislikes, setDislikes] = useState(props.photo.dislikedBy?.length || 0);

    const handleLike = async () => {
        try {
            const response = await fetch(`http://localhost:3001/photos/${props.photo._id}/like`, {
                method: 'POST',
            });
            const data = await response.json();
            setLikes(data.likedBy.length);
            setDislikes(data.dislikedBy.length);
        } catch (error) {
            console.error('Napaka pri like:', error);
        }
    };

    const handleDislike = async () => {
        try {
            const response = await fetch(`http://localhost:3001/photos/${props.photo._id}/dislike`, {
                method: 'POST',
            });
            const data = await response.json();
            setLikes(data.likedBy.length);
            setDislikes(data.dislikedBy.length);
        } catch (error) {
            console.error('Napaka pri dislike:', error);
        }
    };

    return (
        <div className="card bg-dark text-dark mb-2">
            <img className="card-img" src={`http://localhost:3001/${props.photo.path}`} alt={props.photo.name} />
            <div className="card-img-overlay">
                <h5 className="card-title">{props.photo.name}</h5>
                <p className="card-text">{props.photo.description}</p>

                <div className="mt-3 d-flex gap-3 align-items-center">
                    <button onClick={handleLike} className="btn btn-success">
                        👍 Like ({likes})
                    </button>
                    <button onClick={handleDislike} className="btn btn-danger">
                        👎 Dislike ({dislikes})
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Photo;
