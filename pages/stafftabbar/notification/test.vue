<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" isBack="true">
			<view slot="backText">返回</view>
			<view slot="content">模态窗口</view>
		</cu-custom>
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				<text class="cuIcon-title text-orange "></text> 普通窗口
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow" @click="showModal" data-target="Modal">Modal</button>
			</view>
		</view>
		<!-- "cu-modal "+"modalName==='Modal'?'show':''" -->
		<view class="cu-modal" :class="[modalName == 'Modal'?'show':'']">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">Modal标题</view>
					<view class="action" @click="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					Modal 内容。Modal 内容。Modal 内容。Modal 内容。Modal 内容。Modal 内容。
					Modal 内容。Modal 内容。Modal 内容。Modal 内容。Modal 内容。Modal 内容。
					Modal 内容。Modal 内容。Modal 内容。Modal 内容。Modal 内容。Modal 内容。
					Modal 内容。Modal 内容。Modal 内容。Modal 内容。Modal 内容。Modal 内容。
					Modal 内容。Modal 内容。Modal 内容。Modal 内容。Modal 内容。Modal 内容。
				</view>
			</view>
		</view>


		<!-- 对话窗口 -->
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				<text class="cuIcon-title text-orange "></text> 对话窗口
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow" @click="showModal" data-target="DialogModal1">Dialog</button>
				<button class="cu-btn bg-blue shadow margin-left" @click="showModal" data-target="DialogModal2">Dialog</button>
			</view>
		</view>
		<view class="cu-modal" :class="[modalName == 'DialogModal1'?'show':'']">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">开始审核</view>
					<view class="action" @click="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<form>
						<view class="cu-form-group margin-top">
							<view class="title">审核结果</view>
							<picker @change="resPickerChange" :value="resIndex" :range="resPicker.map(v => v.name)">
								<view class="picker">
									{{resIndex?resPicker[resIndex].name:'必填项，请选择'}}
								</view>
							</picker>
						</view>
						<view class="cu-form-group margin-top">
							<view class="title">审核建议</view>
							<picker @change="sugPickerChange" :value="sugIndex" :range="sugPicker.map(v => v.name)">
								<view class="picker">
									{{sugIndex?sugPicker[sugIndex].name:'必填项，请选择'}}
								</view>
							</picker>
						</view>
						<view class="cu-form-group margin-top">
							<textarea maxlength="-1" :disabled="textAreaShow!=null" v-model="textareaAInput" placeholder="简述原因(审核未通过必填;审核通过可略)"></textarea>
						</view>
					</form>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @click="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @click="testPost">确定</button>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: "",
				//审核弹框所需data
				//1.审核结果data
				resIndex: null,
				resPicker: [
					{
						label: 0,
						name: '审核通过'
					},
					{
						label: 1,
						name: '审核未通过'
					}
				],
				//2.审核建议data
				sugIndex: null,
				sugPicker: [
					{
						label: 2,
						name: '无'
					},
					{
						label: 0,
						name: '重新查验'
					},
					{
						label: 1,
						name: '重新提交材料'
					}
				],
				//3.文本框data
				textAreaShow: null,
				textareaAInput: ''
			}
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},

			resPickerChange(e) {
				console.log(e);
				this.resIndex = e.detail.value;
			},
			sugPickerChange(e){
				this.sugIndex = e.detail.value;
			},
			testPost(){
				console.log(this.resPicker[this.resIndex].label);
				console.log(this.sugPicker[this.sugIndex].label);
				console.log(this.textareaAInput);
			}
			
		}
	}
</script>

<style>
</style>
