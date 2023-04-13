<script setup lang="ts">
import { ref } from 'vue';
import { count } from 'console';
import { create } from 'domain';
import HelloWorld from './components/HelloWorld.vue'
import router from '@/suyaa/router';
import { RouterItem } from '@/suyaa/router';
import suyaa from '@/suyaa'

// 加载页面
import homeView from '@/views/home.vue';
import loginView from '@/views/login.vue';

// 注册路由
router.setRoutes([
  {
    path: "/",
    component: homeView,
    title: "首页"
  },
  {
    path: "/login",
    component: loginView,
    title: "登录"
  },
]);

// 生效路由
const route = router.currentRouter;
if (typeof route == "undefined") throw "路由异常";
const page = ref(route.component);
document.title = route.title + " - " + suyaa.name + " Ver:" + suyaa.version;

</script>

<template>
  <component :is="page"></component>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
