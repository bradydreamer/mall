<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    创创猫-B2B2C商城商家端
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="mobileNo">
                            <Input class="login-input" v-model="form.mobileNo" placeholder="商家手机号码">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input class="login-input" type="password" v-model="form.password" placeholder="密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" :loading="loading" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
                <div>
                    <a style="color:red;float: right;"  @click="mima">找回密码</a>
                    <a @click="registerMerchant">商家入驻</a>
                </div>
            </Card>
            <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
                <h3 slot="header" style="color:#2D8CF0">找回密码</h3>
                <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                    <FormItem label="手机号：" prop="phone" >
                        <Input style="width:73%"  v-model="editPasswordForm.phone" placeholder="请输入手机号" ></Input>
                        <Button :disabled="isdisabled" style="width:24%" type="primary" @click.native="daojishi()">{{Primary}}</Button>
                    </FormItem>
                    <FormItem label="验证码：" prop="Verification">
                        <Input  v-model="editPasswordForm.Verification" placeholder="请输入验证码" ></Input>
                    </FormItem>
                    <FormItem  style="display: none;" >
                        <Input style="width:73%"  placeholder="这是拦截" ></Input>
                    </FormItem>
                    <FormItem label="新密码：" prop="newPass">
                        <Input type="password"  v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" ></Input>
                    </FormItem>
                    <FormItem label="确认新密码：" prop="rePass">
                        <Input type="password" @on-blur="onblur()" v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" ></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="text" @click="cancelEditPass">取消</Button>
                    <Button type="primary" :loading="savePassLoading" @click="saveEditPass">提交</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import {validatePhone} from '../common/test'
export default {
    data () {
        return {
            editPasswordForm:{},
            savePassLoading:false,
            editPasswordModal:false,
            loading:false,
            setInterval:'',
            isdisabled:false,
            functionList:[],
            Primary:"获取验证码",
            form: {
                mobileNo: '',
                password: ''
            },
            rules: {
                mobileNo: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            },
            passwordValidate: {
                phone: [
                    { required: true, message: '请输入11位手机号', trigger: 'blur' },{validator:validatePhone,trigger:'blur'}
                ],
                Verification:[
                     { required: true, message: '请输入6位验证码', trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                rePass: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ]
            },
        };
    },
    returnButton () {
    let vm = this;
    $(document).ready(function () {
        window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
        window.history.forward(1);
    });
},
    methods: {
        registerMerchant(){
            this.$router.push({
                        name: 'registerMerchant'
                    });
        },
        mima(){
            this.editPasswordForm = {};
            this.editPasswordModal = true
        },
        cancelEditPass(){
             this.editPasswordModal = false;
             this.Primary="获取验证码";
            clearInterval(this.setInterval);
            this.isdisabled = false;
        },
        onblur(){
            let editPasswordForm = this.editPasswordForm;
            if (editPasswordForm.newPass !== editPasswordForm.rePass) {
                this.$Message.error('两次密码输入不一致');
                return false;
            }
        },
        saveEditPass(){
            this.$refs['editPasswordForm'].validate((valid) => {
                    if (valid) {
                        let editPasswordForm = this.editPasswordForm;
                        if (editPasswordForm.newPass !== editPasswordForm.rePass) {
                            this.$Message.error('两次密码输入不一致');
                            return false;
                        }
                        let searchOptions = {
                            verificationCode:editPasswordForm.Verification,
                            mobileNo:editPasswordForm.phone,
                            newPassword:editPasswordForm.newPass
                        }
                        this.savePassLoading = true;
                        this.$http.post("/merchant/forgetPassword", this.common.request(searchOptions))  
                        .then(response => {
                            this.savePassLoading = false;
                            if(response.data.body.status.statusCode==0){
                                this.$Notice.success({
                                    desc: '密码修改成功、请重新登陆',
                                    duration: 2
                                });
                                this.Primary="获取验证码";
                                clearInterval(this.setInterval);
                                this.isdisabled = false;
                                this.editPasswordModal = false;
                            }else{
                                this.$Message.error(response.data.body.status.errorDesc);
                            }
                        }, response => { 
                            this.savePassLoading = false; 
                            this.$Message.error(response.data.body.status.errorDesc);
                        });
                    } 
                })
        },
        daojishi(){
            var phone = this.editPasswordForm.phone;
            var myreg=/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[189])\d{8}$/;
            if (!myreg.test(phone)) {
                this.$Message.error('请输入正确手机号！');
                return false;
            }
            this.isdisabled = true;
            let searchOptions = {
                 type:"MOBILE",
                mobileNo:phone,
                mobileCountryCode:"86"
            }
            this.$http.post("/sendVerificationCode", this.common.request(searchOptions))  
            .then(response => {
                if(response.data.body.status.statusCode==0){
                    this.$Notice.success({
						desc: '已发送验证码、请注意查看',
						duration: 2
                    });
                }else{
                    this.$Message.error(response.data.body.status.errorDesc);
                }
            }, response => {  
                this.$Message.error(response.data.body.status.errorDesc);
            });
            let Primary = 1;
            this.Primary = '0'+Primary+'秒';
            Primary++;
            this.setInterval = setInterval(() =>{ 
                if (Primary<=9) {
                    this.Primary = '0'+Primary+' '+'秒';
                    Primary++;
                }else if(Primary<=59&&Primary>=10){
                    this.Primary = Primary+' '+'秒';
                    Primary++;
                }else{
                    this.Primary="获取验证码";
                    clearInterval(this.setInterval);
                    this.isdisabled = false;
                }
            }, 1000);
        },
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    var options={
                        "mobileNo":this.form.mobileNo,
                        "password":this.form.password
                    }
                    this.$http.post("/merchant/login", this.common.request(options))  
                    .then(response => {
                        this.loading = false;
                        if(response.data.body.status.statusCode==0){
                            let data = response.data.body.data;
                            this.common.setObject('MERCHANTTOKEN',response.data.header.tokenId);
                            this.common.setObject('MERCHANTID',this.form.mobileNo);
                            this.common.setObject('MERCHANTUUID',data.merchantUuid);
                            Cookies.set('user', this.form.mobileNo);
                            Cookies.set('merchantName', data.merchantName);
                            Cookies.set('password', this.form.password);
                            localStorage.setItem("name",this.form.mobileNo);
                            this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                            if (this.form.mobileNo === 'iview_admin') {
                                Cookies.set('access', 0);
                            } else {
                                Cookies.set('access', 1);
                            }  
                            this.$router.push({
                                    name: 'home_index'
                                });
                        }else{
                            this.$Message.error(response.data.body.status.errorDesc);
                        }
                    }, response => {  
                        this.loading = false;
                        this.$Message.error('出错了, 请稍后重试');
                    })
                }
            });
        }
    }
};
</script>

<style>

</style>
