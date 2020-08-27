<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">同城配送人员</p>
          <Row>
            <Button icon="plus" type="primary" @click="add()">添加同城配送人员</Button>
          </Row>

          <Row class="margin-top-10">
            <Col span="24">
              <div>
                <Table
                  :columns="shopperColumn"
                  :data="shopperData"
                  :loading="loading"
                  border
                  stripe
                  ref="shopperTable"
                ></Table>
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal title="图片预览" v-model="showPreviewImage">
				<img :src="previewImageUrl" v-if="showPreviewImage" style="width: 100%" />
				<div slot="footer">
					<Button type="default" @click="showPreviewImage = false">关闭</Button>
				</div>
			</Modal>
  </div>
</template>

<script>

export default {
  components: {
    
  },
  data() {
    return {
      loading: false,
      showPreviewImage: false, //预览照片模态框
			previewImageUrl: '', //预览照片地址
      shopperColumn: [
        {
          title: "头像",
          align: "center",
          width: 150,
          render: (h, params) => {
							return h(
								"span", {
									props: {
										row: params.row
									}
								},
								[
									h("img", {
										attrs: {
											src: params.row.photo
										},
										style: {
											width: "60px",
											height: "60px",
											margin: "5px 0"
										},
										on: {
											click: () => {
												this.previewPhotoImage(params.row.photo)
											}
										}
									})
								]
							);
						}
        },
        {
          title: "姓名",
          align: "center",
          width: 250,
          key: "name"
        },
        {
          title: "性别",
          align: "center",
          width: 120,
          key: "sex"
        },
        {
          title: "手机号码",
          align: "center",
          width: 120,
          key: "mobileNo"
        },
        {
          title: "是否启用",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h("i-switch", {
              props: {
                type: "primary",
                value: params.row.enabled //控制开关的打开或关闭状态，官网文档属性是value
              },
              style: {
                marginRight: "5px"
              },
              on: {
                "on-change": value => {
                  this.setEnableMerchantShopper(params.index); //params.index是拿到table的行序列，可以取到对应的表格值
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
                    title: "您确定要删除同城配送人员吗?",
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
      shopperData: []
    };
  },
  methods: {
    //预览照片
    previewPhotoImage(url) {
      this.showPreviewImage = true;
      this.previewImageUrl = url;
    },
    edit(row) {

    },
    del(row) {

    },
    add() {
      this.$router.push({
        name: "shopperadd"
      });
    },
    setEnableMerchantShopper(index) {
      var shopperData = this.shopperData[index];
      this.merchantShopperUuid = shopperData.merchantShopperUuid;
      var actionType = shopperData.enabled ? "DISABLE" : "ENABLE";
      this.changeMerchantShopper(actionType);
    },
    changeMerchantShopper(actionType) {
      var options = {
        actionType: actionType,
        merchantShopperUuid: this.merchantShopperUuid
      };
      this.loading = true;
      this.$http
        .post("/merchant/changeMerchantShopper", this.common.request(options))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var title = "";
              if (actionType === "ENABLE") title = "已启用同城配送人员";
              if (actionType === "DISABLE") title = "已禁用同城配送人员";
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
          merchantDTO:{
            merchantUuid: this.common.getObject('MERCHANTUUID')
          }
      };
      this.loading = true;
      this.$http
        .post("/merchant/inquiryMerchantShopper", this.common.request(options))
        .then(
          response => {
            this.loading = false;
            if (response.data.body.status.statusCode == 0) {
              var data = response.data.body.data;
              this.shopperData = data.shoppers;
            } else {
            }
          },
          response => {
            this.loading = false;
          }
        );
    },
    edit(shopper) {
      this.$router.push({
        name: "shopperedit",
        query: {
          merchantShopperUuid: shopper.merchantShopperUuid
        }
      });
    },
    del(shopper) {
      var options = {
        actionType: "DELETE",
        merchantShopperUuid: shopper.merchantShopperUuid
      };
      this.$http
        .post("/merchant/changeMerchantShopper", this.common.request(options))
        .then(
          response => {
            if (response.data.body.status.statusCode == 0) {
              this.$Notice.success({
                title: "成功",
                desc: "同城配送人员已删除",
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
