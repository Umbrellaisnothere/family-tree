import React, { useState } from "react";
import PersonCard from "./PersonCard";
import "./FamilyTree.css";

const FamilyTree = ({ family = [], isRoot = true }) => {
    const [tree, setTree] = useState(family);

    const addChild = (parentId) => {
        const newChild = {
            id: Date.now(),
            name: "New Child",
            birthDate: "2000-01-01",
            image: "https://picsum.photos/80",
            children: []
        };

        const updateTree = (nodes) => 
            nodes.map(node => {
                if (node.id === parentId) {
                    return { ...node, children: [...node.children, newChild] };
                } 
                return { ...node, children: updateTree(node.children || []) };
            });

        setTree(updateTree(tree));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {isRoot && <h1 className="text-2xl font-bold text-center mb-4">Ancestral Tree</h1>}
            <div className="space-y-4">
                {tree.length > 0 ? (tree.map((person) => (
                    <div key={person.id} className="family-node">
                        <PersonCard person={person} />

                        <button
                            onClick={() => addChild(person.id)}
                            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
                            ➕
                        </button>

                        {person.children && person.children.length > 0 && (
                            <div className="family-children">
                                {person.children.map((child) => (
                                    <div key={child.id}>
                            <FamilyTree family={[child]} isRoot={false} />
                    </div>
                ))}
                </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No data available</p>
            )}
        </div>
    </div>
    );
};

export default FamilyTree;
