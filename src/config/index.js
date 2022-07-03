const config = {
    /* 当前宿主平台 */
    // #ifdef MP-TOUTIAO
    platform: "wx",
    /* 服务地址 */
    devApi: "https://applet.tuwei.space",
    // devApi: "http://192.168.0.50:9101",
    prodApi: "http://127.0.0.1:9501",

    version: 1,
    signKey: "boomxiak",
};

export default config;


export const version = config.version;