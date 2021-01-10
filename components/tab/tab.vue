<template>
	<view class="tab">
		<scroll-view class="tab-scroll" scroll-x="true" :style="{width: windowWidth + 'px'}">
			<view class="tab-scroll_box">
				<view class="tab-scroll_item" :class="{'tab-scroll_item-hidden': activeIndex !== index}" v-for="(item, index) in tabItemContent"
				 :key="index" @click="clickTab(item, index)">
					<view class="tab-scroll_item-words" :class="{active: activeIndex === index}">{{item}}</view>
					<view class="tab-scroll_item-line" :class="{'tab-scroll_item-line_show': activeIndex === index,
					'tab-scroll_item-line_hidden': activeIndex !== index}"
					 :style="{ width: tabScrollItemLineWidth + 'px' }"></view>
				</view>
			</view>
		</scroll-view>
		<!-- <view class="tab-icons" :style="{width: tabHeight + 'px'}">
			<uni-icons type="gear" size="26" color="#666"></uni-icons>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabHeight: 45,
				windowWidth: 320,
				activeIndex: 0,
				tabScrollItemLineWidth: 0
			};
		},
		props: {
			tabItemContent: {
				type: Array,
				default () {
					return []
				}
			},
			tabIndex: {
				type: Number,
				default: 0
			}
		},
		watch: {
			tabIndex(newValue) {
				this.activeIndex = newValue
			}
		},
		created() {
			// 获取系统信息，计算tab的高度
			const info = uni.getSystemInfoSync()
			this.windowWidth = info.windowWidth
			const query = uni.createSelectorQuery().in(this);
			query.select('.tab-scroll_item-words').boundingClientRect(data => {
				this.tabScrollItemLineWidth = data.width * 0.7
			}).exec();
			// 监听tab的内容变化
			this.$on('updateTabText', function(data) {
				this.tabItemContent = data
			})
		},
		methods: {
			clickTab(item, index) {
				this.activeIndex = index
				this.$emit('tab', {
					data: item,
					index
				})
			}
		}
	}
</script>

<style lang="scss">
	.tab {
		display: flex;
		width: 100%;
		background-color: #ffffff;
		border-bottom: 1rpx #f5f5f5 solid;
		box-sizing: border-box;
		overflow: hidden;

		.tab-scroll {
			flex: 1;
			overflow: hidden;
			box-sizing: border-box;

			.tab-scroll_box {
				padding: 0 10rpx;
				display: flex;
				height: 60rpx;
				align-items: flex-end;
				flex-wrap: nowrap;
				box-sizing: border-box;

				.tab-scroll_item {
					display: flex;
					flex-direction: column;
					width: 100%;
					align-items: center;
					padding: 0 16rpx;

					.tab-scroll_item-words {
						color: #a3a3a3;
						font-size: 32rpx;
						box-sizing: border-box;

						&.active {
							color: #333;
						}
					}

					.tab-scroll_item-line {}

					.tab-scroll_item-line_show {
						display: block;
						border: 2rpx $jgcy-color-base solid;
					}

					.tab-scroll_item-line_hidden {
						display: none;
					}
				}

				.tab-scroll_item-hidden {
					margin-bottom: 4rpx;
				}
			}
		}

		.tab-icons {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;

			&::after {
				content: '';
				position: absolute;
				top: 24rpx;
				bottom: 24rpx;
				width: 2rpx;
			}
		}
	}
</style>
