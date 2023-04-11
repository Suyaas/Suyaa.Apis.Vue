import setting from './setting'
import ver from './version';
import { VersionInfo } from './version';

/**
 * Suyaa 事件
 */
class SuyaaEvent {
    name: string;
    func?: () => void;
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
    // 程序信息
    name: string;
    version: string;
    /**
     * 以Get方式获取API内容
     * @param url
     */
    async apiGet(url: string) {
        let postUrl = setting.apiUrl + url;
        let response = await fetch(postUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
        });
        if (response.status !== 200) console.error("Get '" + postUrl + "' Status " + response.status);
        let res = await response.json();
        if (!res.success) throw res.message;
        return res.data;
    }
    /**
     * 以Post方式获取API内容
     * @param url 地址
     * @param data 
     */
    async apiPost(url: string, data: any) {
        let postUrl = setting.apiUrl + url;
        let response = await fetch(postUrl, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
        });
        if (response.status !== 200) console.error("Post '" + postUrl + "' Status " + response.status);
        let res = await response.json();
        if (!res.success) throw res.message;
        return res.data;
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
    on(evt: string, fn: () => void) {
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
    raise(evt: string, clean: boolean = false) {
        let self = this;
        // 依次执行函数
        for (let i = 0; i < self.events.length; i++) {
            var e = self.events[i];
            if (!e.enable) continue;
            if (typeof e.func === "function") e.func();
            if (clean) e.enable = false;
        }
    }
    constructor() {
        this.handles = new Array<() => void>();
        this.events = new Array<SuyaaEvent>();
        this.name = "Suyaa Apis";
        this.version = ver.vserion;
        let jwt = sessionStorage.getItem(this.jwtKey);
        console.log(jwt);
        if (jwt === null) {
            setTimeout(async () => {
                let data = await this.apiGet("/app/User/Jwt/Create");
                console.log(data);
            }, 10);
        }
    }
}

/**
 * Suyaa Api 快速操作
 */
const suyaa = new Suyaa();
export default suyaa;