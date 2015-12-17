# angular-popups

基于 AngularJS 的浮层组件，由 [artDialog](https://github.com/aui/artDialog) 演进而来。

1. 使用 AngularJS 自带的 `ng-if`、`ng-show`、`ng-hide` 控制浮层的显示与隐藏
2. 支持 ARIA 规范、无障碍焦点管理、快捷键关闭
3. 纯粹的容器组件，完全基于 HTML 标签
4. 支持模态、与指定元素对齐特性

演示站点：<http://aui.github.io/angular-popups/>

## 使用

支持使用 script 标签或者 webpack 调用：

### script

下载：[angular-popups](https://github.com/aui/angular-popups/files/63677/angular-popups.zip)

调用

```html
<script src="js/jquery.js"></script>
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

> angular-popups 依赖 `jquery` 和 `angular` 这两个全局模块

## 指令

内置三个浮层指令：

* `dialog` 对话框指令
* `bubble` 气泡指令
* `popup` 透明浮层指令

## 通用参数

| 名称          | 说明                                       |
| ----------- | ---------------------------------------- |
| ng-if       | 显示或隐藏浮层（DOM 插入或删除）                       |
| ng-show     | 显示浮层                                     |
| ng-hide     | 隐藏浮层                                     |
| for         | 有此值则吸附到指定 ID 的元素附近，否则居中对齐                |
| align       | 对齐的参数，此参数需要与 `for` 配合使用。可选值：`"top left"` `"top"` `"top right"` `"right top"` `"right"` `"right bottom"` `"bottom right"` `"bottom"` `"bottom left"` `"left bottom"` `"left"` `"left top"` |
| fixed       | 使用固定定位                                   |
| modal       | 模态浮层                                     |
| duration    | 自动关闭的时间（单位毫秒）                            |
| close       | 浮层关闭事件                                   |
| drag        | 拖拽                                       |
| drag-handle | 拖拽的把柄                                    |

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

1. [普通对话框](./example/dialog-ng-if.html)
2. [模态对话框](./example/dialog-modal.html)
3. [带按钮的对话框](./example/dialog-dialog-buttons.html)
4. [带状态栏的对话框](./example/dialog-dialog-statusbar.html)
5. [无标题的对话框](./example/dialog-dialog-title.html)
6. [无关闭按钮的对话框](./example/dialog-close.html)
7. [带箭头的对话框](./example/dialog-for-align.html)
8. [fixed 定位的对话框](./example/dialog-fixed.html)
9. [自动关闭的对话框](./example/dialog-duration.html)
10. [可拖拽的对话框](./example/dialog-drag.html)

## bubble

气泡浮层

### 示例

1. [普通气泡](./example/bubble.html)
2. [自定义气泡方向](./example/bubble-for-align.html)
3. [不被关闭的气泡](./example/bubble-close.html)

## popup

透明浮层。通常用来定义自定义的浮层

### 示例

1. [自定义浮层](./example/popup.html)

## 兼容性

* Chrome
* Firefox
* IE9+

## 许可

MIT

-----------------

![支付宝二维码](data:image/png;base64,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)
喜欢这个项目？捐助￥26元请我一杯咖啡 :-)