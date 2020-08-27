import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () =>
        import ('@/views/login.vue')
};
export const printRouter = {
    path: '/print',
    name: 'print',
    meta: {
        title: 'Print - 打印'
    },
    component: () =>
        import ('@/views/print.vue')
};
export const registerMerchantRouter = {
    path: '/registerMerchant',
    name: 'registerMerchant',
    meta: {
        title: 'Register - 商家入驻申请'
    },
    component: () =>
        import ('@/views/registerMerchant.vue')
};
export const registerMerchantResultRouter = {
    path: '/registerMerchantResult',
    name: 'registerMerchantResult',
    meta: {
        title: 'Register - 商家入驻申请'
    },
    component: () =>
        import ('@/views/registerMerchantResult.vue')
};
export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () =>
        import ('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () =>
        import ('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () =>
        import ('@/views/error-page/500.vue')
};


export const locking = {
    path: '/locking',
    name: 'locking',
    component: () =>
        import ('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [{
            path: 'home',
            title: {
                i18n: 'home'
            },
            name: 'home_index',
            component: () =>
                import ('@/views/home/home.vue')
        },
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: () =>
                import ('@/views/own-space/own-space.vue')
        },
        {
            path: 'shopping',
            title: '购物详情',
            name: 'shopping',
            component: () =>
                import ('@/views/advanced-router/component/shopping-info.vue')
        }, // 用于展示带参路由
        {
            path: 'message',
            title: '消息中心',
            name: 'message_index',
            component: () =>
                import ('@/views/message/message.vue')
        },
        {
            path: 'memberedit/:memberCardNo',
            name: 'memberedit',
            title: '会员编辑',
            component: () =>
                import ('@/views/member/member-add.vue')
        },
        {
            path: 'memberdetail',
            name: 'memberdetail',
            title: '会员详情',
            component: () =>
                import ('@/views/member/member-detail.vue')
        },
        {
            path: 'merchantedit/:merchantId',
            name: 'merchantedit',
            title: '商户编辑',
            component: () =>
                import ('@/views/merchant/merchant-add.vue')
        },
        {
            path: 'couponedit/:couponName',
            name: 'couponedit',
            title: '编辑优惠券',
            component: () =>
                import ('@/views/marketing/coupon-add.vue')
        },
        {
            path: 'couponadd',
            name: 'couponadd',
            title: '新增优惠券',
            component: () =>
                import ('@/views/marketing/coupon-add.vue')
        },
        {
            path: 'productgroupadd',
            name: 'productgroupadd',
            title: '新增商品组',
            component: () =>
                import ('@/views/product/product-group-add.vue')
        },
        {
            path: 'productgroupedit',
            name: 'productgroupedit',
            title: '编辑商品组',
            component: () =>
                import ('@/views/product/product-group-add.vue')
        },
        {
            path: 'adadd',
            name: 'adadd',
            title: '新增广告',
            component: () =>
                import ('@/views/marketing/ad-add.vue')
        },
        {
            path: 'adedit',
            name: 'adedit',
            title: '编辑广告',
            component: () =>
                import ('@/views/marketing/ad-add.vue')
        },
        {
            path: 'coupondata',
            name: 'coupondata',
            title: '优惠券领取详情',
            component: () =>
                import ('@/views/marketing/coupon-data.vue')
        },
        {
            path: 'groupbuydata',
            name: 'groupbuydata',
            title: '拼团单',
            component: () =>
                import ('@/views/marketing/groupbuy-data.vue')
        },
        {
            path: 'groupbuyuser',
            name: 'groupbuyuser',
            title: '拼团订单',
            component: () =>
                import ('@/views/marketing/groupbuy-user.vue')
        },
        {
            path: 'seckilladd',
            name: 'seckilladd',
            title: '新增秒杀活动',
            component: () =>
                import ('@/views/marketing/seckill-add.vue')
        },
        {
            path: 'seckilledit',
            name: 'seckilledit',
            title: '编辑秒杀活动',
            component: () =>
                import ('@/views/marketing/seckill-add.vue')
        },
        {
            path: 'groupbuyadd',
            name: 'groupbuyadd',
            title: '新增团购活动',
            component: () =>
                import ('@/views/marketing/groupbuy-add.vue')
        },
        {
            path: 'groupbuyedit',
            name: 'groupbuyedit',
            title: '编辑秒团购活动',
            component: () =>
                import ('@/views/marketing/groupbuy-add.vue')
        },
        {
            path: 'activityadd',
            name: 'activityadd',
            title: '新增营销活动',
            component: () =>
                import ('@/views/marketing/activity-add.vue')
        },
        {
            path: 'activityedit',
            name: 'activityedit',
            title: '编辑营销活动',
            component: () =>
                import ('@/views/marketing/activity-add.vue')
        },
        {
            path: 'activitydata',
            name: 'activitydata',
            title: '营销活动数据',
            component: () =>
                import ('@/views/marketing/activity-data.vue')
        },
        {
            path: 'productadd',
            name: 'productadd',
            title: '录入商品',
            component: () =>
                import ('@/views/product/product-add.vue')
        },
        {
            path: 'productedit',
            name: 'productedit',
            title: '编辑商品',
            component: () =>
                import ('@/views/product/product-edit.vue')
        },
        {
            path: 'shippingedit',
            name: 'shippingedit',
            title: '编辑运费模板',
            component: () =>
                import ('@/views/product/shipping-add.vue')
        },
        {
            path: 'shippingadd',
            name: 'shippingadd',
            title: '新增运费模板',
            component: () =>
                import ('@/views/product/shipping-add.vue')
        },
        {
            path: 'deliveryedit',
            name: 'deliveryedit',
            title: '编辑同城配送模板',
            component: () =>
                import ('@/views/product/delivery-add.vue')
        },
        {
            path: 'deliveryadd',
            name: 'deliveryadd',
            title: '新增同城配送模板',
            component: () =>
                import ('@/views/product/delivery-add.vue')
        },
        {
            path: 'shopperedit',
            name: 'shopperedit',
            title: '编辑同城配送人员',
            component: () =>
                import ('@/views/product/shopper-add.vue')
        },
        {
            path: 'shopperadd',
            name: 'shopperadd',
            title: '新增同城配送人员',
            component: () =>
                import ('@/views/product/shopper-add.vue')
        },
        {
            path: 'orderdetail',
            name: 'orderdetail',
            title: '订单详情',
            component: () =>
                import ('@/views/order/order-detail.vue')
        },
        {
            path: 'ordercourier',
            name: 'ordercourier',
            title: '物流详情',
            component: () =>
                import ('@/views/order/order-courier.vue')
        },
        {
            path: 'stationdetail',
            name: 'stationdetail',
            title: '驿站详情',
            component: () =>
                import ('@/views/station/station-detail.vue')
        },
        {
            path: 'stationachievement',
            name: 'stationachievement',
            title: '驿站业绩',
            component: () =>
                import ('@/views/station/station-achievement.vue')
        },
        {
            path: 'articleadd',
            name: 'articleadd',
            title: '发布文案',
            component: () =>
                import ('@/views/content/article-add.vue')
        },
        {
            path: 'articleedit',
            name: 'articleedit',
            title: '修改文案',
            component: () =>
                import ('@/views/content/article-add.vue')
        },
        {
            path: 'articlepreview',
            name: 'articlepreview',
            title: '预览文案',
            component: () =>
                import ('@/views/content/article-preview.vue')
        },
        {
            path: 'audioadd',
            name: 'audioadd',
            title: '发布课程',
            component: () =>
                import ('@/views/content/audio-add.vue')
        },
        {
            path: 'audiopreview',
            name: 'audiopreview',
            title: '预览课程',
            component: () =>
                import ('@/views/content/audio-preview.vue')
        },
        {
            path: 'vedioadd',
            name: 'vedioadd',
            title: '发布视频',
            component: () =>
                import ('@/views/content/vedio-add.vue')
        },
        {
            path: 'vediopreview',
            name: 'vediopreview',
            title: '预览视频',
            component: () =>
                import ('@/views/content/vedio-preview.vue')
        },
        {
            path: 'swiperedit',
            name: 'swiperedit',
            title: '轮播图链接内容',
            component: () =>
                import ('@/views/marketing/swiper-edit.vue')
        },
        {
            path: 'qaadd',
            name: 'qaadd',
            title: '发布问答',
            component: () =>
                import ('@/views/content/qa-add.vue')
        },
        {
            path: 'qaedit',
            name: 'qaedit',
            title: '修改问答',
            component: () =>
                import ('@/views/content/qa-add.vue')
        },
        {
            path: 'qapreview',
            name: 'qapreview',
            title: '预览问题',
            component: () =>
                import ('@/views/content/qa-preview.vue')
        },
        {
            path: 'announcementadd',
            name: 'announcementadd',
            title: '发布通知',
            component: () =>
                import ('@/views/content/announcement-add.vue')
        },
        {
            path: 'announcementedit',
            name: 'announcementedit',
            title: '修改通知',
            component: () =>
                import ('@/views/content/announcement-add.vue')
        },
        {
            path: 'noticeadd',
            name: 'noticeadd',
            title: '发布通知',
            component: () =>
                import ('@/views/content/notice-add.vue')
        },
        {
            path: 'noticeedit',
            name: 'noticeedit',
            title: '发布通知',
            component: () =>
                import ('@/views/content/notice-add.vue')
        },
        {
            path: 'fundaccountedit/:accountNo',
            name: 'fundaccountedit',
            title: '编辑资金账户',
            component: () =>
                import ('@/views/fund/fund-account-add.vue')
        },
        {
            path: 'trainerdetail',
            name: 'trainerdetail',
            title: '培训导师详情',
            component: () =>
                import ('@/views/member/trainer-detail.vue')
        },

    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [{
        path: '/member',
        icon: 'person',
        name: 'member',
        title: '会员',
        component: Main,
        children: [{
            path: 'memberlist',
            name: 'memberlist',
            title: '会员',
            component: () =>
                import ('@/views/member/member-list.vue')
        }]
    },
    {
        path: '/product',
        icon: 'pricetag',
        name: 'product',
        title: '商品',
        component: Main,
        children: [{
            path: 'productinsale',
            name: 'productinsale',
            title: '商品管理',
            component: () =>
                import ('@/views/product/product-list-insale.vue')
        }, {
            path: 'productgroup',
            name: 'productgroup',
            title: '商品组',
            component: () =>
                import ('@/views/product/product-group-list.vue')
        }, {
            path: 'comment',
            name: 'comment',
            title: '商品评论',
            component: () =>
                import ('@/views/product/comment-list.vue')
        }, {
            path: 'shippinglist',
            name: 'shippinglist',
            title: '运费模板',
            component: () =>
                import ('@/views/product/shipping-list.vue')
        }]
    }, {
        path: '/delivery',
        icon: 'navigate',
        name: 'delivery',
        title: '同城配送',
        component: Main,
        children: [{
            path: 'deliverylist',
            name: 'deliverylist',
            title: '收费模板',
            component: () =>
                import ('@/views/product/delivery-list.vue')
        }, {
            path: 'shopperlist',
            name: 'shopperlist',
            title: '配送人员',
            component: () =>
                import ('@/views/product/shopper-list.vue')
        }]
    }, {
        path: '/order',
        icon: 'ios-list',
        name: 'order',
        title: '订单',
        component: Main,
        children: [{
                path: 'orderlist',
                name: 'orderlist',
                title: '订单查询',
                component: () =>
                    import ('@/views/order/order-list.vue')
            },
            {
                path: 'aftersalelist',
                name: 'aftersalelist',
                title: '售后退款',
                component: () =>
                    import ('@/views/order/order-aftersale-list.vue')
            },
            {
                path: 'orderprintsetting',
                name: 'orderprintsetting',
                title: '打印设置',
                component: () =>
                    import ('@/views/order/order-print-setting.vue')
            }
        ]
    }, {
        path: '/fund',
        icon: 'social-yen',
        name: 'fund',
        title: '资金',
        component: Main,
        children: [{
            path: 'fundstatement',
            name: 'fundstatement',
            title: '资金明细',
            component: () =>
                import ('@/views/fund/fund-statement.vue')
        }, {
            path: 'fundwithdrawapplication',
            name: 'fundwithdrawapplication',
            title: '申请提现',
            component: () =>
                import ('@/views/fund/fund-withdraw-application.vue')
        }, {
            path: 'fundwithdraw',
            name: 'fundwithdraw',
            title: '提现记录',
            component: () =>
                import ('@/views/fund/fund-withdraw.vue')
        }]
    }, {
        path: '/marketing',
        icon: 'playstation',
        name: 'marketing',
        title: '营销推广',
        component: Main,
        children: [{
                path: 'couponlist',
                name: 'couponlist',
                title: '优惠券',
                component: () =>
                    import ('@/views/marketing/coupon-list.vue')
            },
            {
                path: 'seckillproduct',
                name: 'seckillproduct',
                title: '秒杀活动',
                component: () =>
                    import ('@/views/marketing/seckill-list.vue')
            },
            {
                path: 'groupbuyproduct',
                name: 'groupbuyproduct',
                title: '团购活动',
                component: () =>
                    import ('@/views/marketing/groupbuy-list.vue')
            }
        ]
    }, {
        path: '/analysis',
        icon: 'stats-bars',
        name: 'analysis',
        title: '统计分析',
        component: Main,
        children: [{
            path: 'operation',
            name: 'operation',
            title: '运营数据',
            component: () =>
                import ('@/views/analysis/analysis.vue')
        }]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    registerMerchantRouter,
    registerMerchantResultRouter,
    printRouter,
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];