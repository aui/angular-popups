# angular-popups

基于 AngularJS 的浮层组件，由 [artDialog](https://github.com/aui/artDialog) 演进而来。angular-popups 是一个严格遵循 AngularJS 架构与 web 标准的组件：

1. 使用 AngularJS 自带的 `ng-if`、`ng-show`、`ng-hide` 控制浮层的显示、销毁
2. 支持 ARIA 规范、无障碍焦点管理、快捷键关闭
3. 完全基于 HTML 标签（指令），无需在控制器中进行配置
4. 可以指定元素或鼠标事件对象（`$event`）对齐
5. 支持模态浮层
6. 对移动端支持友好
6. 轻量（css+js=7kb），不依赖 jQuery 等外部库

演示站点：<https://aui.github.io/angular-popups/>

## 使用

支持使用 script 标签或者 webpack、requirejs、seajs 调用：

### script

调用

```html
<script src="lib/angular.js"></script>
<script src="dist/angular-popups.js"></script>
<script>
    var app = angular.module('app', ['angular-popups']);
</script>
```

### webpack

安装
``` shell
npm install angular-popups
```

调用
```js
require('angular-popups');
var app = angular.module('app', ['angular-popups']);
```

> angular-popups 依赖 `angular` 这个全局模块

## 指令

包含如下浮层指令：

* [`dialog` 对话框指令](#dialog)
* [`bubble` 气泡指令](#bubble)
* [`notice` 通知消息指令](#notice)
* [`popup` 透明浮层指令](#popup)

### 浮层通用参数

| 名称          | 说明                                     |
| ------------ | ---------------------------------------- |
| ng-if        | 显示或隐藏浮层（DOM 插入或删除）              |
| ng-show      | 显示浮层                                  |
| ng-hide      | 隐藏浮层                                  |
| for          | 指定元素对齐，传入目标元素 ID 即可            |
| align        | 对齐的参数，此参数需要与 `for` 配合使用。默认 `"bottom left"`，可选值：`"top left"` `"top"` `"top right"` `"right top"` `"right"` `"right bottom"` `"bottom right"` `"bottom"` `"bottom left"` `"left bottom"` `"left"` `"left top"` |
| fixed        | 使用固定定位，等同于 CSS `position:fixed`    |
| modal        | 模态浮层                                   |
| duration     | 自动关闭的时间（单位毫秒）                     |
| close        | 浮层关闭事件                                |
| close-action | 配置浮层由什么动作来触发关闭（执行 `close` 事件）。默认 `"esc timeout"` ，所有支持的动作： `"esc timeout outerchick click"` |

> `ng-if`、`ng-show` 如果传入的是 `$event`，则浮层会定位到事件触发位置

## dialog

对话框指令

### 子指令

| 名称               | 说明       |
| ---------------- | -------- |
| dialog-title     | 对话框标题容器  |
| dialog-content   | 对话框内容容器  |
| dialog-buttons   | 对话框按钮容器  |
| dialog-statusbar | 对话框状态栏容器 |

> 对话框子指令中的事件可以使用 `$close()` 这个函数，它会调用通用参数 `close` 中的表达式

### 示例

```html
<dialog ng-if="dialog.open" close="dialog.open=false">
    <div dialog-title>消息</div>
    <div dialog-content>hello world</div>
</dialog>
```

在线演示：

1. [普通对话框](https://aui.github.io/angular-popups/example/dialog-ng-if.html)
2. [模态对话框](https://aui.github.io/angular-popups/example/dialog-modal.html)
3. [带按钮的对话框](https://aui.github.io/angular-popups/example/dialog-dialog-buttons.html)
4. [带状态栏的对话框](https://aui.github.io/angular-popups/example/dialog-dialog-statusbar.html)
5. [无标题的对话框](https://aui.github.io/angular-popups/example/dialog-dialog-title.html)
6. [无关闭按钮的对话框](https://aui.github.io/angular-popups/example/dialog-close.html)
7. [带箭头的对话框](https://aui.github.io/angular-popups/example/dialog-for-align.html)
8. [fixed 定位的对话框](https://aui.github.io/angular-popups/example/dialog-fixed.html)
9. [定时关闭的对话框](https://aui.github.io/angular-popups/example/dialog-duration.html)
10. [外部点击可关闭的对话框](https://aui.github.io/angular-popups/example/dialog-close-action)

## bubble

气泡浮层指令

### 示例

```html
<button id="btn" ng-click="bubble.open = true">打开气泡</button>
<bubble ng-if="bubble.open" for="btn" close="bubble.open=false">
    hello world
</bubble>
```

在线演示：

1. [普通气泡](https://aui.github.io/angular-popups/example/bubble.html)
2. [自定义气泡方向](https://aui.github.io/angular-popups/example/bubble-for-align.html)
3. [不被关闭的气泡](https://aui.github.io/angular-popups/example/bubble-close.html)

## notice

通知消息指令

### 示例

```html
<notice ng-if="notice.open" duration="2000" close="notice.open=false">
    hello world
</notice>
```

在线演示：

1. [普通通知浮层](https://aui.github.io/angular-popups/example/notice.html)
2. [模态通知浮层](https://aui.github.io/angular-popups/example/notice-modal.html)

## popup

透明浮层指令

> 无任何样式，可以用来制作自定义形状的浮层

### 示例

```html
<popup ng-if="popup.open" close="popup.open=false">
    <div class="mod-popup-example">hello world</div>
</popup>
```

在线演示：

1. [自定义浮层](https://aui.github.io/angular-popups/example/popup.html)
2. [创建右键菜单](https://aui.github.io/angular-popups/example/popup-contextmenu.html)

## 服务

若想在 js 代码中调用浮层相关控件，可以使用 `Popup` 服务。

### 方法

* Popup.alert(content, ok)
* Popup.confirm(content, ok, cancel)
* Popup.notice(content, duration, ok);

> `Popup` 服务仅支持文本消息，HTML 内容请使用指令

### 配置

配置默认的标题以及按钮文案

```js
app.config(function (PopupProvider) {
    PopupProvider.title = '提示';
    PopupProvider.okValue = '确定';
    PopupProvider.cancelValue = '取消';
});
```

### 示例

```js
app.controller('testCtrl', function($scope, Popup) {
    Popup.alert('hello world', function () {
        console.log('ok');
    });
});
```

在线演示：

1. [在控制器中使用 `Popup` 服务](https://aui.github.io/angular-popups/example/services.html)

## 兼容性

* Chrome
* Firefox
* IE9+

## 更新日志

[CHANGELOG.md](./CHANGELOG.md)

## 许可

[MIT](./LICENSE)

-----------------

![支付宝二维码](http://aui.github.io/angular-popups/qr-alipay.png)

喜欢这个项目？捐助一杯咖啡支持下（￥28）