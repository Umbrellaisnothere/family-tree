export const buildFamilyTree = (persons, relationships) => {
    if (!Array.isArray(persons)) {
        console.error('Expected an array in buildFamilyTree, got:', persons);
        return [];
    }
    if (!Array.isArray(relationships)) {
        console.error('Expected an array of relationships in buildFamilyTree, got:', relationships);
        return [];
    }
    
    const peopleMap = {};
    const roots = [];
    const assignedAsPartner = new Set();

    persons.forEach(person => {
        peopleMap[person.id] = { ...person, children: [], partner: null, parent: null };
    });

    relationships.forEach(rel => {
        const p1 = peopleMap[rel.personId1];
        const p2 = peopleMap[rel.personId2];
        if (!p1 || !p2) return;
        if (rel.type === 'parent') {
            p1.children.push(p2);
            p2.parent = p1;
        }
        if (rel.type === 'spouse') {
            p1.partner = p2;
            p2.partner = p1;
            assignedAsPartner.add(p2.id);
            }
    });

    persons.forEach(person => {
        const isChild = person.parentId && peopleMap[person.parentId];
        const isPartnerOnly = assignedAsPartner.has(person.id);
        if (!isChild && !isPartnerOnly) {
            roots.push(peopleMap[person.id]);
        }
    });

    return roots;
};