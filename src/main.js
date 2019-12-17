import Vue from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.min'

import 'vue-layer/lib/vue-layer.css'
import layer from 'vue-layer'


Vue.prototype.$layer = layer(Vue);

Vue.config.productionTip = false


new Vue({
    render: h => h(App),
}).$mount('#app')