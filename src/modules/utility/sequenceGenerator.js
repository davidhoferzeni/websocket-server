

function seq(length = 10, ...characterSets) {
    const allowedCharacters = determineSets(characterSets);
    var result = '';
    var charactersLength = allowedCharacters.length;
    for (var i = 0; i < length; i++) {
        result += allowedCharacters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const cs = {
    uc: () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lc: () => 'abcdefghijklmnopqrstuvwxyz',
    num: () => '0123456789',
    all: getAllSets
}

function determineSets(...charSets) {
    return charSets.length > 0? combineSets(charSets) : cs.all();
}

function combineSets(...charSets) {
    const allSetsCombined = charSets.join('');
    const allSetsCombinedWithUniqueValues = [...allSetsCombined].filter(isValueUnique).join('');
    return allSetsCombinedWithUniqueValues;
}

function getAllSets() {
    const allSetKeys = Object.keys(cs);
    const allValidSetKeys = allSetKeys.filter(key => key !== 'all' && typeof cs[key] === 'function');
    const allSetResults = allValidSetKeys.map(key => cs[key]()).filter(value => typeof value === 'string');
    return combineSets(allSetResults);
}

function isValueUnique(value, index, self) {
    return self.indexOf(value) === index;
}





module.exports = {
    cs,
    seq,
};