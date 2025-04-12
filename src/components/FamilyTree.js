import React, { useState, useEffect } from "react";
import { buildFamilyTree } from "../utilities/buildFamilyTree";
import PersonCard from "./PersonCard";
import "./FamilyTree.css";

const FamilyTree = ({ isRoot = true }) => {
    const [tree, setTree] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/family')
            .then(res => res.json())
            .then(data => {
                const treeData =buildFamilyTree(data);
                setTree(treeData);
            })
            .catch(err => console.error('Error fetching family:', err));
    }, []);

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
        <div className="family-tree-container">
    {isRoot && <h1 className="family-tree-header">Ancestral Tree</h1>}
    <div className="family-tree">
        {Array.isArray(tree) && tree.length > 0 ? (tree.map((person) => (
            <div key={person.id} className="family-node">
                <PersonCard person={person} />

                <button
                    onClick={() => addChild(person.id)}
                    className="add-child-btn">
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