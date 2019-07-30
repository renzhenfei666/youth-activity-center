// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import api from './request/api'
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../static/css/icon.css';
import './components/common/directives';
import "babel-polyfill";

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.api = api
/*日期格式化过滤器 */
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)

})
Vue.prototype.moment = moment
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
