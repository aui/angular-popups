# angular-popups

基于 AngularJS 的浮层组件，由 [artDialog](https://github.com/aui/artDialog) 演进而来。

1. 使用 AngularJS 自带的 `ng-if`、`ng-show`、`ng-hide` 控制浮层的显示与隐藏
2. 支持 ARIA 规范、无障碍焦点管理、快捷键关闭
3. 完全基于 HTML 标签，高可定制化
4. 可以指定元素对齐或者页面居中显示
5. 可以使用模态特性
6. 不依赖 jQuery 等外部库

演示站点：<https://aui.github.io/angular-popups/>

## 使用

支持使用 script 标签或者 webpack、rquirejs、seajs 调用：

### script

下载：[angular-popups](https://github.com/aui/angular-popups/files/63677/angular-popups.zip)

调用

```html
<script src="js/angular.js"></script>
<script src="js/angular-popups.js"></script>
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

内置三个浮层指令：

* `dialog` 对话框指令
* `bubble` 气泡指令
* `popup` 透明浮层指令

## 浮层通用参数

| 名称          | 说明                                    |
| ----------- | ---------------------------------------- |
| ng-if       | 显示或隐藏浮层（DOM 插入或删除）              |
| ng-show     | 显示浮层                                  |
| ng-hide     | 隐藏浮层                                  |
| for         | 指定元素对齐，传入目标元素 ID 即可            |
| align       | 对齐的参数，此参数需要与 `for` 配合使用。可选值：`"top left"` `"top"` `"top right"` `"right top"` `"right"` `"right bottom"` `"bottom right"` `"bottom"` `"bottom left"` `"left bottom"` `"left"` `"left top"` |
| fixed       | 使用固定定位，等同于 CSS fixed               |
| modal       | 模态浮层                                   |
| duration    | 自动关闭的时间（单位毫秒）                    |
| close       | 浮层关闭事件                                |

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

1. [普通对话框](https://aui.github.io/angular-popups/example/dialog-ng-if.html)
2. [模态对话框](https://aui.github.io/angular-popups/example/dialog-modal.html)
3. [带按钮的对话框](https://aui.github.io/angular-popups/example/dialog-dialog-buttons.html)
4. [带状态栏的对话框](https://aui.github.io/angular-popups/example/dialog-dialog-statusbar.html)
5. [无标题的对话框](https://aui.github.io/angular-popups/example/dialog-dialog-title.html)
6. [无关闭按钮的对话框](https://aui.github.io/angular-popups/example/dialog-close.html)
7. [带箭头的对话框](https://aui.github.io/angular-popups/example/dialog-for-align.html)
8. [fixed 定位的对话框](https://aui.github.io/angular-popups/example/dialog-fixed.html)
9. [自动关闭的对话框](https://aui.github.io/angular-popups/example/dialog-duration.html)

## bubble

气泡浮层

### 示例

1. [普通气泡](https://aui.github.io/angular-popups/example/bubble.html)
2. [自定义气泡方向](https://aui.github.io/angular-popups/example/bubble-for-align.html)
3. [不被关闭的气泡](https://aui.github.io/angular-popups/example/bubble-close.html)

## popup

透明浮层。通常用来定义自定义的浮层

### 示例

1. [自定义浮层](https://aui.github.io/angular-popups/example/popup.html)

## 兼容性

* Chrome
* Firefox
* IE9+

## 许可

[MIT](./LICENSE)

-----------------

![支付宝二维码](http://aui.github.io/angular-popups/qr-alipay.png)

喜欢这个项目？捐助￥26元请我一杯咖啡 :-)