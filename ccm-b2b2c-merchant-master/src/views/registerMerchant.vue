<style lang="less">
@import "./registerMerchant.less";
</style>

<template>
  <div class="register" @keydown.enter="handleSubmit">
    <div class="register-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>创创猫B2B2C商城 - 商家入驻申请
        </p>
        <div class="form-con">
          <Form ref="registerForm" :model="form" :rules="rules">
            <FormItem prop="merchantName">
              <Input class="register-input" v-model="form.merchantName" placeholder="商家名称">
                <span slot="prepend">
                  <Icon :size="16" type="outlet"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="contactName">
              <Input class="register-input" v-model="form.contactName" placeholder="联系人">
                <span slot="prepend">
                  <Icon :size="16" type="person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="mobileNo">
              <Input class="register-input" v-model="form.mobileNo" placeholder="联系电话">
                <span slot="prepend">
                  <Icon :size="16" type="iphone"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="merchantAddress">
              <Input
                class="register-input"
                readonly
                v-model="form.merchantAddress"
                style="width:88%;float: left;"
                placeholder="商家地址"
              >
                <span slot="prepend" style="width: 30px">
                  <Icon :size="16" type="ios-location"></Icon>
                </span>
              </Input>
              <Button
                icon="location"
                type="default"
                size="small"
                style="margin-left:1%;width: 10%;font-size: 18px;"
                @click="openMap"
              >地图</Button>
            </FormItem>
            <FormItem>
              <Button :loading="loading" size="large" @click="handleSubmit" type="primary" long>确认入驻</Button>
            </FormItem>
          </Form>
        </div>
        <div>
          <a @click="login">商家登录</a>
        </div>
      </Card>
    </div>
    <Modal :closable="false" :mask-closable="false" v-model="mapModal" width="800px" title="商家地址">
      <div class="mymapM">
        <!--捜索
    <div v-if="loading" class="loading">
      <van-loading type="spinner" />
    </div>
        -->
        <div class="search-box">
          <div class="search-postion">
            <input type="text" placeholder="输入关键字搜索" v-model="search_key" />
            <span class="clear" v-if="search_key" @click="search_key ='' ">
              <!--<van-icon color="#8f8f8f" name="clear" />-->
            </span>
            <Button type="primary" @click="keySearch">捜索</Button>
          </div>
        </div>
        <div class="con-box con-map" v-if="!search_key">
          <!--地图-->
          <div class="mapbox">
            <div class="map" id="container"></div>
            <div class="sign"></div>
          </div>
        </div>
        <div class="con-box" v-if="!search_key">
          <!--地址列表-->
          <div class="Hlist-box">
            <ul>
              <li v-for="(item, index) in lists" :key="index" @click="onAddressLi(item)">
                <b>
                  <!--<van-icon color="#a6a6a6" name="clock" />-->
                </b>
                <div>
                  <span>{{item.name}}</span>
                  <p>{{item.address}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!--捜索列表-->
        <div class="search-list" v-if="search_key">
          <ul>
            <li
              v-for="(item, index) in search_list"
              :key="index"
              @click="onSearchLi(item.location)"
            >
              <span>{{item.name}}</span>
              <p>{{item.address}}</p>
            </li>
            <li v-if="noSearchShow">
              <p>暂无搜索结果</p>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import QRCode from "qrcodejs2";
export default {
  data() {
    const validateMobileNo = (rule, value, callback) => {
      if (!/^1[2345789]\d{9}$/.test(value)) {
        callback("联系电话格式错误");
      } else {
        callback();
      }
    };
    return {
      loading: false,
      mapModal: false,
      search_key: "", //搜索值
      lists: [], //地点列表
      search_list: [], //搜索结果列表
      marker: "",
      map: null,
      noSearchShow: false, //无搜索结果提示，无搜索结果时会显示暂无搜索结果,
      form: {
        merchantName: "",
        contactName: "",
        mobileNo: "",
        merchantAddress: ""
      },

      rules: {
        merchantName: [
          { required: true, message: "商家名称不能为空", trigger: "blur" }
        ],
        contactName: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        mobileNo: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
          { validator: validateMobileNo, trigger: "blur" }
        ],
        merchantAddress: [
          { required: true, message: "商家地址不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$router.push({
        name: "login"
      });
    },
    openMap(value) {
      this.mapModal = true;
    },
    closeMap() {
      this.mapModal = false;
    },
    adMap() {
      this.loading = true;
      //初始化地图
      this.map = new AMap.Map("container", {
        zoom: 14, //缩放级别
        center: this.center //设置地图中心点
        //resizeEnable: true,  //地图初始化加载定位到当前城市
      });
      //获取初始中心点并赋值
      var currentCenter = this.map.getCenter(); //此方法是获取当前地图的中心点
      this.center = [currentCenter.lng, currentCenter.lat]; //将获取到的中心点的纬度经度赋值给data的center
      console.log(this.center);

      //创建标记
      this.marker = new AMap.Marker({
        position: new AMap.LngLat(currentCenter.lng, currentCenter.lat) // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      });
      // 将创建的点标记添加到已有的地图实例：
      this.map.add(this.marker);

      //根据地图中心点查附近地点，此方法在下方
      this.centerSearch();
      //监听地图移动事件，并在移动结束后获取地图中心点并更新地点列表
      var moveendFun = e => {
        // 获取地图中心点
        currentCenter = this.map.getCenter();
        this.center = [currentCenter.lng, currentCenter.lat];
        this.marker.setPosition([currentCenter.lng, currentCenter.lat]); //更新标记的位置
        //根据地图中心点查附近地点
      };
      //更新数据
      var centerSearch = () => {
        this.loading = true;
        this.centerSearch();
      };

      // 绑定事件移动地图事件
      this.map.on("mapmove", moveendFun); //更新标记
      this.map.on("moveend", centerSearch); //更新数据
    },
    centerSearch() {
      AMap.service(["AMap.PlaceSearch"], () => {
        //构造地点查询类
        var placeSearch = new AMap.PlaceSearch({
          type:
            "汽车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|地名地址信息", // 兴趣点类别
          pageSize: 30, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: "全国", // 兴趣点城市
          autoFitView: false // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
        //根据地图中心点查附近地点
        placeSearch.searchNearBy(
          "",
          [this.center[0], this.center[1]],
          200,
          (status, result) => {
            if (status == "complete") {
              this.lists = result.poiList.pois; //将查询到的地点赋值
              this.loading = false;
            }
          }
        );
      });
    },
    keySearch() {
      this.loading = true;
      AMap.service(["AMap.PlaceSearch"], () => {
        //构造地点查询类
        var placeSearch = new AMap.PlaceSearch({
          type:
            "汽车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|地名地址信息", // 兴趣点类别
          pageSize: 50, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: "全国", // 兴趣点城市
          citylimit: false, //是否强制限制在设置的城市内搜索
          autoFitView: false // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
        //关键字查询
        placeSearch.search(this.search_key, (status, result) => {
          if (status == "complete") {
            if (result.poiList.count === 0) {
              this.noSearchShow = true;
            } else {
              this.search_list = result.poiList.pois; //将查询到的地点赋值
              this.noSearchShow = false;
              this.loading = false;
            }
          } else {
            this.search_list = [];
            this.noSearchShow = true;
          }
        });
      });
    },
    onAddressLi(e) {
      let that = this;
      this.mapModal = false;
      this.marker.setPosition([e.location.lng, e.location.lat]); //更新标记的位置
      this.form.longitude = e.location.lng;
      this.form.latitude = e.location.lat;
      this.form.merchantAddress = e.address;
      this.map.getCity(function(res){
        that.form.province = res.province;
        //直辖市没有city数据, 使用province
        if(res.city){
          that.form.city = res.city;
        }else{
          that.form.city = res.province;
        }
        that.form.district = res.district;
      });
    },
    onSearchLi(e) {
      console.log(e.lng + "-" + e.lat);
      this.center = [e.lng, e.lat];
      console.log(this.center);
      this.search_key = "";
      // this.loading=true;
      setTimeout(() => {
        this.adMap();
      }, 1000);
    },
    handleSubmit() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          var options = {
            merchantName: this.form.merchantName,
            contactName: this.form.contactName,
            mobileNo: this.form.mobileNo,
            province: this.form.province,
            city: this.form.city,
            district: this.form.district,
            merchantAddress: this.form.merchantAddress,
            longitude: this.form.longitude,
            latitude: this.form.latitude
          };
          this.loading = true;
          this.$http
            .post("/public/applyMerchant", this.common.request(options))
            .then(
              response => {
                this.loading = false;
                if (response.data.body.status.statusCode == 0) {
                  let data = response.data.body.data;
                  this.$router.push({
                    name: "registerMerchantResult",
                    query: { mobileNo: this.form.mobileNo }
                  });
                } else {
                  this.$Message.error(response.data.body.status.errorDesc);
                }
              },
              response => {
                this.loading = false;
                this.$Message.error("出错了, 请稍后重试");
              }
            );
        }
      });
    }
  },
  watch: {
    search_key(newv, oldv) {
      if (newv == "") {
        this.search_list = [];
        this.noSearchShow = false;
        setTimeout(() => {
          this.adMap();
        }, 1000);
      } else {
        if (newv != oldv) {
          this.keySearch();
        }
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.adMap();
    }, 1000);
  }
};
</script>

<style lang="scss" scoped>
.con-map {
  height: 290px;
  width: 100%;
}
.con-box {
  .mapbox {
    margin-bottom: 10px;
    //position: fixed;
    z-index: 111;
    width: 768px;
    height: 280px;
    padding: 10px 0;
    background: #eceeee;

    .map {
      width: 100%;
      height: 280px;
    }
  }

  .Hlist-box {
    width: 96%;
    margin: 0 auto;
    height: 300px;
    overflow-y: auto;
    background: #fff;
    border-radius: 5px;
    li {
      //height: 40px;
      padding: 14px 22px;
      border-bottom: 1px solid #d9d9d9;
      display: flex;
      b {
        display: inline-block;

        i {
          margin: 18px 18px 0 0;
        }
      }
      div {
        width: 100%;
      }
      span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 15px;
        display: inline-block;
        width: 90%;
      }
      p {
        margin-top: 10px;
        color: #a6a6a6;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 13px;
        width: 90%;
      }
    }
  }
}
.mymapM {
  .search-box {
    height: 48px;
    line-height: 48px;
    margin-bottom: 16px;
    //border-bottom: 1px solid #bfbec4;

    .search-postion {
      height: 48px;
      line-height: 48px;
      width: 768px;
      //position: fixed;
      z-index: 99999;
      display: flex;
      input {
        flex: 4;
        height: 48px;
        line-height: 48px;
        padding: 16px 0;
        border: none;
        outline: none;
        background-color: #e5e5e5;
        text-indent: 10px;
      }
      .clear {
        margin: 2px 6px;
      }
      .buts {
        width: 15%;
        text-align: center;
        display: inline-block;
        flex: 1;
      }
      .border_but {
        border-left: 1px solid #8f8f8f;
        height: 14px;
        line-height: 14px;
        margin: 17px 0;
      }
    }
  }
  .search-list {
    width: 100%;
    margin: 0 auto;
    margin-top: 10px;
    border-radius: 5px;
    background: #fff;
    li {
      //height: 40px;
      padding: 14px 0 14px 0;
      border-bottom: 1px solid #d9d9d9;
      span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 15px;
        display: inline-block;
        width: 90%;
      }
      p {
        margin-top: 10px;
        color: #a6a6a6;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 13px;
        width: 90%;
      }
    }
  }
}
</style>
