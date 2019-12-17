<template>
  <div>
    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container">
        <a class="navbar-brand" href="/">视频解析</a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"         
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent"></div>
      </div>
    </nav>

    <div class="container">
      <!-- 嵌入式屏幕 -->
      <div class="row mt-4 justify-content-center">
        <div class="col-md-8">
          <div class="embed-responsive embed-responsive-16by9 shadow sun-frame-bg">
            <iframe
              v-if="fullUrl"
              id="tvFrame"
              class="embed-responsive-item"
              :src="fullUrl"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>

      <!-- 输入框表单 -->
      <div class="row mt-4 justify-content-center">
        <form class="col-md-8">
          <div class="form-row justify-content-between">
            <div class="form-group col-md-3">
              <select class="form-control" v-model.number="selectOpt">
                <option :value="0">线路一 🔥</option>
                <option :value="1">线路二</option>
                <option :value="2">线路三</option>
              </select>
            </div>
            <div class="form-group col-md-7">
              <input
                type="text"
                v-model.trim="inputUrl"
                class="form-control"
                placeholder="输入待解析视频地址"
              />
            </div>
            <div class="form-group col-md-2 text-center">
              <button @click="handlePlay()" type="button" class="btn btn-primary">开始播放</button>
            </div>
          </div>
        </form>
      </div>

      <!-- 历史记录 -->
      <div class="row mt-3 justify-content-center" v-if="historys.length>0">
        <div class="col-md-8">
          <ul class="list-group">
            <li class="list-group-item list-group-item-primary">历史记录</li>
            <li
              class="list-group-item list-group-item-action"
              v-for="(item,index) in historys"
              :key="item.url"
            >
              <p class="m-0 long-warp" v-cloak>
                {{item.title}}
                <span v-if="index===0" class="badge badge-success">最近播放</span>
              </p>
              <p class="m-0 long-warp" v-cloak>
                {{item.url}}
                <a
                  href="javascript:;"
                  @click="copyToClipboard(item.url)"
                  class="badge badge-secondary"
                >复制链接</a>
              </p>
            </li>
          </ul>
        </div>
      </div>

      <!-- footer -->
      <div class="text-center mt-4">
        Copyright © 2019
        <a href="https://www.seast.net">桑易</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tv",
  data: function() {
    return {
      historys: [], //历史记录
      apiList: [
        "http://jqaaa.com/jx.php?url=",   //广告少
        "https://api.spjx.live/?url=",
        "http://j.zz22x.com/jx/?url="
      ],
      fullUrl: "", //拼接后的全url
      selectOpt: 0, //用户选择线路
      inputUrl: "" //用户输入url
    };
  },
  methods: {
    //点击播放
    handlePlay() {
      if (!this.inputUrl) {
        this.$layer.msg("请输入网址");
        return;
      }
      this.fullUrl = this.apiList[this.selectOpt] + this.inputUrl;
      this.$layer.msg("已开始播放");

      this.addHistory();
    },

    // 获取title
    getTitle() {
      let _this = this;
      return new Promise((reslove, reject) => {
        $.ajax({
          url: "http://tvprase.seast.net/", //腾讯云函数
          // url: 'https://1116304423746548.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/webTools/get-video-site-title/',
          data: {
            url: _this.inputUrl
          },
          dataType: "json",
          success(res) {
            // console.log(res);
            reslove(res.title);
          },
          error(res) {
            console.log(res);
            reslove("无");
          }
        });
      });
    },

    // 添加到localstroage
    addHistory() {
      // 若第一项有重复则不添加
      for (let item of this.historys) {
        if (item.url == this.inputUrl) {
          return false;
        }
        break;
      }

      // 获取title
      let _this = this;
      _this.getTitle().then(res => {
        return new Promise((reslove, reject) => {
          let temp = {
            title: res,
            url: _this.inputUrl
          };

          // 添加历史记录到数组开头
          _this.historys.unshift(temp);

          // 历史记录取前三条
          if (_this.historys.length >= 4) {
            _this.historys = _this.historys.slice(0, 4);
          }

          // 添加历史记录到localstroage
          localStorage.setItem("his", JSON.stringify(_this.historys));
          reslove();
        });
      });
    },

    // 复制文字
    copyToClipboard(text) {
      if (text.indexOf("-") !== -1) {
        let arr = text.split("-");
        text = arr[0] + arr[1];
      }
      var textArea = document.createElement("textarea");
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        var successful = document.execCommand("copy");
        var msg = successful
          ? "成功复制到剪贴板"
          : "该浏览器不支持点击复制到剪贴板";
        this.$layer.msg(msg);
      } catch (err) {
        this.$layer.msg("该浏览器不支持点击复制到剪贴板");
      }

      document.body.removeChild(textArea);
    }
  },
  mounted() {
    // 加载localstroage
    let his = localStorage.getItem("his") || "[]";
    this.historys = JSON.parse(his);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.long-warp {
  word-wrap: break-word;
}

.sun-frame-bg {
  background-image: url("https://s2.ax1x.com/2019/12/14/Q2jn6H.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
