import React from "react";
import PersonCard from "./PersonCard";

const FamilyTree = ({ family }) => {
    return (
        <div className = "p-6 bg-white rounded-lg shadow-md">
            <h1 className = "text-2xl font-bold text-center mb-4">Ancestral Tree</h1>"
            <div className = "space-y-4">{family.map((person) => (
                <div key= {person.id} className = "ml-6 border-l-2 border-gray-300 pl-4">
                    <PersonCard person = {person} />
                    {person.children && person.children.length > 0 && (
                        <FamilyTree family = {person.children} />
                    )}
                </div>
            ))}</div>
        </div>
    );
};

export default FamilyTree;