function isNum(str) {
    if (!str) return null;
    let toInt = parseInt(str);
    return toInt == str ? toInt : null;
}

console.log(isNum('123'));