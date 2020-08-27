import Vue from 'vue';
import iView from 'iview';
import VuePreview from 'vue-preview'
import { router } from './router/index';
import { appRouter } from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import util from './libs/util';
import echarts from 'echarts';
import axios from 'axios';
import common from '@/common/common.js'
import dateutil from '@/common/dateutil.js'
import stringutil from '@/common/stringutil.js'
import VueClipboard from 'vue-clipboard2'
axios.defaults.baseURL = 'https://b2b2c.ccmao.net/b2b2c/rest/';

Vue.prototype.$echarts = echarts
Vue.prototype.$http = axios
Vue.prototype.common = common;
Vue.prototype.dateutil = dateutil;
Vue.prototype.stringutil = stringutil;

Vue.use(VueI18n);
Vue.use(iView);
Vue.use(VuePreview);
Vue.use(VueClipboard);

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        index: 10,
        currentPageName: ''
    },
    methods: {
        inquiryExchangeRate() {
            let searchOptions = {
                'mobileNo': this.mobileNo
            }
            this.$http.post("/merchant/inquiryMerchant", this.common.request(searchOptions))
                .then(response => {
                    if (response.data.body.status.statusCode == 0) {
                        var data = response.data.body.data;
                        if (data.closed) {
                            this.$router.push({
                                name: "login"
                            });
                        }
                    } else {
                        this.$Message.error(response.data.body.status.errorDesc);
                    }
                }, response => {
                    this.$Message.error(response.data.body.status.errorDesc);
                })
        },
    },
    mounted() {
        var that = this;
        this.mobileNo = localStorage["name"];
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    },
    created() {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});