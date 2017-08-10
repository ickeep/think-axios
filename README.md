# think-axios

### Install

``` js
# npm
npm install --save think-axios
``` 

``` js
# yarn
yarn add think-axios
``` 

### Use
引入
``` js
// config/extend.js
const axios = require('think-axios')
module.exports = [
  model(think.app),
  axios(think.app,conf={})
]
``` 
使用
``` js
this.axios() 
this.httpGet()
this.httpPost()

think.axios() 
think.httpGet()
think.httpPost()

ctx.axios() 
ctx.httpGet()
ctx.httpPost()

service.axios() 
service.httpGet()
service.httpPost()

``` 

其他  axios  与 https://github.com/mzabriskie/axios 方法一致

httpGet , httpPost  经过简单封装,并且请求出错时，会打印log

``` js

const indexData = await this.httpGet(url, params, conf)
const indexData = await this.httpPost(url, params, conf)

``` 
返回数据格式
``` js

// 成功
{"errno":0,"errmsg":"","data":""}

// 失败
{"errno":0,"errmsg":"","data":""}

``` 