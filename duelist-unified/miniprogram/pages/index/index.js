// pages/index/index.js
Page({
  data: {
    // 本地开发时使用本地服务器地址
    // 生产环境需要替换为实际部署的 H5 地址
    webviewUrl: 'http://localhost:3000/#/'
  },

  onLoad(options) {
    // 如果是生产环境，使用实际部署地址
    // this.setData({
    //   webviewUrl: 'https://your-domain.com/#/'
    // });
    
    console.log('WebView URL:', this.data.webviewUrl);
  },

  onReady() {
    console.log('页面加载完成');
  },

  onShow() {
    console.log('页面显示');
  }
});
