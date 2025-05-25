import { useContext, useState } from 'react';
import { Navigate } from 'react-router';
import { UserContext } from '../userContext';

function AddPhoto(props) {
    const userContext = useContext(UserContext);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [file, setFile] = useState('');
    const [uploaded, setUploaded] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();

        if (!name) {
            alert("Vnesite ime!");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('message', message);
        formData.append('image', file);
        const res = await fetch('http://localhost:3001/photos', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        const data = await res.json();

        setUploaded(true);
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="container mx-auto p-6 bg-gray-800  text-white shadow-md rounded-lg ">
            {!userContext.user ? <Navigate replace to="/login" /> : ""}
            {uploaded ? <Navigate replace to="/" /> : ""}

            <h1 className="text-3xl font-semibold text-center mb-6">Dodaj sliko</h1>

            <form className="space-y-4" onSubmit={onSubmit}>
                <div>
                    <label htmlFor="name" className="block text-lg font-medium">Ime slike</label>
                    <input
                        type="text"
                        id="name"
                        className="mt-2 block w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                        placeholder="Ime slike"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-lg font-medium">Sporočilo</label>
                    <textarea
                        id="message"
                        className="mt-2 block w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                        placeholder="Sporočilo"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="file" className="block text-lg font-medium">Izberi sliko</label>
                    <input
                        type="file"
                        id="file"
                        onChange={(e) => { setFile(e.target.files[0]) }}
                        className="mt-2 block w-full text-white bg-gray-700 border-2 border-gray-600 rounded-md"
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                    >
                        Naloži
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
}

export default AddPhoto;
