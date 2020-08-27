<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">同城配送收费模板</p>
          <Row>
            <Button icon="plus" type="primary" @click="add()">添加同城配送收费模板</Button>
          </Row>

          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table
                  :columns="deliveryColumn"
                  :data="deliveryData"
                  :loading="loading"
                  border
                  stripe
                  ref="deliveryTable"
                ></Table>
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>

export default {
  components: {
    
  },
  data() {
    return {
      loading: false,
      deliveryColumn: [
        {
          title: "模板名称",
          align: "center",
          key: "name",
          width: 150
        },
        {
          title: "发货地址",
          align: "center",
          width: 250,
          key: "deliveryFromAddress"
        },
        {
          title: "配送范围",
          align: "center",
          width: 120,
          render: (h, params) => {
            let deliveryConditionDistance = params.row.deliveryConditionDistance;
            return h("span", {}, deliveryConditionDistance+'公里');
          }
        },
        {
          title: "起送金额",
          align: "center",
          width: 120,
          render: (h, params) => {
            let deliveryConditionAmount = params.row.deliveryConditionAmount;
            return h("span", {}, deliveryConditionAmount+'元');
          }
        },
        {
          title: "计费方式",
          align: "center",
          render: (h, params) => {
            let firstDistance = params.row.firstDistance;
            let firstPrice = params.row.firstPrice;
            let nextDistance = params.row.nextDistance;
            let nextPrice = params.row.nextPrice;
            return h("span", {}, firstDistance+'公里内免费配送,超出后起步价'+firstPrice+' 元, 每增加'+nextDistance+'公里(不够1公里按1公里计算),增加费用'+nextPrice+'元');
          }
        },
        {
          title: "是否默认",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h("i-switch", {
              props: {
                type: "primary",
                value: params.row.default //控制开关的打开或关闭状态，官网文档属性是value
              },
              style: {
                marginRight: "5px"
              },
              on: {
                "on-change": value => {
                  this.setDefaultProductDelivery(params.index); //params.index是拿到table的行序列，可以取到对应的表格值
                }
              }
            });
          }
        },
        {
          title: "是否启用",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h("i-switch", {
              props: {
                type: "primary",
                value: params.row.active //控制开关的打开或关闭状态，官网文档属性是value
              },
              style: {
                marginRight: "5px"
              },
              on: {
                "on-change": value => {
                  this.setEnableProductDelivery(params.index); //params.index是拿到table的行序列，可以取到对应的表格值
                }
              }
            });
          }
        },
        {
          title: "操作",
          align: "center",
          width: 180,
          render: (h, params) => {
            return h("span", {}, [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    row: params.row,
                    size: "small"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.edit(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定要删除同城配送模板吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.del(params.row);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small"
                      },
                      style: {
                        margin: "0 5px 0 0"
                      }
                    },
                    "删除"
                  )
                ]
              )
            ]);
          }
        }
      ],
      deliveryData: []
    };
  },
  methods: {
    edit(row) {},
    del(row) {},
    add() {
      this.$router.push({
        name: "deliveryadd"
      });
    },
    setDefaultProductDelivery(index) {
      var deliveryData = this.deliveryData[index];
      this.productDeliveryUuid = deliveryData.productDeliveryUuid;
      var actionType = deliveryData.default ? "UNDEFAULT" : "DEFAULT";
      this.changeProductDelivery(actionType);
    },
    setEnableProductDelivery(index) {
      var deliveryData = this.deliveryData[index];
      this.productDeliveryUuid = deliveryData.productDeliveryUuid;
      var actionType = deliveryData.active ? "DISABLE" : "ENABLE";
      this.changeProductDelivery(actionType);
    },
    changeProductDelivery(actionType) {
      var options = {
        actionType: actionType,
        productDeliveryUuid: this.productDeliveryUuid
      };
      this.loading = true;
      this.$http
        .post("/merchant/changeProductDelivery", this.common.request(options))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var title = "";
              if (actionType === "DEFAULT") title = "已将同城配送模板设为默认";
              if (actionType === "UNDEFAULT") title = "已取消默认同城配送模板";
              if (actionType === "ENABLE") title = "已启用同城配送模板";
              if (actionType === "DISABLE") title = "已禁用同城配送模板";
              this.$Notice.success({
                title: title,
                duration: 2
              });
              this.initData();
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.replyLoading = false;
            this.$Message.error("发生错误，请稍后重试");
          }
        );
    },
    initData() {
      var options = {
        merchantDTO: {
          merchantUuid: this.common.getObject('MERCHANTUUID')
        }
      };
      this.loading = true;
      this.$http
        .post("/merchant/inquiryProductDelivery", this.common.request(options))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.deliveryData = data.deliverys;
            } else {
            }
          },
          response => {
            this.loading = false;
          }
        );
    },
    edit(delivery) {
      this.$router.push({
        name: "deliveryedit",
        query: {
          productDeliveryUuid: delivery.productDeliveryUuid
        }
      });
    },
    del(delivery) {
      var options = {
        actionType: "DELETE",
        productDeliveryUuid: delivery.productDeliveryUuid
      };
      this.$http
        .post("/merchant/changeProductDelivery", this.common.request(options))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.$Notice.success({
                title: "成功",
                desc: "同城配送模板已删除",
                duration: 2
              });
              this.initData();
            } else {
              this.$Message.error(response.data.body.status.errorDesc);
            }
          },
          response => {
            this.loading = false;
          }
        );
    }
  },
  created() {
    this.initData();
  }
};
</script>
