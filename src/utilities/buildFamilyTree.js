export const buildFamilyTree = (people) => {
    const peopleMap = {};
    const roots = [];

    people.forEach(person => {
        peopleMap[person.id] = { ...person, children: [] };
    });

    people.forEach(person => {
        if (person.parentId && peopleMap[person.parentId]) {
            peopleMap[person.parentId].children.push(peopleMap[person.id]);
        } else {
            roots.push(peopleMap[person.id]);
        }
    });

    return roots;
};