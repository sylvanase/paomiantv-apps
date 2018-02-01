//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        videoList:[]
    },
    onLoad: function () {
      
      this.getVideoList()

    },

    getVideoList:function(){
      var sessionid = app.globalData.jsessionid;
      wx.request({
        url: app.globalData.baseUrl + '/p1/redpacket_video/my_videos?jsessionid=' + sessionid,
        success: res => {
          console.log("my_videos=" + JSON.stringify(res));
          if (res.data.status != 52002) {
            return;
          }
          var data = res.data.data;
        
          this.setData({
            videoList: data.video_list
          });
        }
      })
    },

    useVideo: function(event){
      var videoItem = event.currentTarget.dataset.item;
      var pages = getCurrentPages();
      if (pages.length > 1) {
        //上一个页面实例对象
        var prePage = pages[pages.length - 2];
        //关键在这里
        var packet = prePage.data.packet;
        console.log("videoItem info=" + JSON.stringify(videoItem));
        console.log("packet info=" + JSON.stringify(packet));
        packet.videoId = videoItem[0];
        packet.videoImgUrl = videoItem[2];
        packet.videoUrl = videoItem[1];
        prePage.setData({
          packet: packet
        })
      }
      wx.navigateBack()
    }
})
