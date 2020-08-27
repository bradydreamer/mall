<style lang="less">
    @import '../styles/common.less';
</style>

<template>
    
    <div>
        <Form :label-width="120">
            <Card>
                <p slot="title">
                     赠送积分比例设置
                </p>
                <Row>
                    <Col span="6" > 
                        <FormItem label="赠送比例: ">
                            <InputNumber :min="minExchangeRate" v-model="merchant.exchangeRate" placeholder="请输入赠送比例值" ></InputNumber>%
                        </FormItem>  
                    </Col>     
                    <Col span="6" > 
                        <Button :loading="loading" type="primary" @click="updateExchangeRate()">保存</Button> 
                    </Col>              
                </Row>
                <Row>
                    <Col span="12" > 
                        <a style="color: #ff9900">示例: 如设置为50%, 则会员消费100元将获得50积分</a>
                    </Col>                  
                </Row>
            </card>
        </Form>
     </div>               
</template>

<script>
export default {
    components: {
        
    },
    data () {
        return {
            loading: false,
            mobileNo:'',
            minExchangeRate: 0,
            merchant:{}
        }
    },
    methods: {
        updateExchangeRate(){
            this.loading = true;
            let options = {
                exchangeRate:this.merchant.exchangeRate,
                mobileNo: this.mobileNo
            };
            this.$http.post("/merchant/updateExchangeRate", this.common.request(options))
			.then(response => {
				if(response.data.body.status.statusCode == 0) {
					var data = response.data.body.data;
					this.$Notice.success({
						desc: '已经成功设置积分赠送比例',
						duration: 2
                    });
                    this.loading=false;
				} else {
					this.$Message.error(response.data.body.status.errorDesc);
				}
			}, response => {
                this.$Message.error('出错了，请稍后重试');
                this.loading=false;
			})
        },
        inquiryExchangeRate () {
            let searchOptions = {
                    'mobileNo':this.mobileNo
            }
            this.$http.post("/merchant/inquiryMerchant", this.common.request(searchOptions))  
            .then(response => {
                if(response.data.body.status.statusCode==0){
                    var data = response.data.body.data;
                    this.merchant = data;
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
    mounted () {
        this.mobileNo = localStorage["name"];
        this.inquiryExchangeRate();
    },

};
</script>

