function getLastElem(array) {
    return array[array.length - 1];
}

function remElem(array, index) {
    array.splice(index, 1);
}

function addElem(array, index, elem) {
    array.splice(index, 0, elem);
}