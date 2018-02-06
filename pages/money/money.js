//index.js
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    balance: 0,
    fee: 0,
    amount: null,
    createBtnDisabled: false,
  },
  linkToAccount: function () { // 跳转至收支明细
    wx.navigateTo({
      url: 'account/account'
    })
  },
  handleInput: function (e) {
    console.log(e.target.dataset.key + "," + e.detail.value)
    let obj = {};
    obj[e.target.dataset.key] = e.detail.value;
    this.setData(obj)
    if (e.target.dataset.key == 'amount') {
      var amount = this.data.amount;
      var balance = this.data.balance;
      if (amount > balance) {
        showMsg("余额不足，不能提现");
        amount = balance
        this.setData({
          amount: balance
        })
        var fee = util.roundFun(amount * 0.02, 2)
        this.setData({
          fee: fee
        })
      } else {
        var fee = util.roundFun(amount * 0.02, 2)
        this.setData({
          fee: fee
        })
      }
    }

  },

  onLoad: function () {
    this.getAccount()
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

  getCash: function () {
    var sessionid = app.globalData.jsessionid;
    var amount = this.data.amount;
    var balance = this.data.balance;
    if (amount > balance) {
      showMsg("余额不足，不能提现");
      return;
    }

    if (this.data.createBtnDisabled) {
      return;
    }

    this.setData({
      createBtnDisabled: true
    });

    wx.request({
      url: app.globalData.baseUrl + '/api/packet/cash?jsessionid=' + sessionid,
      method: 'POST',
      data: {
        amount: amount
      },
      header: {
        //'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: result => {
        this.setData({
          createBtnDisabled: false
        });
        if (result.data && result.data.status == 0) {
          showMsg("提交成功");
          this.getAccount();
        } else {
          showMsg(result.data.error);
        }
      }
    })
  },

  allCash: function () {
    this.setData({
      amount: this.data.balance
    });
    if (this.data.amount && this.data.amount > 0) {

    }
  },

})
function showMsg(str) {
  wx.showToast({
    title: str,
    icon: 'none'
  })
}