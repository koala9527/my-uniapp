// 获取用户信息和地址
export function getUserInfo(params) {
    return request.get("/curriculum/user/getUserInfo", params);
}