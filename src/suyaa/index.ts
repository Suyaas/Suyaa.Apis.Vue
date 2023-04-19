import setting from './setting'
import ver from './version';
import { VersionInfo } from './version';

/**
 * 事件类型
 */
export const EventTypes = {
    API_FAIL: "api_fail",
    API_ERROR: "api_error",
};

/**
 * Suyaa 事件
 */
class SuyaaEvent {
    name: string;
    func?: (arg: any) => void;
    enable: boolean;
    constructor() {
        this.name = "";
        this.enable = true;
    }
}

/**
 * Suyaa Api 操作类
 */
export class Suyaa {
    // 执行句柄
    private handles: Array<() => void>;
    // 事件句柄
    private events: Array<SuyaaEvent>;
    // 键集合
    private jwtKey = "suyaa_token";
    private jwtTimeKey = "suyaa_token_time";
    // 程序信息
    name: string;
    version: string;

    /**
     * 获取Jwt信息
     * @returns 
     */
    getJwt() {
        let jwt = sessionStorage.getItem(this.jwtKey);
        if (typeof jwt === "undefined") jwt = "";
        if (jwt === null) jwt = "";
        return jwt;
    }

    /**
     * 保存Jwt信息
     * @returns 
     */
    saveJwt(info:any) {
        sessionStorage.setItem(this.jwtKey, info.Token);
        sessionStorage.setItem(this.jwtTimeKey, info.RenewalTime);
    }

    /**
     * 判断Jwt是否在有效期内
     * @returns 
     */
    isJwtValid() {
        if (this.getJwt() === "") return false;
        let jwtTime = sessionStorage.getItem(this.jwtTimeKey);
        if (typeof jwtTime === "undefined") return false;
        if (jwtTime === null) return false;
        let time = parseInt(jwtTime);
        let timeNow = Math.round(new Date().getTime() / 1000);
        return timeNow < time;
    }

    // 获取API结果
    private async getApiReult(response: Response, onFail?: (message: string) => void) {
        // 判断返回状态
        if (response.status !== 200) {
            this.raise(EventTypes.API_FAIL, response);
            return null;
        }
        // 解析内容
        let res = await response.json();
        if (!res.success) {
            if (typeof onFail === "function") {
                onFail(res.message);
            } else {
                this.raise(EventTypes.API_FAIL, res.message);
            }
            return null;
        }
        return res.data;
    }

    /**
     * 以Get方式获取API内容
     * @param url
     */
    async apiGet(url: string, onFail?: (message: string) => void) {
        let postUrl = setting.apiUrl + url;
        let response = await fetch(postUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
        });
        return await this.getApiReult(response, onFail);
    }
    /**
     * 以Post方式获取API内容
     * @param url 地址
     * @param data 
     */
    async apiPost(url: string, data: any, onFail?: (message: string) => void) {
        let postUrl = setting.apiUrl + url;
        let response = await fetch(postUrl, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
        });
        return await this.getApiReult(response, onFail);
    }
    /**
     * 以Get方式获取API内容
     * @param url
     */
    async jwtApiGet(url: string, onFail?: (message: string) => void) {
        // 设置头
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Suyaa-Token", this.getJwt());
        // 拼接Url
        let postUrl = setting.apiUrl + url;
        let response = await fetch(postUrl, {
            method: "GET",
            headers: headers,
            mode: 'cors',
        });
        return await this.getApiReult(response, onFail);
    }
    /**
     * 以Post方式获取API内容
     * @param url 地址
     * @param data 
     */
    async jwtApiPost(url: string, data: any, onFail?: (message: string) => void) {
        // 设置头
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Suyaa-Token", this.getJwt());
        // 拼接Url
        let postUrl = setting.apiUrl + url;
        let response = await fetch(postUrl, {
            method: "POST",
            body: JSON.stringify(data),
            headers: headers,
            mode: 'cors',
        });
        return await this.getApiReult(response, onFail);
    }
    /**
     * 注册就绪事件
     * @param fn 
     */
    onReady(fn: () => void) {
        let self = this;
        // 添加函数
        self.handles.push(fn);
    }
    /**
     * 触发就绪事件 
     */
    raiseReadyEvent() {
        let self = this;
        if (typeof self.handles === "undefined") return;
        // 依次执行函数
        for (let i = 0; i < self.handles.length; i++) {
            self.handles[i]();
        }
        // 清空函数集合
        self.handles = new Array<() => void>();
    }
    /**
     * 注册事件
     * @param evt 
     * @param fn 
     */
    on(evt: string, fn: (evt: any) => void) {
        let self = this;
        let e: SuyaaEvent = {
            name: evt,
            func: fn,
            enable: true,
        };
        self.events.push(e);
    }
    /**
     * 触发事件
     * @param evt 
     * @param clean 
     */
    raise(evt: string, arg: any, clean: boolean = false) {
        let self = this;
        // 依次执行函数
        for (let i = 0; i < self.events.length; i++) {
            var e = self.events[i];
            if (!e.enable) continue;
            if (typeof e.func === "function") e.func(arg);
            if (clean) e.enable = false;
        }
    }
    // 构造函数
    constructor() {
        this.handles = new Array<() => void>();
        this.events = new Array<SuyaaEvent>();
        this.name = "Suyaa Apis";
        this.version = ver.vserion;
        let jwt = this.getJwt();
        // 注册交互失败和错误事件
        this.on(EventTypes.API_FAIL, function (message: string) {
            console.warn(message);
        });
        this.on(EventTypes.API_ERROR, function (resp: Response) {
            console.error("Url " + resp.url + " Status " + resp.status);
        });
        // console.log(jwt);
        if (jwt === '') {
            setTimeout(async () => {
                // 获取Jwt
                let jwtNew = await this.apiGet(setting.jwtCreate);
                console.log(jwtNew);
                //sessionStorage.setItem(this.jwtKey, jwtNew);
                this.saveJwt(jwtNew);
            }, 10);
        } else {
            if (!this.isJwtValid()) {
                setTimeout(async () => {
                    // 更新Jwt
                    let jwtNew = await this.apiGet(setting.jwtRenewal + "?token=" + jwt);
                    console.log(jwtNew);
                    this.saveJwt(jwtNew);
                }, 10);
            }
        }
    }
}

/**
 * Suyaa Api 快速操作
 */
const suyaa = new Suyaa();
export default suyaa;