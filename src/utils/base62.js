const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

exports.encode = (num) => {
    num = BigInt(num);
    let result = "";
    let base = 62n;
    while (num > 0n) {
        const remainder = num % base;
        result = chars[Number(remainder)] + result;
        num = num / base;
    }
    return result;
};