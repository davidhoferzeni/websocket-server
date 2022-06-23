function isNumValid(num, notNegative = false) {
    return !isNaN(num) && (!notNegative || num >= 0);
}

function toBaseArray(id, radix) {
    const resultBaseArray = [];
    let baseIndexNumber = 1;
    let numberIndex = 0;
    do {
        const baseNumber = Math.floor(id / baseIndexNumber);
        const indexResult = baseNumber % radix;
        resultBaseArray.unshift(indexResult);
        numberIndex++;
        baseIndexNumber = Math.pow(radix, numberIndex);
    } while (baseIndexNumber <= id);
    return resultBaseArray;
}

module.exports = {
    isNumValid,
    toBaseArray
};