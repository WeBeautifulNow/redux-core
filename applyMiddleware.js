/*
    中间件是一个函数，输入是store的getState和dispatch，输出为改造函数（改造dispatch的函数）
    改造函数输入是一个dispatch，输出「改造后的dispatch」
*/
export default function applyMiddleware(...middlewares) {
    return createStore => (...args) => {
        const store = createStore(...args);
        // dispatch改造完成前使用就报错
        let dispatch = () => {
            throw new Error(
                "Dispatching while constructing your middleware is not allowed. " +
                    "Other middleware would not be applied to this dispatch."
            );
        };

        const middlewareAPI = {
            getState: store.getState,
            dispatch: (...args) => dispatch(...args)
        };
        // 调用每一个中间件，得到改造后的若干个dispatch组成的数组
        const chain = middlewares.map(middleware => middleware(middlewareAPI));
        // 将改造后的dispatch组成的数组结合成一个函数
        dispatch = compose(...chain)(store.dispatch);

        // 总体过程就是通过middleware改造store的dispatch方法
        return {
            ...store,
            dispatch
        };
    };
}
