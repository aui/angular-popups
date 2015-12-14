# angular-popups

基于 AngularJS 的浮层组件，由 [artDialog](https://github.com/aui/artDialog) 演进而来。

1. 使用 AngularJS 自带的 `ng-if`、`ng-show`、`ng-hide` 控制浮层的显示与隐藏
2. 支持 ARIA 规范、无障碍焦点管理、快捷键关闭
3. 内置话框样式、气泡样式、透明样式
4. 支持模态浮层、与指定元素对齐、自动关闭特性

**提供 4 个指令：**

* `dialog` 对话框指令
* `bubble` 气泡指令
* `popup` 透明浮层指令

## 安装

``` shell
npm install angular-popups
```

## 通用参数

| 名称          | 说明                                       |
| ----------- | ---------------------------------------- |
| ng-if       | 显示或隐藏浮层（DOM 插入或删除）                       |
| ng-show     | 显示浮层                                     |
| ng-hide     | 隐藏浮层                                     |
| for         | 有此值则吸附到指定 ID 的元素附近，否则居中对齐                |
| align       | 对齐的参数，此参数需要与 `for` 配合使用。可选值：`"top left"` `"top"` `"top right"` `"right top"` `"right"` `"right bottom"` `"bottom right"` `"bottom"` `"bottom left"` `"left bottom"` `"left"` `"left top"` |
| fixed       | 使用固定定位                                   |
| modal       | 模特浮层                                     |
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

### 示例

简单的对话框

``` html
<dialog ng-if="dialog.open" close="dialog.open=false">
    <div dialog-title>提示</div>
    <div dialog-content>hello wrold</div>
</dialog>
```

模态对话框

``` html
<dialog ng-if="dialog.open" modal close="dialog.open=false">
    <div dialog-title>提示</div>
    <div dialog-content>hello wrold</div>
</dialog>
```

有按钮的对话框

``` html
<dialog ng-if="dialog.open" close="dialog.open=false">
    <div dialog-title>提示</div>  
    <div dialog-content>hello wrold</div>
    <div dialog-buttons>
        <button autofocus>确定</button>
        <button ng-click="$close()">取消</button>
    </div>
</dialog>
```

有状态栏

``` html
<dialog ng-if="dialog.open" close="dialog.open=false">
    <div dialog-title>提示</div>
    <div dialog-content>hello wrold</div>
    <div dialog-statusbar><label><input type="checkbox">下次不再显示</label></div>
    <div dialog-buttons>
        <button autofocus>确定</button>
        <button ng-click="$close()">取消</button>
    </div>
</dialog>
```

可在元素附近打开的对话框

``` html
<button id="test-btn" ng-click="dialog={open: true}">打开对话框</button>
<dialog ng-if="dialog.open" for="test-btn" close="dialog.open=false">
    <div dialog-title>提示</div>
    <div dialog-content>hello wrold</div>
</dialog>
```

定时关闭

``` html
<dialog ng-if="dialog.open" duration="2000" close="dialog.open=false">
    <div dialog-title>提示</div>
    <div dialog-content>hello wrold</div>
</dialog>
```

## bubble

气泡浮层

### 示例

在按钮附近显示一个气泡

``` html
<button ng-click="bubble.open = true">show bubble</button>
<bubble ng-if="bubble.open" for="test" close="bubble.open=false">hello world</bubble>
```

> 如果没有 `close` ，点击外部或按 ESC 不会关闭气泡。

## popup

透明浮层。通常用来定义自定义的浮层

### 示例

``` html
<popup ng-if="popup.open">
  <div class="mod-message-box">
  	  ...
  </div>
</popup>
```

## 许可

MIT