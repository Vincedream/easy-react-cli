### 弹出自定义配置
运行`npm run eject`,操作之前切记需要`git commit`
### 热加载
在`index.js`最后添加

```
if (module.hot) {
  module.hot.accept();
}
```

### 添加路由
1. 下载router包
`npm i react-router-dom  -S`
2. 在src中的config文件夹下创建`history.js`

```
import createHistory from 'history/createBrowserHistory';

export default createHistory();
```
3. 在index.js中引入

```
import { BrowserRouter, Router } from "react-router-dom";
import history from "./config/history"
```
4. 将App组件被路由所包裹

```
ReactDOM.render(
  <BrowserRouter>
    <Router history={history}>
      <App />
    </Router>
  </BrowserRouter>,
  document.getElementById("root")
);
```
5. 在container中创建Index组件，并在`app.js`中添加以下代码

```
import React, { Component } from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';

import Index from './container/index'

@withRouter
class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Index}></Route>
        </Switch>
      </div>
    );
  }
}

export default App;

```
### 封装axios配置
1. 下载必要包
`npm i axios`
2. 在config文件夹中添加`axios.js`

```
import axios from 'axios'

import { getCookie } from "../config/token"
import history from "../config/history"

const instance = axios.create({
  timeout: 5000,
  baseURL: 'http://localhost:3067'
})
instance.interceptors.request.use(
  req => {
    // const token = getCookie('token')
    // // 公共请求API,请求头不带有Authorization
    // const publicUrl = ["/signup", "/signin", "/email/validate", "/user/reset", "/temp/all" ]
    // const url = req.url
    // // 其他需要Authorization的请求
    // if (publicUrl.indexOf(url) === -1) {
    //   req.headers.Authorization = token
    //   if (!token){
    //     history.push('/login') // 当cookie中存储的token过期后自动跳转到登录页
    //   }
    // }
    return req
  },
  err => {
    throw new Error('发起请求出错')
  }
)

instance.interceptors.response.use(
  res => {
    return res
  },
  err => {
    // 本地环境错误
    if (err.message === "Network Error") {
      throw new Error( '网络环境太差，请稍后再试！')
    } else if (err.message === "timeout of 5000ms exceeded") {
      throw new Error( '请求超时，请稍后再试！')
    } else {
      throw err   // 非本地环境错误
    }
  }
)

export default instance
```


### 添加状态管理redux
1. 安装必要包
`npm i redux redux-thunk react-redux -S`
2. 在src中添加`redux`文件以及`reducer.js`文件夹
3. 在`redux`中创建`article.redux.js`

```
import axios from "../config/axios"

const GET_ARTICLE_DATA = "GET_ARTICLE_DATA"

const initState = {
  total: 0,
  items: []
}

export function article(state = initState, action) {
  switch (action.type) {
    case GET_ARTICLE_DATA:
      return {...state, ...action.payload}
    default:
      return state
  }
}

function getArticleSuccess(obj) {
  return { type: GET_ARTICLE_DATA, payload: obj }
}

/**
 * 获取所有文章数据
 */
export function getArticleData() {
  return async dispatch => {
    const getData = axios.get('/article/all/',{
      params: {
        page: 1,
        pageSize: 10
      }
    })
    try {
      let result = await getData
      if (result.status === 200) {
        dispatch(getArticleSuccess(result.data.data))
      }
    } catch (e) {
      console.log(e)
    }
  }
}
```
4. 在`reducer.js`中将redux集合
```
import { combineReducers } from 'redux'

import { article } from "./redux/article.redux"

export default combineReducers({ article })
```
5. 在index.js中引入必要文件
```
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import reducers from "./reducer";
```
6. 创建`store`
```
const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)
```
7. 将App组件被redux包围
```
<Provider store={store}>
    <BrowserRouter>
      <Router history={history}>
        <App />
      </Router>
    </BrowserRouter>
  </Provider>,
```


### 添加对装饰器的支持
1. 安装装饰器的babel

`npm i babel-plugin-transform-decorators-legacy -D`

2. 在package.json中设置babel参数


```
"babel": {
    "presets": [
      "react-app"
    ],
    "plugins": [
      "transform-decorators-legacy"
    ]
  }
```

### 配置less
1.安装必要包

`npm i less less-loader -D`

2.修改根目录config中的webpack配置文件
```
{
    test: /\.(css|less)$/,
    use: [
    {
        loader: require.resolve('less-loader') // compiles Less to CSS
      }
    ]
```

