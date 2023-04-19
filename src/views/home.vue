<script setup lang="ts">
import suyaa from '@/suyaa'
import router from '@/suyaa/router';

var userInfo = suyaa.jwtApiGet("/app/User/Authorize/Verify", function (message) {
    router.goto("/login");
});
</script>

<template>
    <div>首页</div>
</template>