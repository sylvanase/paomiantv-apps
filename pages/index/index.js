//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    videoPacket: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isShowPop: false, // 是否显示pop
    packet: {},
    balance: 0
  },
  linkToVideo: function () { // 跳转到换视频
    wx.navigateTo({
      url: '../video/video'
    })
  },
  linkToPraise: function () { // 跳转到赞美红包页
    wx.navigateTo({
      url: '../praise/praise'
    })
  },
  linkToRecord: function () { // 跳转到记录页面
    wx.navigateTo({
      url: '../record/record'
    })
  },
  linkToMoney: function () { // 跳转到提现页面
    wx.navigateTo({
      url: '../money/money'
    })
  },
  linkToMine: function () { // 跳转到我的页面
    wx.navigateTo({
      url: '../mine/mine'
    })
  },
  handleInput: function (e) {
    console.log(e.target.dataset.key + "," + e.detail.value)
    let obj = {};
    obj[e.target.dataset.key] = e.detail.value;
    this.setData(obj)
    console.log(JSON.stringify(this.data))
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.getRedPacketVideo();
    this.getAccount();
  },
  getUserInfo: function (e) { // 获取用户信息
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  openRedPacket: function () {
    if (this.data.videoPacket) {
      var videoPacket = this.data.videoPacket.data;
      var packet = {
        title: videoPacket.redpacket_title,
        amount: videoPacket.redpacket_amount,
        number: videoPacket.redpacket_number,
        type: videoPacket.redpacket_type,
        videoId: videoPacket.video_id,
        videoImgUrl: videoPacket.img_url,
        videoUrl: videoPacket.video_url,
      }
      console.log("packet=" + JSON.stringify(packet));
      this.setData({
        isShowPop: false,
        packet: packet
      })
    }
  },

  getRedPacketVideo: function () {
    var sessionid = app.globalData.jsessionid;
    wx.request({
      url: app.globalData.baseUrl + '/p1/redpacket_video?jsessionid=' + sessionid,
      success: result => {
        console.log("getRedPacketVideo=" + JSON.stringify(result.data));
        if (result.data && result.data.status == 51000 && result.data.data && result.data.data.redpacket_type == 2) {
          this.setData({
            videoPacket: result.data,
            isShowPop: true
          })
        }
      }
    })
  },

  getAccount: function () {
    var sessionid = app.globalData.jsessionid;
    wx.request({
      url: app.globalData.baseUrl + '/api/packet/account?jsessionid=' + sessionid,
      success: result => {
        console.log("getAccount=" + JSON.stringify(result.data));
        if (result.data && result.data.status == 0 && result.data.data) {
          this.setData({
            balance: result.data.data.amount
          })
        }
      }
    })
  },

  //创建视频红包
  createVideoPacket: function () {
    //TODO
    console.log("title.length=" + this.data.packet.title.length);
    if (!this.data.packet.title || this.data.packet.title.length > 10 || this.data.packet.title.length < 2) {
      showMsg('祝福语的长度在2-10个之间');
      return;
    }
    if (!this.data.packet.number || this.data.packet.number < 1) {
      showMsg('红包的赏金最小为1元');
      return;
    }
    console.log(this.data.packet.amount / this.data.packet.number)
    if (this.data.packet.amount < 50 && (this.data.packet.amount / this.data.packet.number) < 1) {
      showMsg('请保证红包的赏金人均不低于1元');
      return;
    }

    if (!this.data.packet.videoId) {
      showMsg('请选择个视频先');
      return;
    }

    var sessionid = app.globalData.jsessionid;
    wx.request({
      url: app.globalData.baseUrl + '/p1/redpacket_video/create?jsessionid=' + sessionid,
      method: 'POST',
      header: {
        //'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "redpacket_title": this.data.packet.title,
        "video_id": this.data.packet.videoId,
        "redpacket_type": this.data.packet.type,
        "redpacket_amount": this.data.packet.amount,
        "redpacket_number": this.data.packet.number
      },
      success: result => {
        if (result.data && result.data.status == 0) {
          showMsg("创建成功");
        } else {
          showMsg(result.data.error);
        }
      }
    })


  },
  //创建语音赞红包
  createPraisePacket: function () {

  },

})


function showMsg(str) {
  wx.showToast({
    title: str,
    icon: 'none'
  })
}


