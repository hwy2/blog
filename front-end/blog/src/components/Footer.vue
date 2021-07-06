<template>
  <footer class="border-box pb-0.5 fixed bottom-0 w-full">
    <div class="footer-box w-2/4 m-auto h-48">
      <!-- 版权 -->
      <div class="copyright p-2 pt-4 text-white">
        <p class="text-base text-left border-b border-gray-100 pb-2 pl-2">
          Copyright © 2021
          <a class="text-gray-500 hover:text-white" href="/">黄文勇的技术站</a>
        </p>
        <p class="pt-2 text-left pl-2 tracking-wider">网站已存活{{ survivalTime }}</p>
      </div>
      <!-- 备案信息 -->
      <div class="record text-center pt-10">
        <!-- 工信部备案 -->
        <p>
          <a
            class="hover:text-white"
            href="https://beian.miit.gov.cn/#/Integrated/index"
            target="_blank"
            >{{MIITRecord}}</a
          >
        </p>
        <!-- 网警备案 -->
        <p>
          <a
            class="jing hover:text-white"
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode"
            target="_blank"
            >{{internetAlert}}</a
          >
        </p>
      </div>
    </div>
  </footer>
</template>
<script lang="ts">
import {
  toRefs,
  reactive,
  onBeforeMount,
  defineComponent,
} from "vue";
export default defineComponent({
  name: "Header",
  setup: () => {
    let _this = this;
    const state = reactive({
      //vue2.x的data参数
      survivalTime: "",
      MIITRecord :"粤ICP备xxxxxx号",
      internetAlert:"公网安备 xxxxxxxxxxxx号"
    });
    const methods = {
      survivalDate: function (oldDate: string) {
        var years, days, hours, minutes, seconds;
        var openday = new Date(oldDate);
        var today = new Date(); //系统当前时间
        var total = (today.getTime() - openday.getTime()) / 1000;
        years = Math.floor(total / 31536000);
        total = total - years * 31536000;
        days = Math.floor(total / 86400);
        total = total - days * 86400;
        hours = Math.floor(total / 3600);
        total = total - hours * 3600;
        minutes = Math.floor(total / 60);
        total = total - minutes * 60;
        seconds = Math.floor(total);
        state.survivalTime =
          years +
          "年" +
          days +
          "天" +
          hours +
          "时" +
          minutes +
          "分" +
          seconds +
          "秒";
        setTimeout(() => {
          methods.survivalDate("2018-07-19");
        }, 1000);
      },
    };
    onBeforeMount(() => {
      //挂载开始之前
      methods.survivalDate("2018-07-19");
    });
    return { ...toRefs(state), methods };
  },
});
</script>
<style lang="less">
footer {
  margin: 0;
  padding: 0;
  background-color: var(--trueGray);
  .footer-box {
    p {
      a {
        color: #999;
      }
      a.jing {
        &::before {
          content: "";
          background: url("../assets/jinghui.png") no-repeat center center;
          background-size: 100% 100%;
          height: 20px;
          width: 20px;
          display: inline-block;
          vertical-align: sub;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>