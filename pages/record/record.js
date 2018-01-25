//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        navActiveFirst: true, // 默认显示第一个nav
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        sendNum: 0, // 发出的红包数
        sendMoney: 0.99, // 发出的金额
        sendList: [
            {text: "大狗子新年快乐", total: 1000, time: '1-11 6:35', num: 10, yet: 5},
            {text: "二狗子新年快乐", total: 1000, time: '1-11 6:35', num: 10, yet: 5},
            {text: "三狗子新年快乐", total: 1000, time: '1-11 6:35', num: 10, yet: 5},
            {text: "四狗子新年快乐", total: 1000, time: '1-11 6:35', num: 10, yet: 5},
            {text: "五狗子新年快乐", total: 1000, time: '1-11 6:35', num: 10, yet: 5},
            {text: "六狗子新年快乐", total: 1000, time: '1-11 6:35', num: 10, yet: 5}
        ], // 发出的记录 ，数据为假设，根据具体返回修改模板中的属性值
        receiveNum: 0, // 收到的红包数
        receiveMoney: 0.00, // 收到的金额
        receiveList: [ // 收到的记录
            {text: "1新年快乐", total: 1000, time: '1-11 6:35', num: 10, yet: 5},
            {text: "2新年快乐", total: 1000, time: '1-11 6:35', num: 10, yet: 5},
            {text: "3新年快乐", total: 1000, time: '1-11 6:35', num: 10, yet: 5},
            {text: "4新年快乐", total: 1000, time: '1-11 6:35', num: 10, yet: 5},
            {text: "5新年快乐", total: 1000, time: '1-11 6:35', num: 10, yet: 5},
            {text: "6新年快乐", total: 1000, time: '1-11 6:35', num: 10, yet: 5}
        ]
    },
    changeTab: function () { // 切换nav
        var _self = this;
        _self.setData({
            navActiveFirst: !_self.data.navActiveFirst,
        })
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
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})
