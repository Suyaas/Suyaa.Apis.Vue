/**
 * 版本信息
 */
export class VersionInfo {
    vserion: string;
    infos: Array<string>;
    constructor() {
        this.vserion = "";
        this.infos = new Array<string>();
    }
}

/**
 * 版本信息集合
 */
export const versions: Array<VersionInfo> = [
    {
        vserion: "1.0.2304.1",
        infos: [
            "新增：完成界面设计",
            "新增：添加SuyaaApi组件"
        ]
    },
]

/**
 * 最新版本
 */
const version = versions[versions.length - 1];
export default version;