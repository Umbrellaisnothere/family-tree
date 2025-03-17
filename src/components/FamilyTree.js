// 

import React, { useState, useEffect } from "react";
import PersonCard from "./PersonCard";

const FamilyTree = ({ family, isRoot = true }) => {
    const [tree, setTree] = useState(family);

    useEffect(() => {
        setTree(family);
    }, [family]);

    const addChild = (parentId) => {
        const newChild = {
            id: Date.now(),
            name: "New Child",
            birthDate: "2000-01-01",
            image: "https://picsum.photos/80",
            children: []
        };

        const updateTree = (nodes = []) => 
            nodes.map(node => {
                if (node.id === parentId) {
                    return { ...node, children: [...node.children, newChild] };
                } 
                return { ...node, children: updateTree(node.children || []) };
            });

        setTree(prevTree => updateTree(prevTree || []));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {isRoot && <h1 className="text-2xl font-bold text-center mb-4">Ancestral Tree</h1>}
            <div className="space-y-4">
                {tree.map((person) => (
                    <div key={person.id} className="ml-6 border-l-2 border-gray-300 pl-4">
                        <PersonCard person={person} />

                        <button
                            onClick={() => addChild(person.id)}
                            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
                            ➕
                        </button>

                        {person.children && person.children.length > 0 && (
                            <FamilyTree family={person.children} isRoot={false} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FamilyTree;
