import { get, post } from './http';
export function getSearchList() {
    const result = get('/graphNew/search.gm');
    return result;
}
export function postLogin(url,param){
    const result = post(url, param);
    return result;
}