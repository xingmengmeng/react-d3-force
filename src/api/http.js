import axios from 'axios';
import qs from 'qs';
import store from '../store';
import * as actions from '../store/actions';
// 拦截请求
axios.interceptors.request.use(function (config) {
    store.dispatch(actions.showLoading());
    return config
});

// 拦截相应
axios.interceptors.response.use(function (config) {
    store.dispatch(actions.hideLoading());
    if (config.data.code === 203) {
        window.location.href = '/login';
        return false;
    }
    return config
}, err => {
    let status = err || err.response.status;
    console.log(status)
});

function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
function post(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
        ).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
function deletes(url, params) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {
            params: params
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export {
    get,
    post,
    deletes
}