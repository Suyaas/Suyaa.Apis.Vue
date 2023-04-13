/**
 * 配置信息
 */
export class Setting {
    /**
     * API地址
     */
    apiUrl: string = "/";
    /**
     * 根路由
     */
    rootRouter: string = "";
    /**
     * Jwt申请地址
     */
    jwtCreate: string = "";
    /**
     * Jwt续订地址
     */
    jwtRenewal: string = "";
}

// 创建默认配置
const createDefaultSetting = function () {
    let res: Setting = {
        apiUrl: "",
        jwtCreate: "/app/User/Jwt/Create",
        jwtRenewal: "/app/User/Jwt/Renewal",
        rootRouter: "/ui/#",
    };
    switch (import.meta.env.MODE) {
        case 'development':
            res.apiUrl = "http://127.0.0.1:6600";
            break;
        case 'pro':
            res.apiUrl = "https://suyaa.cn";
            break;
        default: throw "不支持的运行模式:" + import.meta.env.MODE;
    }
    return res;
}

// 动态设置
const setting = createDefaultSetting();
export default setting;