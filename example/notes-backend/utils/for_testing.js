const reverse = (string) => {
    return string
        .split('')
        .reverse()
        .join('')
}
/*
    Input string: "helo"
    const chars = string.split('') = ['h', 'e', 'l', 'o']
    const revChars = chars.reverse() = ['o', 'l', 'e', 'h'] 
    const revString = revChars.join('') = 'oleh'  (if join('-') => revString = 'o-l-e-h')
*/


const average = (array) => {
    const reducer = (sum, item) => {
        return sum + item
    }

    return array.length === 0
        ? 0
        : array.reduce(reducer, 0) / array.length
    // .reduce(function, initialValue): Iterate through the whole array with function
}
/*
    Example: array = [2, 4, 6]
    The above code is the same as:
    let sum = 0
    sum = reducer(sum, 2)
    sum = reducer(sum, 4)
    sum = reducer(sum, 6) 
    return sum
*/ 

module.exports = {
    reverse,
    average,
}