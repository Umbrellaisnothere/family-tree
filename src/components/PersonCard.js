import React, { useState } from "react";
import './PersonCard.css';

const calculateAge = (birthDate, deathDate) => {
    const birth = new Date(birthDate);
    const death = deathDate ? new Date(deathDate) : new Date();
    let age = death.getFullYear() - birth.getFullYear();
    const month = death.getMonth();
    if (month < birth.getMonth() || (month === birth.getMonth() && death.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

const PersonCard = ({ person, onAddChild, onDelete, isPartner = false, expanded, onToggle }) => {
    const [image, setImage] = useState(person.image);
    const [gender, setGender] = useState(person.gender || '');
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImage(imageURL);

            const formData = new FormData();
            formData.append('image', file);

            try {
                setUploading(true);
                const response = await fetch(`http://localhost:5000/api/family/${person.id}/image`, {
                    method: 'PATCH',
                    body: formData,
                });

                if (!response.ok) throw new Error('Failed to upload image');

                setUploadMessage('Image uploaded successfully');
            } catch (error) {
                console.error('Error uploading image:', error);
                setUploadMessage('Failed to upload image.');
            } finally {
                setUploading(false);
                setTimeout(() => setUploadMessage(''), 3000);
            }
        }
    };

    const handleGenderChange = async (e) => {
        const newGender = e.target.value;
        setGender(newGender);

        try {
            const response = await fetch(`http://localhost:5000/api/person/${person.id}/gender`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gender: newGender }),
            });

            if (!response.ok) {
                throw new Error('Failed to update gender');
            }

            const updatedPerson = await response.json();
            console.log('Gender updated successfully:', updatedPerson);
        } catch (error) {
            console.error('Error updating gender:', error);
        }
    };

    const getRelationship = () => {
        if (person.relationship?.trim()) return person.relationship;
        if (person.isPartner) return 'Partner';
        if (person.children?.length > 0) return 'Parent';
        return 'N/A';
    };

    return (
        <div id={`person-${person.id}`} className={`person-card ${gender} ${person.deathDate ? 'deceased' : ''}`}>
            <img
                src={image || 'default-avatar.png'}
                alt={person.name}
                className='person-image'
                onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.png' }} />
            <div className="person-name">{person.name}</div>

            {person.deathDate && (
                <div className="person-deceased-note">🕊 Deceased</div>
            )}

            <label className="person-details">
                <strong>Gender:</strong>
                <select value={gender} onChange={handleGenderChange} className="gender-select">
                    <option value="">Unknown</option>
                    <option value="male">♂️ Male</option>
                    <option value="female">♀️ Female</option>
                    <option value="other">⚧️ Other</option>
                </select>
            </label>

            <div className="person-details">
                <strong>Relationship:</strong> {getRelationship()}
            </div>

            {person.birthDate && (
                <>
                    <div className="person-details"><strong>Born:</strong> {person.birthDate}</div>
                    {person.deathDate ? (
                        <div className="person-details"><strong>Died:</strong> {person.deathDate}</div>
                    ) : (
                        <div className="person-details"><strong>Age:</strong> {calculateAge(person.birthDate)}</div>
                    )}
                </>
            )}


            <label htmlFor={`upload-${person.id}`} className="person-details">
                <strong>Upload Image:</strong>
            </label>
            <input
                id={`upload-${person.id}`}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="person-details"
                disabled={uploading}
            />

            {uploading && <div className="uploading">Uploading...</div>}
            {uploadMessage && <div className="upload-message">{uploadMessage}</div>}

            <div className="card-actions">
                <button
                    onClick={() => onAddChild(person.id)}
                    className='card-btn'
                    disabled={!!person.deathDate}
                >
                    ➕&nbsp;Add Child
                </button>
                <button
                    onClick={() => onDelete(person.id, person.parentId)}
                    className='card-btn delete'
                    disabled={!!person.deathDate}
                >
                    🗑&nbsp;Delete
                </button>
            </div>


        </div>
    );
};

export default React.memo(PersonCard);