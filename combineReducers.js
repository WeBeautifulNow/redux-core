// https://github.com/reduxjs/redux/blob/master/src/combineReducers.js
export default function combineReducers(reducers) {
    // 将reducers中所有有效内容放入finalReducers，并取出有效key finalReducerKeys
    const reducerKeys = Object.keys(reducers);
    const finalReducers = {};
    for (let i = 0; i < reducerKeys.length; i++) {
        const key = reducerKeys[i];

        if (typeof reducers[key] === "function") {
            finalReducers[key] = reducers[key];
        }
    }
    const finalReducerKeys = Object.keys(finalReducers);

    // 检查finalReducer中的reducer接受一个初始action或一个未知的action时，是否依旧能够返回有效的值。否则抛错
    assertReducerShape(finalReducers);

    // 返回合并后的reducer
    return function combination(state = {}, action) {
        let hasChanged = false;
        const nextState = {};
        // 循环处理每一个reducer
        for (let i = 0; i < finalReducerKeys.length; i++) {
            const key = finalReducerKeys[i];
            const reducer = finalReducers[key];
            // 当前reducer的旧状态
            const previousStateForKey = state[key];
            // 当前reducer的新状态
            const nextStateForKey = reducer(previousStateForKey, action);
            // 存到nextState中（总的状态）
            nextState[key] = nextStateForKey;
            // 判断当前reducer状态是否改变
            hasChanged = hasChanged || previousStateForKey !== nextStateForKey;
        }
        // 只要有一部分状态改变，就返回整颗新的状态树
        return hasChanged ? nextState : state;
    };
}
