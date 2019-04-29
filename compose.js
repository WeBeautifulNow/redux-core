export default function compose(...funcs) {
    // 输入不合规时，返回一个函数，该函数返回输入的值
    if (funcs.length === 0) {
        return arg => arg;
    }

    // 当输入只有一个函数的时候，返回该函数本身
    if (funcs.length === 1) {
        return funcs[0];
    }

    // 一个接一个执行完所有函数
    return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
