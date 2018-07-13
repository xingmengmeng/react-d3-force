function throttle(fn, delay, atleast) {
    let timer = null;
    let previous = null;

    return function () {
        let now = +new Date();
        if (!previous) previous = now;
        if (atleast && now - previous > atleast) {
            fn();
            // 重置上一次开始时间为本次结束时间
            previous = now;
            clearTimeout(timer);
        } else {
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn();
                previous = null;
            }, delay);
        }
    }
};
export { throttle }

