<script setup lang="ts">
import { ref } from 'vue';
import { count } from 'console';
import { create } from 'domain';
import HelloWorld from './components/HelloWorld.vue'
import router from './router';
import { RouterItem } from './router';
import suyaa from '@/suyaa'

// 加载页面
import homeView from '@/views/home.vue';
import loginView from '@/views/login.vue';

// 注册路由
router.regRoutes([
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

const page = ref(homeView);

const goto = function (path: string) {
  let route = router.getRoute(path);
  console.log(route);
  page.value = route.component;
  document.title = route.title + " - " + suyaa.name + " Ver:" + suyaa.version;
}

goto('/login')
// Router.push({
//   path: "/home"
// });
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
