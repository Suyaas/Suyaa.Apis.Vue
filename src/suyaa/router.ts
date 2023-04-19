import setting from './setting'

/**
 * 路由项
 */
export class RouterItem {
  path: string;
  component: any;
  title: string;
  constructor(path: string, title: string, component: any) {
    this.path = path;
    this.title = title;
    this.component = component;
  }
}

/**
 * 路由控制器
 */
export class Router {
  defaultRouter?: RouterItem
  currentRouter?: RouterItem
  routes: Array<RouterItem>
  constructor(def?: RouterItem) {
    this.routes = new Array<RouterItem>();
    this.defaultRouter = def;
  }
  /**
   * 注册路由
   * @param routes 
   */
  setRoutes(routes: Array<RouterItem>) {
    // 添加路由信息
    routes.forEach(route => {
      this.routes.push(route)
    });
    // 设置默认路由
    if (this.defaultRouter === undefined) {
      if (this.routes.length > 0) this.defaultRouter = this.routes[0];
    }
    // 读取当前路由地址
    let url = window.location.href;
    let origin = window.location.origin;
    let path = url.substring(origin.length);
    if (!path.startsWith(setting.rootRouter)) location.href = setting.rootRouter;
    path = path.substring(setting.rootRouter.length);
    this.currentRouter = this.getRoute(path);
  }
  /**
   * 获取路由组件
   * @param path 路径
   * @returns 组件
   */
  getRoute(path: string) {
    // 获取匹配路径的路由组件
    for (let i = 0; i < this.routes.length; i++) {
      let route = this.routes[i];
      if (route.path === path) return route;
    }
    // 必须要有默认路由
    if (this.defaultRouter === undefined) throw "缺少默认路由配置";
    // 获取默认路由组件
    return this.defaultRouter;
  }
  /**
   * 跳转
   */
  goto(path?: string, reload?: boolean) {
    if (typeof path === "undefined") location.href = setting.rootRouter;
    location.href = setting.rootRouter + path;
    if (reload ?? false) location.reload();
  }
}

const router = new Router();

export default router;