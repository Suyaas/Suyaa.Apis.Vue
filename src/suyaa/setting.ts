/**
 * 配置信息
 */
export class Setting {
    /**
     * API地址
     */
    apiUrl: string
    constructor() {
        this.apiUrl = "";
    }
}

// 创建默认配置
const createDefaultSetting = function () {
    let res: Setting;
    switch (import.meta.env.MODE) {
        case 'development':
            res = {
                apiUrl: "http://127.0.0.1:6600",
            };
            break;
        default: throw "不支持的运行模式:" + import.meta.env.MODE;
    }
    return res;
}

const setting = createDefaultSetting();
export default setting;