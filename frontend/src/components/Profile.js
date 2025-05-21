import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Profile(){
    const userContext = useContext(UserContext); 
    const [profile, setProfile] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);


    useEffect(function(){
        const getProfile = async function(){
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
    }, []);
    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        if (!avatarFile) return;

        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const res = await fetch("http://localhost:3001/users/upload-avatar", {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const data = await res.json();
        if (data.avatarPath) {
            setProfile(prev => ({ ...prev, avatarPath: data.avatarPath }));
        }
    };

    if (!userContext.user) {
        return <Navigate replace to="/login" />;
    }
    return (
        <div >
            <h1 >Profil uporabnika</h1>

            <div className="flex justify-center mb-6">
                {profile.avatarPath ? (
                    <img
                        src={`http://localhost:3001/${profile.avatarPath}`}
                        alt="Avatar"
                        className="w-32 h-32 rounded-full border-4 border-blue-500"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-500 flex items-center justify-center text-3xl text-white">
                        N/A
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <p><strong className="font-medium">Uporabniško ime:</strong> {profile.username}</p>
                <p><strong className="font-medium">Email:</strong> {profile.email}</p>
                <p><strong className="font-medium">Število objav:</strong> {profile.photoCount}</p>
                <p><strong className="font-medium">Prejeti všečki:</strong> {profile.totalLikes}</p>
                <p><strong className="font-medium">Oddani komentarji:</strong> {profile.commentCount}</p>
            </div>

            <form onSubmit={handleAvatarUpload} className="mt-6 flex justify-center">
                <div className="flex items-center space-x-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatarFile(e.target.files[0])}
                        className="file:border-2 file:border-blue-500 file:bg-blue-500 file:text-white file:px-4 file:py-2 file:rounded-md"
                    />
                    <button type="submit" className="btn btn-primary mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">
                        Naloži avatar
                    </button>
                </div>
            </form>
        </div>
    );
}
export default Profile;