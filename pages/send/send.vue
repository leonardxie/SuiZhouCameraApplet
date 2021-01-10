<template>
	<view>
		<cu-custom bgColor="bg-theme-color" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">派单</block>
		</cu-custom>
		<form @submit="sendProject">
			<view class="cu-form-group margin-top">
				<view class="title required">项目名称</view>
				<input placeholder="请输入项目名称" name="orderName"></input>
			</view>
			<view class="cu-form-group">
				<view class="title required">报关单号</view>
				<input placeholder="请输入报关单号" name="orderNumber"></input>
			</view>
			<view class="cu-form-group">
				<view class="title required">项目类别</view>
				<input placeholder="请输入项目类别" name="goodClass"></input>
			</view>
			<view class="cu-form-group">
				<view class="title required">计划完成日期</view>
				<picker mode="date" :value="date" :start="date" @change="DateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title required">计划完成时间</view>
				<picker mode="time" :value="time" :start="time" @change="TimeChange">
					<view class="picker">
						{{time}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title required">货主姓名</view>
				<input placeholder="请输入货主姓名" name="ownerName"></input>
			</view>
			<view class="cu-form-group">
				<view class="title required">货主联系方式</view>
				<input placeholder="请输入货主联系方式" name="ownerPhone" type="number"></input>
			</view>
			<view class="cu-bar bg-white margin-top">
				<view class="action required">
					报关单
				</view>
				<view class="action">
					jpg/jpeg/png/pdf
				</view>
			</view>
			<view class="cu-form-group margin-bottom">
				<view class="grid col-4 grid-square flex-sub margin-bottom">
					<Attachment mode="create" :canUploadFile="true" :uploadFileUrl="uploadFileUrl" :attachmentList.sync="attachmentList"
					 :fileDir.sync="orderFileDir" :header="header" :showProcess="true" :limit=1 :exts="orderExts" :chooseType="orderFileType" @updateRealFileName="updateOrderFileName"></Attachment>
				</view>
			</view>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					附件
				</view>
				<view class="action">
					zip/rar
				</view>
			</view>
			<view class="cu-form-group margin-bottom">
				<view class="grid col-4 grid-square flex-sub margin-bottom">
					<Attachment mode="create" :canUploadFile="true" :uploadFileUrl="uploadFileUrl" :attachmentList.sync="attachmentList"
					 :fileDir.sync="orderAccessoryDir" :header="header" :showProcess="true" :limit=1 :exts="annexExts" :chooseType="annexFileType" @updateRealFileName="updateOrderAccessoryName"></Attachment>
				</view>
			</view>
			<view class="upload">
				<button class="cu-btn block margin-tb-sm lg upload-button" form-type="submit">
					<text class="cuIcon-upload"></text> 上传</button>
			</view>
		</form>
	</view>
</template>

<script>
	import Attachment from '../../components/jin-attachment/jin-attachment.vue';
	import utils from '../../utils/utils.js'

	export default {
		components: {
			Attachment
		},
		data() {
			return {
				time: (new Date()).Format("HH:mm"),
				date: (new Date()).Format("yyyy-MM-dd"),
				orderExts: ['jpg', 'jpeg', 'png', 'pdf'],
				annexExts: ['zip', 'rar'],
				orderFileType: 'file',
				annexFileType: 'file',
				uploadFileUrl: this.backendUrl + '/File/file_upload',
				header: {
					'Authorization': utils.getSessionID()
				},
				orderFileDir: '',
				orderAccessoryDir: '',
				realOrderFileName: '',
				realOrderAccessoryName: '',
				promptInfo: {
					"orderName": {
						"empty": '项目名称不能为空',
					},
					"orderNumber": {
						"empty": '报关单号不能为空',
					},
					"ownerName": {
						"empty": '货主姓名不能为空',
					},
					"ownerPhone": {
						"empty": '货主联系方式不能为空',
					},
					"goodClass": {
						"empty": '项目类别不能为空',
					},
					"deadlineTime": {
						"empty": '计划完成时间不能为空',
					},
					"orderFileDir": {
						"empty": '报关单文件不能为空',
					},
					"orderAccessoryDir": {

					},
				}
			}
		},
		methods: {
			TimeChange(e) {
				this.time = e.detail.value
			},
			DateChange(e) {
				this.date = e.detail.value
			},
			updateOrderFileName: function(fileName = '') {
				this.realOrderFileName = fileName
			},
			updateOrderAccessoryName: function(fileName = '') {
				this.realOrderAccessoryName = fileName
			},
			sendProject: function(e) {
				var formdata = e.detail.value
				formdata['deadlineTime'] = this.date + ' ' + this.time + ':00' // 后端需要精确到秒
				formdata['orderFileDir'] = this.orderFileDir
				formdata['orderAccessoryDir'] = this.orderAccessoryDir
				formdata['orderFileName'] = this.realOrderFileName
				formdata['orderAccessoryName'] = this.realOrderAccessoryName
				console.log(formdata)
				if (this.validateFormData(formdata)) {
					uni.showLoading({
						title: '正在上传',
						mask: true
					});
					this.$request.post(
						this.$request.baseUrl + '/dist_ord/add_order',
						formdata, {
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}
					).then(function(res) {
						uni.hideLoading()
						if (res.data.code === 0) {
							uni.showToast({
								title: '上传成功',
								duration: 2000,
								success() {
									setTimeout(function() {
										uni.navigateBack({
											delta: 1
										});
									}, 2000)
								}
							})
						} else {
							uni.showModal({
								title: '提示',
								content: res.data.msg,
								showCancel: false
							});
						}
					}).catch(function() {
						uni.hideLoading()
						uni.showModal({
							title: '错误',
							content: `创建项目失败`,
							showCancel: false
						});
					});
				}
			},
			validateFormData: function(formData = {}) {
				for (let k in formData) {
					console.log(k)
					if (k !== 'orderAccessoryDir' && k !== 'orderAccessoryName' && k !== 'orderFileName' && formData[k] === '') {
						uni.showModal({
							title: '提示',
							content: this.promptInfo[k]['empty'],
							showCancel: false
						});
						return false
					}
				}
				return true
			}
		}
	}
</script>

<style lang="scss">
	.required::before {
		content: "*";
		color: #f56c6c;
		margin-right: 4px;
	}

	.upload {
		padding: 0 100rpx;

		.upload-button {
			background-color: #004fb9;
			color: #F0F0F0;
		}
	}
</style>
