<template>
	<view>
		<view class="imgs">
			<!-- images -->
			<view class="single" v-for="(item, key) in list" :key="key" v-if="item.type == 'image'">
				<image :src="item.url" mode="aspectFit" @click="previewImg(item.url)" />
				<progress :percent="item.process" activeColor="#67C23A" :backgroundColor="item.process == 100 || item.process == undefined ? '#67C23A' : '#F56C6C'"
				 stroke-width="3" v-if="mode == 'create' && showProcess" />
				<view class="del" @click="deleteItem(key)">×</view>
			</view>
			<!-- file -->
			<view class="file" v-for="(item, key) in list" :key="key" v-if="item.type == 'file'">
				<view class="noImg" @click="downLoad(item.url)" @longpress="deleteItem(key)">{{ item.fileName }}</view>
				<progress :percent="item.process" activeColor="#67C23A" :backgroundColor="item.process == 100 || item.process == undefined ? '#67C23A' : '#F56C6C'"
				 stroke-width="3" v-if="mode == 'create' && showProcess"/>
				<view class="del" @tap="deleteItem(key)">×</view>
			</view>
			<!-- add button -->
			<view v-if="mode == 'create' && list.length < limit" class="single addNew" @click="chooseFile"><text class="cuIcon-add"></text></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			attachmentList: {
				type: Array
			},
			fileDir: {
				type: String,
				default: ''
			},
			mode: {
				type: String //模式： create => 可新增或编辑附件 不填或其他 => 只能查看附件
			},
			uploadFileUrl: {
				type: String,
				dafault: '#' // 上传文件的服务器url
			},
			showProcess: {
				type: Boolean,
				default: true //是否显示进度，默认显示
			},
			header: {
				type: Object //上传图片到服务器时，HTTP 请求 Header
			},
			limit: {
				type: Number, //限制可上传的图片数量
				default: null
			},
			fileKeyName: {
				type: String,
				default: 'file' //用于在服务端通过自定义key值获取该文件数据
			},
			canUploadFile: {
				type: Boolean,
				default: false
			},
			exts: {
				type: Array,
				default: []
			},
			chooseType: {
				type: String,
				default: ''
			}
		},
		computed: {
			list() {
				return this.attachmentList;
			}
		},
		data() {
			return {};
		},
		methods: {
			previewImg(url) {
				uni.previewImage({
					current: 0,
					urls: [url]
				});
			},
			downLoad(url) {
				uni.showModal({
					title: '确定要下载此附件吗',
					content: ' ',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '下载中,请稍后'
							});
							console.log(url);
							uni.downloadFile({
								url: url,
								success: res => {
									var tempFile = res.tempFilePath;
									uni.saveFile({
										tempFilePath: res.tempFilePath,
										success: res => {
											var savedFilePath = res.savedFilePath;
											uni.hideLoading();
											uni.showToast({
												title: '保存成功，路径为' + savedFilePath
											});
											uni.openDocument({
												filePath: savedFilePath,
												success: function(res) {
													console.log(res);
												}
											});
										}
									});
								},
								fail: res => {
									console.log(res);
									uni.hideLoading();
									uni.showToast({
										title: '下载失败',
										icon: 'none'
									});
								}
							});

							setTimeout(function() {
								uni.hideLoading();
							}, 20000);

							// downloadTask.onProgressUpdate((res) => {
							//     console.log('下载中,进度' +  res.progress)
							// });
						}
					}
				});
			},
			deleteItem(index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除此项吗？',
					success: res => {
						if (res.confirm) {
							if (this.list[index].process != 100) {
								typeof this.list[index].uploadTask != 'undefined' && this.list[index].uploadTask.abort();
							}
							this.list.splice(index, 1);
							this.$forceUpdate();
							this.$emit('update:attachmentList', this.list);
							this.$emit('update:fileDir', "")
						}
					}
				});
			},
			async chooseFile() {
				if (this.limit != null && !isNaN(this.limit)) {
					if (this.list.length >= this.limit) {
						uni.showToast({
							title: '已达到最大上传数量',
							icon: 'none'
						});
						return;
					}
				}

				var canUploadFile = this.canUploadFile;
				// 非APP和微信小程序平台不可以上传文件
				// #ifndef APP-PLUS || MP-WEIXIN
				canUploadFile = false;
				// #endif

				// #ifdef APP-PLUS
				// APP 需调用uniapp插件市场的chuck-filemanager插件，可以选择试用，然后在mainfest.json中勾选该插件，既可在自定义基座中运行
				// chuck-filemanager插件地址 https://ext.dcloud.net.cn/plugin?id=680
				if (canUploadFile) {
					const open = uni.requireNativePlugin('chuck-filemanager');
					var temp = await new Promise(resoleve => {
						open.onIntent('996', path => {
							resoleve(path);
						});
					})
					var tempFiles = ['file:///' + temp];
				}
				// #endif

				if (!canUploadFile) {
					var temps = await uni.chooseImage({
						count: this.limit == null || this.limit - this.list.length > 9 ? 9 : 9 - this.limit,
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'] //从相册选择
					});

					if (typeof temps[1] == 'undefined') {
						return;
					}
					var tempFiles = temps[1].tempFilePaths;
				} else {
					// #ifdef MP-WEIXIN
					// 如果文件选择类型为空字符串，则弹窗让用户选择
					if (this.chooseType === '') {
						var res = await uni.showActionSheet({
							itemList: ['选择图片', '选择文件']
						})
						if (res[1].tapIndex == 0) {
							var temps = await uni.chooseImage({
								count: this.limit == null || this.limit - this.list.length > 9 ? 9 : 9 - this.limit,
								sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
								sourceType: ['album'] //从相册选择
							});

							if (typeof temps[1] == 'undefined') {
								return;
							}
							var tempFiles = temps[1].tempFilePaths;
						} else {
							//微信从客户端选择文件
							var temps = await new Promise((resolve, reject) => {
								wx.chooseMessageFile({
									count: this.limit == null || this.limit - this.list.length > 9 ? 9 : 9 - this.limit,
									type: 'file',
									success(res) {
										// tempFilePath可以作为img标签的src属性显示图片
										const tempFilePaths = res.tempFiles;
										resolve(tempFilePaths);
									}
								})
							})

							var tempFiles = temps.map((ele, index) => {
								return ele.path;
							})

							var fileNames = temps.map((ele, index) => {
								return ele.name;
							})
						}
					} else if (this.chooseType === 'image') { // 只选择图片
						var temps = await uni.chooseImage({
							count: this.limit == null || this.limit - this.list.length > 9 ? 9 : 9 - this.limit,
							sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
							sourceType: ['album'] //从相册选择
						});

						if (typeof temps[1] == 'undefined') {
							return;
						}
						var tempFiles = temps[1].tempFilePaths;
					} else { // 只选择文件
						//微信从客户端选择文件
						var temps = await new Promise((resolve, reject) => {
							wx.chooseMessageFile({
								count: this.limit == null || this.limit - this.list.length > 9 ? 9 : 9 - this.limit,
								type: 'file',
								success(res) {
									// tempFilePath可以作为img标签的src属性显示图片
									const tempFilePaths = res.tempFiles;
									resolve(tempFilePaths);
								}
							})
						})

						var tempFiles = temps.map((ele, index) => {
							return ele.path;
						})

						var fileNames = temps.map((ele, index) => {
							return ele.name;
						})
					}
					// #endif
				}

				uni.showLoading({
					mask: true,
					title: '正在上传文件',
				})

				for (let i in tempFiles) {
					let path = tempFiles[i];
					if (typeof fileNames != 'undefined' && typeof fileNames[i] != 'undefined') {
						var fileName = fileNames[i];
					} else {
						var fileName = path.split('/');
						fileName = fileName[fileName.length - 1];
					}
					let index = this.list.length;

					// 判断文件是否符合要求
					if (!this.isRightFile(path)) {
						uni.hideLoading()
						uni.showModal({
							title: '提示',
							content: '上传的文件不符合格式要求',
							showCancel: false
						});
						this.list = []
						return;
					}

					this.$emit('updateRealFileName', fileName)
					// 开始上传，先暂存文件
					this.list.push({
						fileName: fileName,
						url: path,
						type: this.isImg(path) ? 'image' : 'file',
						index: index,
						uploadTask: uploadTask,
						process: 0
					});
					this.$forceUpdate();

					var uploadTask = await uni.uploadFile({
						url: this.uploadFileUrl,
						filePath: path,
						name: this.fileKeyName,
						header: this.header,
						success: res => {
							uni.hideLoading()
							uni.showToast({
								title: '上传文件成功',
								duration: 2000,
								mask: true
							})
							// 上传完成后处理
							this.$emit('uploadSuccess', res);
							if (res.statusCode === 200) {
								this.$set(this.list[index], 'process', 100);
								this.$emit('update:attachmentList', this.list);
								this.$emit('update:fileDir', JSON.parse(res.data).data[1])
								this.$forceUpdate();
							} else {

							}
						},
						fail: res => {
							uni.hideLoading()
							uni.showModal({
								title: '提示',
								content: '图片上传失败',
								showCancel: false
							});
						}
					});

					uploadTask.onProgressUpdate(res => {
						//此接口不显示真实进度， 所以需要特殊处理
						if (res.progress < 90) {
							this.$set(this.list[index], 'process', res.progress);
							this.$forceUpdate();
						}
					});
				}
			},
			//根据文件名，返回时是否是图片类型
			isImg(filePath) {
				let index = filePath.lastIndexOf('.');
				let ext = filePath.substr(index + 1);
				var temp = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg', 'tiff'].indexOf(ext.toLowerCase()) !== -1;
				return temp;
			},
			// 根据传来的文件名后缀，判断文件格式是否符合要求
			isRightFile(filePath) {
				let index = filePath.lastIndexOf('.');
				let ext = filePath.substr(index + 1);
				var temp = this.exts.indexOf(ext.toLowerCase()) !== -1;
				return temp;
			}
		}
	};
</script>

<style lang="less" scoped>
	.imgs {
		display: flex;
		flex-wrap: wrap;
		width: calc(100% + 15rpx);

		& .file {
			min-width: calc(100% - 15rpx);
			border: 2rpx solid #ccc;
			// border-radius: 10upx;
			box-sizing: border-box;
			margin-top: 20upx;
			position: relative;

			& .noImg {
				padding: 20rpx;
				display: flex;
				justify-content: center;
				text-align: left;
				width: 100%;
				font-size: 26upx;
				// flex-wrap: wrap;
				color: #999;
				word-break: break-all;
				box-sizing: border-box;
			}
		}

		progress {
			margin-top: -6rpx;
			border-radius: 20rpx;
			position: relative;
			z-index: 1;
		}

		.del {
			position: absolute;
			width: 35rpx;
			height: 35rpx;
			background: #f56c6c;
			color: #fff;
			top: 0;
			text-align: center;
			right: 0;
			line-height: 35rpx;
			font-size: 30rpx;
			z-index: 100;
		}

		& .single {
			width: 120rpx;
			height: 120rpx;
			border: 1px solid #ccc;
			position: relative;

			// &:nth-of-type(5n) {
			// 	margin-right: 0;
			// }

			&.addNew {
				display: flex;
				justify-content: center;
				align-items: center;

				text {
					font-size: 50rpx;
					color: #999;
				}
			}

			& image {
				width: 100%;
				height: 100%;
				display: block;
			}
		}
	}
</style>
