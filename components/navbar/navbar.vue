<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<!-- 状态栏 -->
			<view :style="{height: statusBarHeight + 'px'}"></view>
			<!-- 导航栏 -->
			<view class="navbar-content" :class="{search:isSearch}" :style="{height: navBarHeight + 'px', width: navBarContentWidth + 'px'}" @click.stop="open">
				<view v-if="isSearch" class="navbar-content_search-icons" @click="back">
					<uni-icons type="back" size="22" color="#fff"></uni-icons>
				</view>
				<view v-if="!isSearch" class="navbar-search" :style="{height: navBarSearchHeight - 4 + 'px'}">
					<view class="navbar-search_icon">
						<uni-icons type="search"></uni-icons>
					</view>
					<view class="navbar-search_text"></view>
				</view>
				<view v-else class="navbar-search" :style="{height: navBarSearchHeight - 4 + 'px'}">
					<view class="navbar-content__search-icons">
						<uni-icons type="search"></uni-icons>
					</view>
					<input class="navbar-search_text" type="text" v-model="val" placeholder="请输入您要搜索的内容" confirm-type="搜索" @confirm="confirm" adjust-position="false" />
				</view>
			</view>
		</view>
		<view :style="{height: statusBarHeight + navBarHeight + 'px'}"></view>
	</view>
</template>

<script>
	export default {
		props:{
			value:{
				type:[String,Number],
				default:''
			},
			isSearch:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				statusBarHeight: 20,
				navBarHeight: 45,
				navBarContentWidth: 375,
				navBarSearchHeight: 40,
				val:""
			};
		},
		watch:{
			value(newVal){
				this.val = newVal
			}
		},
		methods:{
			back(){
				uni.switchTab({
					url:'/pages/stafftabbar/view/view'
				})
			},
			open(){
				if (this.isSearch) return
				uni.navigateTo({
					url:"/pages/search/search"
				})
			},
			confirm(e){
				const {value} = e.detail
				this.$emit('input',value)
			}
		},
		created() {
			const info = uni.getSystemInfoSync()
			this.statusBarHeight = this.StatusBar
			this.navBarContentWidth = info.windowWidth
			// #ifndef H5 || APP-PLUS || MP-ALIPAY
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.navBarHeight = (menuButtonInfo.top - this.statusBarHeight) * 2 + menuButtonInfo.height
			this.navBarContentWidth = menuButtonInfo.left
			this.navBarSearchHeight = menuButtonInfo.height
			// #endif
		}
	}
</script>

<style lang="scss">
	.navbar {
		.navbar-fixed {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			background-color: $jgcy-color-base;

			.navbar-content {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 15rpx;
				box-sizing: border-box;

				.navbar-search {
					border-radius: 30rpx;
					padding: 0 10rpx;
					width: 100%;
					display: flex;
					align-items: center;
					background-color: #fff;
					
					.navbar-search_icon {
						margin-left: 10rpx;
					}

					.navbar-search_text {
						font-size: 14px;
						color: #999;
					}
				}
				&.search{
					padding-left: 0;
					
					.navbar-content__search-icons {
						margin-left: 10rpx;
						margin-right: 10rpx;
					}
					
					.navbar-search {
						border-radius: 12rpx;
					}
				}
			}
		}
	}
</style>
