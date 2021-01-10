<template>
	<view class="message">
		<cu-custom bgColor="bg-theme-color" id="customNav">
			<block slot="content">消息</block>
		</cu-custom>

		<!-- 消息页面-tab 开始-->
		<tab @tab="tab" :tabIndex="tabIndex" :tabItemContent="tabText.map(v => v.title)" id="tab"></tab>
		<view class="content" :style="{ height: scrollViewHeight + 'px'}">
			<check-attention ref="attention" :tab="tabText" :scrollViewHeight="scrollViewHeight" :activeIndex="activeIndex" @change="change"></check-attention>
		</view>
		<!-- 消息页面-tab 结束 -->

	</view>
</template>

<script>
	import checkAttention from "@/pages/stafftabbar/notification/check-attention/check-attention.vue";
	import utils from "@/utils/utils.js";
	
	export default {
		components: {
			checkAttention
		},
		data() {
			return {
				//登录角色
				loginType: "",
				
				//tabText用来接收tText的过滤结果
				tabText: ['已接单','待审核','介入请求','超期','接单成功','未通过审核'],
				tText: [
					{
						id: 1,
						title: '已接单'
					},
					{
						id: 2,
						title: '待审核'
					},
					{
						id: 3,
						title: '介入请求'
					},
					{
						id: 4,
						title: '超期'
					},
					{
						id: 5,
						title: '接单成功'
					},
					{
						id: 6,
						title: '未通过审核'
					}
				],
				tabIndex: 0,
				activeIndex: 0,
				//消息页面
				pageInfo: {
					name: "消息页面",
					pageId: 1
				},

				//当前分段器激活情况
				current: 0,
				// 页面总高度将会放在这里
				windowHeight: 0,
				// navbar的高度
				navbarHeight: 0,
				// header的高度
				headerHeight: 0,
				// scroll-view的高度
				scrollViewHeight: 0
			}
		},
		onLoad() {
			this.watchWindow();
		},
		onShow() {
			//获取登录角色
			this.loginType = utils.getLoginType();
			//移除红点提示
			uni.removeTabBarBadge({
				index: this.pageInfo.pageId
			});
			getApp().globalData.tabIndex = this.pageInfo.pageId;
			this.refreshInfo();
		},
		watch:{
			//根据登录角色加工消息页面的tab栏
			loginType:function(newVal,oldVal){
				if(newVal != "staff"){
					this.tabText = this.tText.filter(v=>v.id >= 4);
				}else{
					this.tabText = this.tText.filter(v=>v.id <= 3);
				}
			}
		},
		methods: {
			change(current) {
				this.tabIndex = current
				this.activeIndex = current
			},
			tab(data, index) {
				this.activeIndex = data.index;
				// console.log(this.tabIndex);
				// console.log(this.activeIndex);
			},
			
			// 解决不同用户登录后,消息页面没有刷新的bug
			refreshInfo(){
				let tabInfo = [];
				if(this.loginType != 'staff'){
					tabInfo = this.tText.filter(v=>v.id >= 4);
				}else{
					tabInfo = this.tText.filter(v=>v.id <= 3);
				}
				
				this.$refs.attention.requestData(tabInfo[this.activeIndex].id);
			},
			
			// 自适应,让sroll-view撑满剩余窗口
			watchWindow() {
				var _this = this;
				uni.getSystemInfo({
					success: (result) => {
						_this.windowHeight = result.windowHeight;
					}
				})

				// 然后取出navbar和header的高度
				// 根据文档，先创建一个SelectorQuery对象实例
				const query = uni.createSelectorQuery().in(this);
				// 然后逐个取出navbar和header的节点信息
				// 选择器的语法与jQuery语法相同
				query.select('#customNav').boundingClientRect();
				query.select('#tab').boundingClientRect();

				// 执行上面所指定的请求，结果会按照顺序存放于一个数组中，在callback的第一个参数中返回
				query.exec((res) => {
					// 分别取出navbar和header的高度
					let navbarHeight = res[0].height;
					let headerHeight = res[1].height;

					// 然后就是做个减法
					let scrollViewHeight = _this.windowHeight - navbarHeight - headerHeight;

					// 算出来之后存到data对象里面
					_this.scrollViewHeight = scrollViewHeight;
					console.log(scrollViewHeight);
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	// .message-wrap {
	// 	.message-head {
	// 		.uni-segmented {
	// 			width: 60%;
	// 			//水平居中
	// 			margin: 0 auto;
	// 		}
	// 	}
	// }

	page {
		height: 100%;
		display: flex;
		overflow-x: hidden;
	}

	.message {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;

		.content {
			height: 100%;
			flex: 1;
			box-sizing: border-box;
		}
	}
</style>
