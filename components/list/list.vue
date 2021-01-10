<template>
	<swiper class="home-swiper" :current="activeIndex" @change="listChange" @touchmove.stop.prevent>
		<swiper-item v-for="(item, index) in tab" :key="index" class="swiper-item">
			<hr-pull-load @refresh='refresh' @loadMore='loadMore' :height='-1' :pullHeight='50' :maxHeight='100' :lowerThreshold='20'
			 :bottomTips='load[activeIndex].bottomTips' :isTab='false' :isAllowPull="true" ref='hrPullLoad' :isOk='isOk'>
				<list-card :item="item" :index="index" v-for="item in listCatchData[index]"></list-card>
			</hr-pull-load>
		</swiper-item>
	</swiper>
</template>

<script>
	import qs from 'qs'
	import utils from '../../utils/utils.js'

	export default {
		data() {
			return {
				listCatchData: {}, //存储对应大状态下的数据
				load: [{
						page: 1,
						bottomTips: 'loading'
					},
					{
						page: 1,
						bottomTips: 'loading'
					},
					{
						page: 1,
						bottomTips: 'loading'
					},
					{
						page: 1,
						bottomTips: 'loading'
					},
					{
						page: 1,
						bottomTips: 'loading'
					},
				],
				pageSize: 10,
				order: 'update_time',
				scope: 0,
				pageCurrent: 0,
				item: null,
				stateitems: 1,
				isFilter: false, //判断是否为筛选的标志
				// bottomTips: 'loading',
				isOk: false
			};
		},
		props: {
			tab: {
				type: Array,
				default () {
					return []
				}
			},
			activeIndex: {
				type: Number,
				default: 0
			}
		},
		created() {},
		methods: {
			//切换页面时请求数据
			listChange(e) {
				const current = e.detail.current
				this.pageCurrent = current
				this.$emit('change', current)
				if (current === 0)
					this.stateitems = 1
				if (current === 1)
					this.stateitems = [2, 3, 8]
				if (current === 2)
					this.stateitems = [4, 6, 7]
				if (current === 3)
					this.stateitems = 9
				if (current === 4)
					this.stateitems = 5
				this.isFilter = false
				this.listCatchData[this.pageCurrent] = []
				this.load[this.pageCurrent].page = 1
				this.load[this.pageCurrent].bottomTips = 'loading'
				// this.bottomTips='loading'
				this.order = 'update_time'
				this.scope = 0
				this.getlist()
			},
			//请求函数
			getlist() {
				let controller = '/order/select_ord_page2?'
				if (this.isFilter) { //如果为筛选，则将请求参数中的stateitems更换为筛选中的item数组
					this.stateitems = this.item
				}
				let data = {
					current: this.load[this.pageCurrent].page,
					orderColumn: this.order,
					scope: this.scope,
					size: this.pageSize,
					sortOrder: 1,
					states: this.stateitems,
				}
				if (utils.getLoginType() === 'employee' && this.stateitems === 1) {
					controller = '/apply_ord/select_ord_page?'
					data = {
						current: this.load[this.pageCurrent].page,
						orderColumn: this.order,
						size: this.pageSize,
						sortOrder: 1,
						states: this.stateitems,
					}
					const datas = qs.stringify(data, {
						indices: false
					})
					this.$request.get(
						this.$request.baseUrl + controller + datas
					).then(res => {
						if (res.data.data.length > 0) {
							if (res.data.data.length < 10) {
								this.load[this.pageCurrent].bottomTips = "nomore";
							} else {
								this.load[this.pageCurrent].bottomTips = "more";
							}
						} else {
							this.load[this.pageCurrent].bottomTips = "nomore";
						}
						let oldList = this.listCatchData[this.pageCurrent] || []
						oldList.push(...res.data.data)
						this.$set(this.listCatchData, this.pageCurrent, oldList)
						this.$forceUpdate();
					})

				} else {
					const datas = qs.stringify(data, {
						indices: false
					})
					this.$request.get(
						this.$request.baseUrl + controller + datas
					).then(res => {
						if (res.data.data.records.length > 0) {
							if (res.data.data.records.length < 10) {
								this.load[this.pageCurrent].bottomTips = "nomore";
							} else {
								this.load[this.pageCurrent].bottomTips = "more";
							}
						} else {
							this.load[this.pageCurrent].bottomTips = "nomore";
						}
						let oldList = this.listCatchData[this.pageCurrent] || []
						oldList.push(...res.data.data.records)
						this.$set(this.listCatchData, this.pageCurrent, oldList)
						this.$forceUpdate();
					})
				}

			},
			//上拉加载更多
			loadMore() {
				this.load[this.pageCurrent].page++
				this.load[this.pageCurrent].bottomTips = "loading"
				this.getlist()
			},
			//下拉刷新列表
			refresh() {
				this.listCatchData[this.pageCurrent] = []
				this.load[this.pageCurrent].page = 1
				this.load[this.pageCurrent].bottomTips = ""
				this.getlist()
				this.isOk = !this.isOk
			},
		}
	}
</script>

<style lang="scss">
	.home-swiper {
		height: 100%;

		.swiper-item {
			height: 100%;
			overflow: hidden;

			// .list-scroll {
			// 	height: 100%;
			// }
		}
	}
</style>
