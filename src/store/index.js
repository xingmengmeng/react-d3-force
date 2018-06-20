import { createStore } from 'redux';
function reducer(state, action) {
    state = {
        showLoading: false,
    }
    switch (action.type) {
        case 'SHOW':
            // state = Object.assign({}, state, state.showLoading = true)
            // return state;
            return { ...state, showLoading: true }
        case 'HIDE':
            // state = Object.assign({}, state, state.showLoading = false)
            // return state;
            return { ...state, showLoading: false }
        default:
            return state;
    }
}
export default createStore(reducer);