<template>
	<view>
		<view class='solid-bottom padding' style="left: 0;right:0;margin-top: 170rpx;margin-bottom: 50rpx;">
			<view class="flex justify-center">
				<text style="font-size: 25px;display: inline-block;">神百随车吊—— </text><text style="font-size: 25px;display: inline-block;">千里眼</text>
			</view>
		</view>
		<!-- <view class="solid-bottom padding" style="margin-top: 170rpx;margin-bottom: 50rpx;margin-left: 0;margin-right: 0;">
			<text style="font-size: 25px;">神百随车吊——千里眼</text>
		</view> -->
	
		<!-- 轮播图 -->
		<swiper class="card-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
				 :autoplay="true" interval="5000" duration="500" @change="cardSwiper" indicator-color="#8799a3"
				 indicator-active-color="#0081ff">
			<swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''">
				<view class="swiper-item">
					<image class="swiper-image" :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
					<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type=='video'"></video>
				</view>
			</swiper-item>
		</swiper>
		<view>
			<button  class="cu-btn round bg-blue" role="button" aria-disabled="false"
			style="width: 80%;margin-left: 10%;margin-top: 20px;height: 100rpx;" 
			open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">进入</button>	
		</view>
		<view style="position: fixed;bottom: 10%;left: 0;right:0">
			<view class="flex justify-center">
				<text style="font-size: 16px;">湖北神百专用汽车有限公司</text>
			</view>
			<view class="flex justify-center">
				<text style="font-size: 16px;">随州武汉理工大学工业研究院</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import utils from '../../utils/utils.js'
	export default {
		data() {
			return {
				cardCur: 0,
				swiperList: [],
				dotStyle: false,
				towerStart: 0,
				direction: '',
				wh:''
			}
		},
		onShareAppMessage(res) {
		  if (res.from === 'button') {// 来自页面内分享按钮
		    console.log(res.target)
		  }
		  return {
		    title: '自定义分享标题',
		    path: 'pages/Login/Login'
		  }
		},
		onLoad:function(){
			uni.getSystemInfo({
				success: (res) => {
					this.wh=res.windowHeight;
				}
			})
		},
		created() {
			//直接登录
			this.autoLogin();
			this.getFirDir();
		},
		mounted: function() {
			//页面刷新时执行
		
		},
		methods: {
			autoLogin(){
				const _this=this;
				uni.request({
					method: 'get',
					url: this.$request.baseUrl + '/public/captcha',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log(res);
						let Data = {
							phone: '15296794930',
							password: '123456',
							role: 3,
							code: res.data.data.code,
							cToken: res.data.data.cToken,
						};
						uni.request({
							method: 'post',
							url: this.$request.baseUrl + '/public/login',
							data: Data,
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							success: (res) => {
								if (res.data.code === 0) {
									utils.storageSessionID(res.data.data.sessionId);
									utils.storageLoginType(res.data.data.loginType);
									utils.storageUserName(res.data.data.userName);
									utils.storageUserId(res.data.data.userId);
								}  
							}
						});
					}
				});	
			},
			// 登录
			getuserinfo() {
				const _this=this;
				uni.login({
					success(res) {
						if (res.code) {
							// 获取微信用户信息
							uni.getUserInfo({
								success: function(res) {
									//用户信息
									console.log(res);
									const userInfo = res.userInfo;
									//性别 0：未知、1：男、2：女
									const { nickName, avatarUrl, gender, province, city, country } = userInfo;
									uni.setStorageSync('userInfo', userInfo);//本地缓存
									console.log(utils.getSessionID());
									let data = {
										avatarUrl: userInfo.avatarUrl,
										city: userInfo.city,
										country: userInfo.country,
										gender: userInfo.gender,
										nickName: userInfo.nickName,
										province: userInfo.province
									};
									console.log(data);
									//将用户的信息存入数据库
									_this.$request.post(
										_this.$request.baseUrl + '/public/add_mpuser', data, {
											header: {
												'Content-Type': 'application/json'
											}
										}).then(function(res) {
											uni.switchTab({
												url: '../stafftabbar/view/view'
											});
									});
								},
								fail: res => {
								  // 获取失败的去引导用户授权
									uni.showToast({
										title: '授权后方可使用！'
									});
								}
							});
					  } 
				  }
				});
			},
			getFirDir() {
			  const _this = this;
				uni.request({
				 	method: 'get',
				 	url: this.$request.baseUrl + '/depot/select_carousel_list?depotId=1&orderColumn=upload_time&sortOrder=0',
				 	header: {
				 		'content-type': 'application/json'
				 	},
				 	success: (res) => {
						const records=res.data.data;
						console.log(Object.keys(records).length);
				 		const dirs = []
				 		for (let i = 0; i < Object.keys(records).length; i++) {
				 		  uni.request({
				 		   	method: 'get',
				 		   	url: _this.$request.baseUrl + '/file/file_download_url?FileDir='+records[i].picFileDir,
				 		   	header: {
				 		   		'content-type': 'application/json'
				 		   	},  
								success: (res1) => {
									var result=res1.data.msg;
									if(result[24]==4){
										var subStr=new RegExp('http://www.indulive.com:443','ig');//创建正则表达式对象,不区分大小写,全局查找
										var place=result.replace(subStr,"https://www.indulive.com:443");//把'is'替换为空字符串
										console.log(place); //th all there 
										result=place;
									}
									
									// const disLength = result.length;
									// const shortName = result.substring(disLength-7,disLength);
									//console.log(result[24]);
									dirs.push({
										id: i,
										type: 'image',
										url: result
									})
				 		    }	
							});
						}
						console.log('dirs:' + dirs);
						_this.swiperList= dirs;	
				 	},
				});
			},
			
			DotStyle(e) {
				this.dotStyle = e.detail.value
			},
		// cardSwiper
			cardSwiper(e) {
				this.cardCur = e.detail.current
			}
		}
	}
</script>

<style>
	.card-swiper{
		height: 550rpx !important;
	}
	
</style>
