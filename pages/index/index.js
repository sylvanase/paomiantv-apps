//index.js
var util = require('../../utils/util.js');

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
    balance: 0,
    intervalId: null,
    refresh: true,
    createBtnDisabled: false,
    ignoreBalance: false,
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
    console.log("userInfo=" + JSON.stringify(this.data.userInfo));


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

  onShow: function () {
    if (!this.data.refresh) {
      this.setData({
        refresh: true
      })
      return;
    }
    var reqCounter = 0;
    var interval = setInterval(func => {
      reqCounter++;
      if (app.globalData.jsessionid) {
        this.getRedPacketVideo();
        this.getAccount();
        clearInterval(interval);
      } else {
        if (reqCounter > 100) {
          clearInterval(interval);
          wx.navigateBack({
            delta: 0
          });
        }
      }
    }, 100);
    this.setData({
      intervalId: interval
    })
  },

  onHide: function () {
    clearInterval(this.data.intervalId);
  },

  onLoad: function () {

    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高
      success: res => {
        console.log("res=" + JSON.stringify(res));
      }
    })
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
      var videoPacket = this.data.videoPacket;
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

  onPopclose: function () {
    this.setData({
      isShowPop: false
    })
  },

  playVideo: function () {
    wx.navigateTo({
      url: '/pages/video/preview/index?videoUrl=' + this.data.packet.videoUrl + "&imgUrl=" + this.data.packet.videoImgUrl,
    })
  },

  getRedPacketVideo: function () {
    var sessionid = app.globalData.jsessionid;
    wx.request({
      url: app.globalData.baseUrl + '/p1/redpacket_video?jsessionid=' + sessionid,
      success: result => {
        console.log("getRedPacketVideo=" + JSON.stringify(result.data));
        if (!result.data || !result.data.data) {
          return;
        }
        if (result.data.status == 51000) {
          this.setData({
            videoPacket: result.data.data,
            isShowPop: true
          })
        } else if (result.data.status == 50003) {
          var videoPacket = result.data.data;
          var packet = {
            title: videoPacket.redpacket_title,
            amount: videoPacket.redpacket_amount,
            number: videoPacket.redpacket_number,
            type: videoPacket.redpacket_type,
            videoId: videoPacket.video_id,
            videoImgUrl: videoPacket.img_url,
            videoUrl: videoPacket.video_url,
          }

          this.setData({
            packet: packet,
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
      app.showMsg('祝福语的长度在2-10个之间');
      return;
    }

    if (!this.data.packet.amount || this.data.packet.amount < 1) {
      app.showMsg('红包的赏金最小为1元');
      return;
    }
    console.log(this.data.packet.amount / this.data.packet.number)
    if (this.data.packet.type == 1) {
      if (this.data.packet.amount < 50 && (this.data.packet.amount / this.data.packet.number) < 1) {
        app.showMsg('请保证红包的赏金人均不低于1元');
        return;
      }
    }
    var amount = util.roundFun(this.data.packet.amount, 2);
    var number = util.roundFun(this.data.packet.number, 0);
    this.setData({
      'packet.amount': amount,
      'packet.number': number
    });

    if (!this.data.packet.videoId) {
      app.showMsg('请选择个视频先');
      return;
    }


    if (this.data.packet.type == 1) {
      if (!this.data.ignoreBalance && amount > this.data.balance) {
        app.showMsg('余额不足，请先充值');
        //TODO
        var fee = amount * 100 - this.data.balance * 100;
        fee = util.roundFun(fee, 0);
        console.log("余额不足=" + amount + "," + this.data.balance + "," + fee);
        this.preorder(fee);
        return;
      }
    }

    if (!this.data.packet.type) {
      this.data.packet.type = 1;
    }

    this.setData({
      createBtnDisabled: true
    });

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
        "redpacket_amount": amount,
        "redpacket_number": number
      },
      success: result => {

        this.setData({
          createBtnDisabled: false,
          refresh: true
        });

        console.log(JSON.stringify(result.data));
        if (result.data && result.data.status == 0) {
          app.showMsg("创建成功");
          wx.navigateTo({
            url: '../index/share/share?packetId=' + result.data.data.redpacket_id + "&type=" + this.data.packet.type,
          })
        } else {
          app.showMsg(result.data.error);
          //重新初始化红包创建
          this.getRedPacketVideo();
        }
      }
    })
  },


  preorder: function (amount) {

    var sessionid = app.globalData.jsessionid;
    wx.request({
      url: app.globalData.baseUrl + '/api/packet/preorder?jsessionid=' + sessionid,
      method: 'POST',
      header: {
        //'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        amount: amount,
      },
      success: result => {
        console.log("payment=" + JSON.stringify(result.data));
        if (result.data && result.data.status == 0) {
          this.setData({
            refresh: false,
          })

          var payment = result.data.data.payment;
          wx.requestPayment({
            timeStamp: payment.timeStamp,
            nonceStr: payment.nonceStr,
            package: payment.package,
            signType: payment.signType,
            paySign: payment.sign,
            success: res => {
              console.log("payment res=" + JSON.stringify(res));
              if (res.errMsg == 'requestPayment:ok') {
                //支付成功
                this.payCheck(result.data.data.orderId);
              } else {
                //支付失败
              }
            },
            fail: res => {
              //系统错误
              console.log("payment res=" + JSON.stringify(res));
              app.showMsg(res.errMsg);
            },
          });


        } else {
          app.showMsg(result.data.error);
        }
      }
    })
  },

  payCheck: function (orderId) {
    var counter = 5;
    var intervalId = setInterval(func => {
      if (counter < 1) {
        app.showMsg("正在到账中，请稍后查看")
        clearInterval(intervalId);
        return;
      }
      var sessionid = app.globalData.jsessionid;
      console.log("sessionid=" + sessionid + ", orderId=" + orderId);
      wx.request({
        url: app.globalData.baseUrl + '/api/packet/order/status?jsessionid=' + sessionid + "&orderId=" + orderId,
        success: res => {
          if (!res.data) {
            return;
          }
          if (res.data.data) {
            this.setData({
              ignoreBalance: true
            })
            this.createVideoPacket();
            this.setData({
              ignoreBalance: false
            })
            this.getAccount();
            clearInterval(intervalId);
          }
        }
      })
      counter--;
    }, 1000);


  },

})

