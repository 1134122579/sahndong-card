const api = {
  Login: '/wxLogin', //微信授权登录
  getUserInfo: '/userInfo', //获取信息
  UserName: '/name',
  payTicketOrder: '/payTicketOrder', //单次票据费用
  queryTicketOrder: '/queryTicketOrder', //单次票据费用查询
  payVipOrder: '/payVipOrder', //会员购买
  queryVipOrder: '/queryVipOrder', //会员购买查询
  getShare: '/getSignPackage', //获取分享
  getProblem: '/getProblem', //获取问题
  subProblem: '/subProblem', //提交积分
  getReport: '/getReport', //获取排行榜
  getRule: '/getRule', //获取规则
  getToken: '/getToken', //获取token
  getApiTicket: '/getApiTicket',
  cardExtSignPackage: '/cardExtSignPackage',
  upCardImage: '/upCardImage',
  authUserInfo: '/authUserInfo',
  getQiShu: '/getQiShu', //获取期数
  receiveVip: '/receiveVip',
  getUserOrder: '/getUserOrder',
  createSkybeerCode: '/createSkybeerCode',
  receiveSkyBeerVip: '/receiveSkyBeerVip',
  checkYearVip: '/checkYearVip', //检查年卡是否是会员
  ReceiveCoupon: '/ReceiveCoupon',
  getCouponLog: '/getCouponLog',
  checkCoupon: '/checkCoupon',
  getCouponDetial: '/getCouponDetial'
}

export default api
