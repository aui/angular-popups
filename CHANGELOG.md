## 0.0.1

1. 提供无 CSS 依赖的版本 

## 0.0.1-beta9

1. 修复在 safari 浏览器下使用 service 可能导致页面滚动的问题

## 0.0.1-beta8

1. 增加 `close-action` 配置

## 0.0.1-beta7

1. 使用 `focusout` 事件优化关闭 `bubble` 操作，对键盘操作更友好
2. `ng-if`、`ng-show` 如果传入的是 `$event`，则浮层会定位到事件触发位置

## 0.0.1-beta6

1. 增加 `notice` 指令
2. 提供对话框服务

## 0.0.1-beta5

1. 优化 `dialog` 指令在移动端的布局呈现
2. 优化 Retina 版 Mac 下 chrome 浏览器的模态浮层样式

## 0.0.1-beta4

1. 修复使用 `ng-show` 会导致 `for` 定位错误的问题
2. 修复可能意外关闭其他浮层的问题

## 0.0.1-beta3

1. 去掉 `jquery` 依赖
2. 移除 `drag` 指令

## 0.0.1-beta2

1. 模块名由 `popups` 改成 `angular-popupss`
2. 修复按按 ESC 关闭浮层，浮层没有恢复焦点的问题
3. 修复 `align` 无效的问题
4. 优化 `bubble` 指令样式