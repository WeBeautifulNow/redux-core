// https://github.com/reduxjs/redux/blob/master/src/createStore.js
function createStore(reducer, preloadedState, enhancer) {
    if (enhancer是有效的) {
    }

    let currentReducer = reducer; // 当前store中的reducer
    let currentState = preloadedState; // 当前store中存储的状态
    let currentListeners = []; // 当前store中放置的监听函数
    let nextListeners = currentListeners; // 下一次dispatch时的监听函数
    // 注意：当我们新添加一个监听函数时，只会在下一次dispatch的时候生效。

    // ...

    // 获取state
    function getState() {
        return currentState;
    }

    // 添加一个监听函数，每当dispatch被调用的时候都会执行这个监听函数
    function subscribe() {
        // 添加到监听函数数组，添加的是到下一次dispatch时才会生效的数组
        nextListeners.push(listener);
        let isSubscribe = true; //设置一个标志，标志该监听器已经订阅了
        // 返回取消订阅的函数，即从数组中删除该监听函数
        return function unsubscribe() {
            if (!isSubscribe) {
                return; // 如果已经取消订阅过了，直接返回
            }

            isSubscribe = false;
            // 从下一轮的监听函数数组（用于下一次dispatch）中删除这个监听器。
            const index = nextListeners.indexOf(listener);
            nextListeners.splice(index, 1);
        };
    }

    // 触发了一个action，因此我们调用reducer，得到的新的state，并且执行所有添加到store中的监听函数。
    function dispatch() {
        // 通过reducer，生成新的state
        currentState = currentReducer(currentState, action);
        // 让每一个订阅者收到信号
        const listeners = (currentListeners = nextListeners);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }
    }

    function replaceReducer(nextReducer) {
        currentReducer = nextReducer;
        dispatch({ type: ActionTypes.REPLACE });
    }

    function observable() {}

    return {
        dispatch,
        subscribe,
        getState,
        replaceReducer,
        [$$observable]: observable
    };
}
