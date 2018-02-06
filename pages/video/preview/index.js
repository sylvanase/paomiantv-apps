const app = getApp()
Page({
  data: {
    videoUrl:null,
    imgUrl:null
  },
  onLoad: function (options) {
    this.setData({
      videoUrl: options.videoUrl,
      imgUrl: options.imgUrl
    })
  }
})