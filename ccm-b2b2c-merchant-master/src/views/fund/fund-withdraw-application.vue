<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Form ref="groupBuy" :label-width="120">
      <Card>
        <p slot="title">申请提现</p>
        <Row>
          <Col span="24">
            <Row type="flex" justify="start">
              <Col span="6">
                <FormItem label="可提现金额">
                  <Span style="width:200px;font-size:20px;color: red">{{availableBalance}}元</Span>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="8">
                <FormItem label="提现金额">
                  <InputNumber :min="100" v-model="withdrawAmount" style="width:200px"></InputNumber>&nbsp;&nbsp;&nbsp;<a @click="withdrawAmount = availableBalance">全部提现</a>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="8">
                <FormItem label="提现到" prop="paymentMethod">
                  <Select v-model="paymentMethod" style="width:200px">
                    <Option value="BANK">银行储蓄账号</Option>
                    <Option value="ALIPAY">支付宝</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start" v-if="paymentMethod=='BANK'">
              <Col span="6">
                <FormItem label="账户名">
                  <Input v-model="bankAccountName" style="width:200px"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start" v-if="paymentMethod=='BANK'">
              <Col span="6">
                <FormItem label="开户银行" prop="bankName">
                  <Select v-model="bankName" style="width:200px">
                    <Option :value="bank.label" v-for="bank in bankList">{{bank.label}}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start" v-if="paymentMethod=='BANK'">
              <Col span="6">
                <FormItem label="银行卡号">
                  <Input v-model="bankAccountNo" style="width:200px"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start" v-if="paymentMethod=='ALIPAY'">
              <Col span="6">
                <FormItem label="支付宝账号">
                  <Input v-model="alipayId" style="width:200px"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="6">
                  <span style="color:red">每笔提现将扣除{{merchantTaxRate}}%手续费！</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Form>

    <div class="margin-top-10">
      <Button size="large" type="default" @click="back()" class="margin-right-10">返回</Button>
      <Button type="primary" size="large" :loading="loading" @click="submit" icon="checkmark">提交</Button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      paymentMethod: "BANK", //银行储蓄账号
      bankAccountName: "",
      bankName: "中国工商银行",
      bankList: this.common.bankList,
      bankAccountNo: "",
      alipayId: "",
      withdrawAmount: 100,
      availableBalance: null,
      merchantTaxRate: 0,
      loading: false
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    submit() {
      let that = this;
      //检查金额
				if(!this.withdrawAmount){
          this.$Message.error('请输入提现金额');
					return;
				}
				if(this.withdrawAmount===0 || this.withdrawAmount>this.availableBalance){
					this.$Message.error('提现金额输入有误');
					return;
				}
				//如果是银行卡提现, 检查各项输入是否正确
				if(this.paymentMethod=='BANK'){
					if(!this.bankAccountName){
						this.$Message.error('请输入账户名');
						return;
					}
					if(!this.bankName){
						this.$Message.error('请选择开户银行');
						return;
					}
					if(!this.bankAccountNo){
						this.$Message.error('请输入银行卡号');
						return;
					}
				}
				//如果是支付宝提现, 检查各项输入是否正确
				if(this.paymentMethod=='ALIPAY'){
					if(!this.alipayId){
						this.$Message.error('请输入支付宝账号');
						return;
					}
				}
				let options = {
					merchantDTO:{
						merchantUuid: this.common.getObject('MERCHANTUUID')
					},
					withdrawAmount: this.withdrawAmount,
					bankAccountName: this.bankAccountName,
					bankName: this.bankName,
					bankAccountNo: this.bankAccountNo,
					alipayId: this.alipayId,
					paymentMethod: this.paymentMethod
				}
      this.loading = true;
      this.$http
        .post("/merchant/applyWithdraw", this.common.request(options))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.$Notice.success({
                title: "成功",
                desc: "已提交提现申请",
                duration: 2
              });
              this.$router.push({
                name: "fundwithdraw"
              });
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.loading = false;
            this.$Message.error("保存失败，请检查各项是否填写正确");
          }
        );
    },
    inquiryTaxRate() {
      this.$http
        .post(
          "/inquiryParameter",
          this.common.request({
            name: "TAX_RATE_MERCHANT"
          })
        )
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.merchantTaxRate = response.data.body.data.value;
            }
          },
          response => {}
        );
    },
    inquiryBalance() {
      this.$http
        .post(
          "/merchant/inquiryMerchant",
          this.common.request({
            merchantUuid: this.common.getObject('MERCHANTUUID')
          })
        )
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.availableBalance = response.data.body.data.availableBalance;
            }
          },
          response => {}
        );
    }
  },
  created() {
    this.inquiryTaxRate();
    this.inquiryBalance();
  }
};
</script>
