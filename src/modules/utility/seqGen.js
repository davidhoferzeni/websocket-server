
const arrOps = require('./arrOps');
const mathOps = require('./mathOps');

function rdmSeq(length = 10, ...characterSets) {
    const allowedCharacters = determineSets(characterSets);
    var result = '';
    var charactersLength = allowedCharacters.length;
    for (var i = 0; i < length; i++) {
        result += allowedCharacters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function idSeq(id, ...characterSets) {
    const allowedCharacters = determineSets(characterSets);
    const radix = allowedCharacters.length;
    if (!mathOps.isNumValid(id, true)) {
        throw `The given id [${id}] is not a number or smaller than 0!`;
    }
    const baseArray = mathOps.toBaseArray(id, radix);
    return baseArray.map(b => allowedCharacters[b]).join('');
}

function idFixSeq(id, fixedLength, ...characterSets) {
    const allowedCharacters = determineSets(characterSets);
    if (!mathOps.isNumValid(id, true)) {
        throw `The given fixedLength [${fixedLength}] is not a number or smaller than 0!`;
    }
    let resultSequence = idSeq(id, ...characterSets);
    if (resultSequence.length > fixedLength) {
        throw `The passed id produces a sequence of length [${resultSequence.length}], which is longer that fixedLength of [${fixedLength}]`;
    }
    while (resultSequence.length < fixedLength) {
        resultSequence = allowedCharacters[0] + resultSequence;
    }
    return resultSequence;
}

function fixSeqList(fixedLength, ...characterSets) {
    const allowedCharacters = determineSets(characterSets);
    const maxNumber = Math.pow(allowedCharacters.length, fixedLength) - 1;
    const idArray = arrOps.fromTo(0, maxNumber);
    return idArray.map(id => idFixSeq(id, fixedLength, characterSets));
}

const cs = {
    uc: () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lc: () => 'abcdefghijklmnopqrstuvwxyz',
    num: () => '0123456789',
    hex: () => cs.num() + 'abcdef',
    all: getAllSets
}

function determineSets(...charSets) {
    const flattenedSet = charSets.flat(Infinity);
    return flattenedSet.length > 0 ? combineSets(charSets) : cs.all();
}

function combineSets(...charSets) {
    const allSetsCombined = charSets.join('');
    const allSetsCombinedWithUniqueValues = [...allSetsCombined].filter(arrOps.isUnique).join('');
    return allSetsCombinedWithUniqueValues;
}

function getAllSets() {
    const allSetKeys = Object.keys(cs);
    const allValidSetKeys = allSetKeys.filter(key => key !== 'all' && typeof cs[key] === 'function');
    const allSetResults = allValidSetKeys.map(key => cs[key]()).filter(value => typeof value === 'string');
    return combineSets(allSetResults);
}


module.exports = {
    cs,
    rdmSeq,
    idSeq,
    idFixSeq,
    fixSeqList
};