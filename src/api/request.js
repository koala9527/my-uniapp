
export const baseUrl =
globalConfig[process.env.NODE_ENV === "development" ? "devApi" : "prodApi"];

export default {
    config: {
        baseUrl: baseUrl,
        header: {
            "Content-Type": "application/json",
            // 'Content-Type':'application/x-www-form-urlencoded'
        },
        data: {},
        method: "GET",
        dataType: "json" /* 如设为json，会对返回的数据做一次 JSON.parse */ ,
        responseType: "text",
        success() {},
        fail() {},
        complete() {},
    },
    interceptor: {
        request: (config) => {
            if (stateCode && stateCode == 5006) {
                uni.$yt.route({
                    url: "/pages/bannedPage/bannedPage",
                    type: "reLaunch",
                });
            }
            for (let key in config.data) {
                if (config.data[key] == null) {
                    config.data[key] = "";
                }
            }
            // #ifdef MP-TOUTIAO
            config.usePrefetchCache = true;
            // #endif
            // original 设置: 不使用拦截器
            if (!config.original) {
                // 统一增加mid
                console.log("config:", config);
                if (config.data && !config.data.mid) {
                    config.data["mid"] = store.state.mid;
                }
                if (config.data && !config.data.platform) {
                    config.data["platform"] = globalConfig.platform;
                }
                if (!config.hideLoading) {
                    uni.showLoading({
                        title: "请稍候",
                    });
                }
                // 添加通用参数,开启加载loading
                // if (store.state.token) {
                const time_stamp = Math.round(new Date() / 1000); //时间戳
                const nonce_str = randomString(32); //随机字符串
                const token = store.state.token ? store.state.token : "";
                //生成需要签名的对象（获取所有的get和post值）
                console.log(
                    "deepMerge({ nonce_str, time_stamp, token }, config.data)",
                    deepMerge({ nonce_str, time_stamp, token }, config.data)
                );
                //将对象ascii码排序
                const sort_string = sort_ascii(
                    deepMerge({ nonce_str, time_stamp, token }, config.data)
                );
                console.log("sort_string", sort_string);
                //字符串base64加密
                const sign_string =
                    globalConfig.signKey + Base64.stringify(Utf8.parse(sort_string));
                console.log(config.url, ":sign_string", sign_string);
                //md5加密
                let sign = MD5(sign_string).toString();
                console.log("signsign", sign);
                //对time_stamp进行hash取余，根据取余结果判断签名和token的排序
                const sign_type = (time_stamp % 5) % 2;
                const new_sign = sign_type ? sign + token : token + sign;
                config.header = {
                    "time-stamp": time_stamp.toString(),
                    "nonce-str": nonce_str,
                    sign: new_sign,
                    token: token,
                };
                // }
            }
        },
        response: (response) => {
            console.log("responseresponseresponse", response);
            const res = response.data;
            if (response.config.unintercept || response.config.original) {
                return response;
            } else if (res.code === 200) {
                return res.data;
            } else if (res.code === 1034) {
                const tid = store.state.tid;
                uni.$yt.route({
                    type: "reLaunch",
                    url: "/pages/index/index" + tid,
                });
            } else if (res.code === 1038) {
                uni.$yt.route({
                    type: "redirectTo",
                    url: res.msg,
                });
            } else if (res.code === 3002 || res.code === 3003) {
                // #ifndef H5
                getApp().applogin(3);
                // #endif
                // #ifdef H5
                uni.clearStorage();
                getApp().init();
                // #endif
            } else if (res.code === 5006) {
                stateCode = 5006;
                //封禁用户
                uni.$yt.route({
                    url: "/pages/bannedPage/bannedPage",
                    type: "reLaunch",
                });
            } else if (!response.config.notAlert) {
                uni.showModal({
                    title: "提示",
                    content: res.msg || "请求错误:" + response.statusCode,
                    showCancel: false,
                    success() {},
                });
            }
            // 判断返回状态 执行相应操作
            return Promise.reject(res);
        },
    },
    request(options) {
        if (!options) {
            options = {};
        }
        options.baseUrl = options.baseUrl || this.config.baseUrl;
        options.dataType = options.dataType || this.config.dataType;
        options.url = options.baseUrl + options.url;
        if (reqobj[options.url] && options.is_debuce) {
            return new Promise().reject();
        }
        reqobj[options.url] = true;
        options.data = options.data || {};
        options.method = options.method || this.config.method;
        if (store.state.sceneNum) {
            options.data["scene"] = store.state.sceneNum;
        }
        // TODO 加密数据

        // TODO 数据签名
        /*
        _token = {'token': getStorage(STOREKEY_LOGIN).token || 'undefined'},
        _sign = {'sign': sign(JSON.stringify(options.data))}
        options.header = Object.assign({}, options.header, _token,_sign)
        */

        return new Promise((resolve, reject) => {
            let _config = null;

            _config = Object.assign({}, this.config, options);
            _config.requestId = new Date().getTime();

            if (this.interceptor.request) {
                this.interceptor.request(_config);
            }

            _config.complete = (response) => {
                reqobj[options.url] = false;
                const statusCode = response.statusCode;
                response.config = _config;

                // 关闭加载提示
                if (!_config.hideLoading) {
                    uni.hideLoading();
                }

                _reslog(response);
                if (statusCode === 200) {
                    if (this.interceptor.response) {
                        const newResponse = this.interceptor.response(response);
                        if (newResponse) {
                            response = newResponse;
                        }
                    }
                    // 成功
                    resolve(response);
                } else {
                    reject(response);
                }
            };
            uni.request(_config);
        });
    },
    get(url, data, options) {
        if (!options) {
            options = {};
        }
        options.url = url;
        options.data = data;
        options.method = "GET";
        return this.request(options);
    },
    post(url, data, options) {
        if (!options) {
            options = {};
        }
        options.url = url;
        options.data = data;
        options.method = "POST";
        return this.request(options);
    },
};

//按ascii码从小到大排序
function sort_ascii(obj) {
    let arr = new Array();
    let num = 0;
    for (let i in obj) {
        arr[num] = i;
        num++;
    }
    const sortArr = arr.sort();
    //自定义排序字符串
    let str = "";
    for (let i in sortArr) {
        str += sortArr[i] + "=" + obj[sortArr[i]] + "&";
    }
    //去除两侧字符串
    const char = "&";
    str = str.replace(new RegExp("^\\" + char + "+|\\" + char + "+$", "g"), "");

    return str;
}