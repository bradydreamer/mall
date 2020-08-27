<style lang="less">
@import "../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">充值明细</p>
          <Row>
            <div class="f_r">
                <Button icon="document-text" type="warning" @click="exportCharge()" :loading="exportLoading">导出</Button>
            </div>
          </Row>
          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table :columns="chargeColumn" :data="chargeData" :loading="loading" border stripe></Table>
              </div>
            </Col>
          </Row>
          <Row class="margin-top-10">
            <Col span="12">
              <Page
                ref="chargepage"
                :total="total"
                size="small"
                :pageSize="pageSize"
                @on-change="changepage"
                show-total
                show-elevator
              ></Page>
            </Col>
            <Col span="6" class="t_r">
              充值金额合计
              <Span style="color:red;">{{totalAmount}}元</Span>
            </Col>
            <Col span="6" class="t_c">
              获得积分合计
              <Span style="color:red;">{{totalPoint}}</Span>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <Table ref="exportTable" style="display:none"></Table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      merchantMobileNo: "", //当前登录商家电话号码
      loading: false,
      exportLoading: false,
      chargeColumn: [],
      chargeData: [],
      total: 0,
      totalAmount: 0.0,
      totalPoint: 0,
      pageSize: 20
    };
  },
  methods: {
    getData() {
      this.chargeColumn = [
        {
          title: "充值日期",
          align: "center",
          key: "chargeTime",
          width: 200
        },
        {
          title: "充值金额",
          align: "center",
          key: "chargeAmount",
          width: 300
        },
        {
          title: "获得积分",
          align: "center",
          key: "chargePoint",
          width: 300
        },
        {
          title: "支付方式",
          align: "center",
          key: "paymentMethodTranslate",
          width: 300,
          render: (h, params) => {
            let paymentMethod = params.row.paymentMethod;
            if (paymentMethod === "WECHAT") {
              return h("span", {}, "微信");
            } else if (paymentMethod === "ALIPAY") {
              return h("span", {}, "支付宝");
            }
          }
        },
        {
          title: "充值前积分",
          align: "center",
          key: "pointBefore",
          sortable: true
        },
        {
          title: "充值后积分",
          align: "center",
          key: "pointAfter",
          sortable: true
        }
      ];
    },
    initData() {
      this.searchMerchantCharge(0, this.pageSize,false);
    },
    searchData() {
      this.searchMerchantCharge(0, this.pageSize,false);
      this.resetpage();
    },
    exportCharge(){
      this.exportLoading = true;
      this.searchMerchantCharge(0,this.total, true);
    },
    searchMerchantCharge(startIndex, pageSize, isExport) {
      let searchOptions = {
        startIndex: startIndex,
        pageSize: pageSize
      };
      let keyArray = ["MOBILENO"];

      searchOptions.keyArray = keyArray;
      searchOptions.mobileNo = this.merchantMobileNo;
      if (!isExport) {
          this.loading = true;
      }
      this.$http
        .post("/merchant/searchCharge", this.common.request(searchOptions))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              if(!isExport){
                this.chargeData = data.charges;
                this.total = data.total;
                this.totalPoint = data.totalPoint;
                this.totalAmount = data.totalAmount;
              }else{
                var charges = data.charges;
                  charges.forEach((val,index) => {
                      var paymentMethod = val.paymentMethod;
                      if(paymentMethod == 'WECHAT')
                        val.paymentMethodTranslate = '微信';
                      else if(paymentMethod == 'ALIPAY')
                        val.paymentMethodTranslate = '支付宝';
                  });
                  this.$refs.exportTable.exportCsv({
                      filename: '充值明细',
                      columns:this.chargeColumn,
                      data:charges,
                  });
                  this.exportLoading = false;
              }
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.loading = false;
            this.$Message.error(response.data.body.status.errorDesc);
          }
        );
    },
    //将分页页码重置成1
    resetpage() {
      this.$nextTick(function() {
        this.$refs["chargepage"].currentPage = 1;
      });
    },
    //处理分页页数改变, 重新查询该页数据
    changepage(index) {
      var startIndex = (index - 1) * this.pageSize;
      this.searchMerchantCharge(startIndex, this.pageSize, false);
    },
    inquiryExchangeRate () {
            let searchOptions = {
                    'mobileNo':this.merchantMobileNo
            }
            this.$http.post("/merchant/inquiryMerchant", this.common.request(searchOptions))  
            .then(response => {
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                        if (data.closed) {
                            this.$router.push({
                                name: "login"
                              });
                        }
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {
                this.$Message.error(response.data.body.status.errorDesc);
            })
        },
  },
  mounted() {
    this.merchantMobileNo = localStorage["name"];
    this.getData();
    this.initData();
    this.inquiryExchangeRate();
  }
};
</script>