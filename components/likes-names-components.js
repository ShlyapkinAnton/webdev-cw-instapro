export function likes(arr) {
    let namesArr = [];
    arr.forEach((element) => {
        return namesArr.push(element.name);
    });
    switch (namesArr.length) {
        case 0:
            return "0";
        case 1:
            return `${namesArr[0]}`;
        case 2:
            return `${namesArr[0]} и ${namesArr[1]}`;
        case 3:
            return `${namesArr[0]}, ${namesArr[1]} и ${namesArr[2]}`;
        default:
            return `${namesArr[0]}, ${namesArr[1]} и еще ${namesArr.length - 2}`;
    }
}