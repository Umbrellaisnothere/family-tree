import React from "react";

const calculateAge = (birthDate, deathDate) => {
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    let age = end.getFullYear() - birth.getFullYear();
    if (end.getMonth() < birth.getMonth() || (end.getMonth() === birth.getMonth() && end.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

const PersonCard = ({ person }) => {
    return (
        <div className = "flex items-center border border-gray-300 p-4 rounded-lg bg-gray-100 shadow-md space-x-4">
            <img 
            src = {person.image} 
            alt = {person.name} 
            className = "w-20 h-20 rounded-full object-cover" />
            <div>
                <h2 className = "font-semibold text-lg">{person.name}</h2>
                <p className = "text-sm text-gray-600">Born: {person.birthDate}</p>
                {person.deathDate ? (
                    <p className = "text-sm text-red-500">Died: {person.deathDate}</p>
                ) : (
                <p className = "text-sm text-blue-500">Age: {calculateAge(person.birthDate, person.deathDate)}</p>
                )}
            </div>
        </div>
    )
};

export default PersonCard;