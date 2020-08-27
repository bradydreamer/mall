<style lang="less">
    @import './registerMerchantResult.less';
</style>

<template>
    <div class="register-result">
        
        <div class="register-result-con">
            <Card :bordered="false">
                <div>
                    <Row>
                        <Col span="24" style="text-align:center;font-size:30px">
                            <i class="ivu-icon ivu-icon-checkmark-circled" style="color:green"></i>&nbsp;&nbsp;&nbsp;入驻申请已提交, 待审核!
                        </Col>
                    </Row>
                </div>
                <div class="form-con">
                    <Row style="padding-bottom:15px">
                        <Col span="3" offset="5" class="label">
                            商家名称: 
                        </Col>
                        <Col span="14" offset="2" class="value" >
                            {{merchant.merchantName}}
                        </Col>
                    </Row>
                    <Row style="padding-bottom:15px">
                        <Col span="3" offset="5" class="label">
                            联系人: 
                        </Col>
                        <Col span="14" offset="2" class="value" >
                             {{merchant.contactName}}
                        </Col>
                    </Row>
                    <Row style="padding-bottom:15px">
                        <Col span="3" offset="5" class="label">
                            联系电话: 
                        </Col>
                        <Col span="14" offset="2" class="value" >
                            {{merchant.mobileNo}}
                        </Col>
                    </Row>
                    <Row style="padding-bottom:15px">
                        <Col span="3" offset="5" class="label">
                            商家地址: 
                        </Col>
                        <Col span="14" offset="2" class="value" >
                            {{merchant.merchantAddress}}
                        </Col>
                    </Row>
                    <Row style="padding-bottom:15px">
                        <Col span="14" offset="10" style="color:orange">
                            审核结果将以短信通知发送给你, 请注意查收!
                        </Col>
                    </Row>
                </div>
                <div>
                    <Button type="primary" long @click="goLogin">确认</Button>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    data () {
        return {
            merchant: {},
        };
    },
    methods: {
        goLogin(){
            this.$router.push({
                            name: 'login'
                        });
        },
        //查询商家
        inquiryMerchant () {
            var options={
                "mobileNo":this.mobileNo
            }
            this.loading = true;
            this.$http.post("/public/inquiryMerchantApplication", this.common.request(options))  
            .then(response => {
                this.loading = false;
                if(response.data.body.status.statusCode==0){
                    let data = response.data.body.data;
                    if(data.applications.length>0){
                        this.merchant = data.applications[0];
                    }
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error('出错了, 请稍后再试');
            })
        }
    },
    created () {
        this.mobileNo =this.$route.query.mobileNo;
        this.inquiryMerchant();
    }
};
</script>

<style>

</style>
