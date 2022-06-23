const mathOps = require('./mathOps');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function fromTo(from, to) {
    if (!mathOps.isNumValid(from, true) || !mathOps.isNumValid(to, true) || from >= to) {
        throw `The given values 'from' [${from}] or 'to' [${to}] are invalid or 'from' is larger than or equal to 'to'!`;
    }
    const fullArray = Array.from(Array(to+1).keys());
    return fullArray.splice(from, to-from+1);
}

function isUnique(value, index, array) {
    return array.indexOf(value) === index;
}

module.exports = {
    shuffle,
    fromTo,
    isUnique
};