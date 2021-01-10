<template>
	<view class="home">
		<navbar :isSearch="true" v-model="value" @input="change"></navbar>
		<view class="home-list">
			<view v-if="is_history" class="label-box">
				<view class="label-header">
					<text class="label-title">搜索历史</text>
					<text class="label-clear" @click="clear">清空</text>
				</view>
				<view v-if="historyList.length>0" class="label-content">
					<view class="label-content__item" v-for="(item,index) in historyList" :key="index" @click="openHistory(item)">{{item.name}}</view>
				</view>
				<view v-else class="no-data">
					没有搜索历史
				</view>
			</view>
			<list-scroll v-else class="list-scroll">
				<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
				<view v-if="searchList.length>0">
					<view v-if="searchList1.length>0">
						<view class="radius shadow-blur type"><text class="text-black">已发布未派单</text></view>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList1" @click="setHistory" :key="idx" v-if="idx < 3"></list-card>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList1" @click="setHistory" :key="idx" v-show="show1" v-if="idx >= 3"></list-card>
						<view class="shrink bg-white check-more" style="margin-bottom: 4rpx;" v-if="searchList1.length > 3" @click='toggle(1)'>
							<view class="check-more-content">
								{{show1 ? '收起': '查看更多'}}
							</view>
							<view class="check-more-sword">
								{{show1 ? '': '>'}}
							</view>
						</view>
					</view>
					<view v-if="searchList2.length>0">
						<view class="radius shadow-blur type"><text class="text-black">已派单未执行</text></view>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList2" @click="setHistory" :key="idx" v-if="idx < 3"></list-card>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList2" @click="setHistory" :key="idx" v-show="show2" v-if="idx >= 3"></list-card>
						<view class="shrink bg-white check-more" style="margin-bottom: 4rpx;" v-if="searchList2.length > 3"
						 @click='toggle(2)'>
							<view class="check-more-content">
								{{show2 ? '收起': '查看更多'}}
							</view>
							<view class="check-more-sword">
								{{show2 ? '': '>'}}
							</view>
						</view>
					</view>
					<view v-if="searchList3.length>0">
						<view class="radius shadow-blur type"><text class="text-black">执行中</text></view>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList3" @click="setHistory" :key="idx" v-if="idx < 3"></list-card>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList3" @click="setHistory" :key="idx" v-show="show3" v-if="idx >= 3"></list-card>
						<view class="shrink bg-white check-more" style="margin-bottom: 4rpx;" v-if="searchList3.length > 3"
						 @click='toggle(3)'>
							<view class="check-more-content">
								{{show3 ? '收起': '查看更多'}}
							</view>
							<view class="check-more-sword">
								{{show3 ? '': '>'}}
							</view>
						</view>
					</view>
					<view v-if="searchList4.length>0">
						<view class="radius shadow-blur type"><text class="text-black">已执行未提交</text></view>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList4" @click="setHistory" :key="idx" v-if="idx < 3"></list-card>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList4" @click="setHistory" :key="idx" v-show="show4" v-if="idx >= 3"></list-card>
						<view class="shrink bg-white check-more" style="margin-bottom: 4rpx;" v-if="searchList4.length > 3"
						 @click='toggle(4)'>
							<view class="check-more-content">
								{{show4 ? '收起': '查看更多'}}
							</view>
							<view class="check-more-sword">
								{{show4 ? '': '>'}}
							</view>
						</view>
					</view>
					<view v-if="searchList5.length>0">
						<view class="radius shadow-blur type"><text class="text-black">超期</text></view>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList5" @click="setHistory" :key="idx" v-if="idx < 3"></list-card>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList5" @click="setHistory" :key="idx" v-show="show5" v-if="idx >= 3"></list-card>
						<view class="shrink bg-white check-more" style="margin-bottom: 4rpx;" v-if="searchList5.length > 3"
						 @click='toggle(5)'>
							<view class="check-more-content">
								{{show5 ? '收起': '查看更多'}}
							</view>
							<view class="check-more-sword">
								{{show5 ? '': '>'}}
							</view>
						</view>
					</view>
					<view v-if="searchList6.length>0">
						<view class="radius shadow-blur type"><text class="text-black">已提交未审核</text></view>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList6" @click="setHistory" :key="idx" v-if="idx < 3"></list-card>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList6" @click="setHistory" :key="idx" v-show="show6" v-if="idx >= 3"></list-card>
						<view class="shrink bg-white check-more" style="margin-bottom: 4rpx;" v-if="searchList6.length > 3"
						 @click='toggle(6)'>
							<view class="check-more-content">
								{{show6 ? '收起': '查看更多'}}
							</view>
							<view class="check-more-sword">
								{{show6 ? '': '>'}}
							</view>
						</view>
					</view>
					<view v-if="searchList7.length>0">
						<view class="radius shadow-blur type"><text class="text-black">审核未通过</text></view>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList7" @click="setHistory" :key="idx" v-if="idx < 3"></list-card>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList7" @click="setHistory" :key="idx" v-show="show7" v-if="idx >= 3"></list-card>
						<view class="shrink bg-white check-more" style="margin-bottom: 4rpx;" v-if="searchList7.length > 3"
						 @click='toggle(7)'>
							<view class="check-more-content">
								{{show7 ? '收起': '查看更多'}}
							</view>
							<view class="check-more-sword">
								{{show7 ? '': '>'}}
							</view>
						</view>
					</view>
					<view v-if="searchList8.length>0">
						<view class="radius shadow-blur type"><text class="text-black">执行未通过</text></view>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList8" @click="setHistory" :key="idx" v-if="idx < 3"></list-card>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList8" @click="setHistory" :key="idx" v-show="show8" v-if="idx >= 3"></list-card>
						<view class="shrink bg-white check-more" style="margin-bottom: 4rpx;" v-if="searchList8.length > 3"
						 @click='toggle(8)'>
							<view class="check-more-content">
								{{show8 ? '收起': '查看更多'}}
							</view>
							<view class="check-more-sword">
								{{show8 ? '': '>'}}
							</view>
						</view>
					</view>
					<view v-if="searchList9.length>0">
						<view class="radius shadow-blur type"><text class="text-black ">审核通过</text></view>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList9" @click="setHistory" :key="idx" v-if="idx < 3"></list-card>
						<list-card :isSearch="true" :item="item" v-for="(item, idx) in searchList9" @click="setHistory" :key="idx" v-show="show9" v-if="idx >= 3"></list-card>
						<view class="shrink bg-white check-more" style="margin-bottom: 4rpx;" v-if="searchList9.length > 3"
						 @click='toggle(9)'>
							<view class="check-more-content">
								{{show9 ? '收起': '查看更多'}}
							</view>
							<view class="check-more-sword">
								{{show9 ? '': '>'}}
							</view>
						</view>
					</view>
				</view>
				<view v-if="searchList.length === 0 && !loading" class="no-data">
					没有搜索到相关数据
				</view>
			</list-scroll>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import qs from 'qs'
	export default {
		data() {
			return {
				value: '',
				is_history: true,
				searchList: [],
				searchList1: [],
				searchList2: [],
				searchList3: [],
				searchList4: [],
				searchList5: [],
				searchList6: [],
				searchList7: [],
				searchList8: [],
				searchList9: [],
				loading: false,
				show1: false,
				show2: false,
				show3: false,
				show4: false,
				show5: false,
				show6: false,
				show7: false,
				show8: false,
				show9: false,
			}
		},
		computed: {
			...mapState(['historyList'])
		},
		methods: {
			toggle(id) {
				if (id === 1) {
					this.show1 = !this.show1
				}
				if (id === 2) {
					this.show2 = !this.show2
				}
				if (id === 3) {
					this.show3 = !this.show3
				}
				if (id === 4) {
					this.show4 = !this.show4
				}
				if (id === 5) {
					this.show5 = !this.show5
				}
				if (id === 6) {
					this.show6 = !this.show6
				}
				if (id === 7) {
					this.show7 = !this.show7
				}
				if (id === 8) {
					this.show8 = !this.show8
				}
				if (id === 9) {
					this.show9 = !this.show9
				}
			},
			clear() {
				this.$store.dispatch('clearHistory')
				uni.showToast({
					title: "清空完成"
				})
			},
			openHistory(item) {
				this.value = item.name
				this.get_search(this.value)
			},
			setHistory() {
				this.$store.dispatch('set_history', {
					name: this.value
				})
			},
			change(value) {
				if (!value) {
					clearTimeout(this.timer)
					this.mark = false
					this.get_search(value)
					return
				}
				// 做标记
				if (!this.mark) {
					this.mark = true
					this.timer = setTimeout(() => {
						this.mark = false
						this.get_search(value)
					}, 5)
				}
			},
			get_search(value) {
				if (!value) {
					this.searchList = []
					this.is_history = true
					return
				}
				this.is_history = false
				this.loading = true
				const data = {
					content: value,
					current: 0,
					size: -1,
					states: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				}
				const datas = qs.stringify(data, {
					indices: false
				})
				this.$request.get(
					this.$request.baseUrl + '/order/select_order?' + datas
				).then(res => {
					this.loading = false
					this.searchList1 = []
					this.searchList2 = []
					this.searchList3 = []
					this.searchList4 = []
					this.searchList5 = []
					this.searchList6 = []
					this.searchList7 = []
					this.searchList8 = []
					this.searchList9 = []
					for (let i = 0; i < res.data.data.records.length; i++) {
						switch (res.data.data.records[i].orderStateId) {
							case 1:
								this.searchList1.push(res.data.data.records[i])
								break;
							case 2:
								this.searchList2.push(res.data.data.records[i])
								break;
							case 3:
								this.searchList3.push(res.data.data.records[i])
								break;
							case 4:
								this.searchList4.push(res.data.data.records[i])
								break;
							case 5:
								this.searchList5.push(res.data.data.records[i])
								break;
							case 6:
								this.searchList6.push(res.data.data.records[i])
								break;
							case 7:
								this.searchList7.push(res.data.data.records[i])
								break;
							case 8:
								this.searchList8.push(res.data.data.records[i])
								break;
							case 9:
								this.searchList9.push(res.data.data.records[i])
								break;
						}
					}
					this.searchList = res.data.data.records
				}).catch(
					this.loading = false
				)
				this.setHistory()
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
		background-color: #f5f5f5;
	}

	.home {
		display: flex;
		flex-direction: column;
		flex: 1;

		.label-box {
			background-color: #fff;
			margin-bottom: 20rpx;

			.label-header {
				display: flex;
				justify-content: space-between;
				font-size: 28rpx;
				color: #666;
				padding: 20rpx 30rpx;
				border-bottom: 2rpx #f5f5f5 solid;

				.label-clear {
					color: #30b33a;
					font-weight: bold;
				}
			}

			.label-content {
				display: flex;
				flex-wrap: wrap;
				padding: 15px;
				padding-top: 0;

				.label-content__item {
					padding: 4rpx 20rpx;
					margin-top: 24rpx;
					margin-right: 20rpx;
					border-radius: 10rpx;
					border: 2rpx #666 solid;
					font-size: 28rpx;
					color: #666;
				}
			}
		}
		
		.list-scroll {
			
			.type {
				margin: 10rpx 0;
				margin-left: 4%;
			}
			
			.check-more {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 48rpx;
				color: #888888;
				
				.check-more-content {
					width: 150rpx;
					margin-left: 4%;
				}
				
				.check-more-sword {
					margin-right: 3%;
				}
			}
		}
	}

	.no-data {
		height: 400rpx;
		line-height: 400rpx;
		width: 100%;
		text-align: center;
		font-size: 28rpx;
		color: #666;
	}
</style>
