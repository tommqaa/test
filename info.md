# 优雅翻页时钟与倒计时项目说明

## 项目概述
这是一个基于纯前端技术栈开发的优雅翻页时钟与倒计时应用，具有现代化的UI设计和流畅的动画效果。

## 技术栈
- HTML5
- CSS3
- JavaScript (原生)
- Web Wake Lock API (用于控制屏幕常亮)

## 主要功能
1. 实时时钟显示
   - 24小时制时间显示
   - 数字翻页动画效果
   
2. 倒计时功能
   - 支持多个预设时间选项（10/20/30/45/60/90分钟）
   - 倒计时结束自动停止
   - 数字翻页动画效果
   
3. 屏幕常亮功能
   - 使用Web Wake Lock API
   - 状态指示器显示
   - 页面切换自动重新请求

## 关键代码实现

### 1. 翻页动画效果
```css
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.flip-animation {
    animation: pulse 0.5s ease;
}
```

### 2. 屏幕常亮实现
```javascript
async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        updateWakeLockStatus(true);
        console.log('屏幕常亮已启用');
    } catch (err) {
        console.error('启用屏幕常亮失败:', err);
        updateWakeLockStatus(false);
    }
}
```

### 3. 倒计时核心逻辑
```javascript
function updateCountdown() {
    if (!endTime) return;
    const now = new Date();
    const timeDiff = endTime - now;
    
    if (timeDiff <= 0) {
        clearInterval(countdownInterval);
        endTime = null;
        // 更新显示和释放屏幕常亮...
        return;
    }
    
    const hours = String(Math.floor(timeDiff / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((timeDiff % (1000 * 60)) / 1000)).padStart(2, '0');
    
    // 更新显示...
}
```

## UI设计特点
1. 毛玻璃效果背景
2. 渐变背景色
3. 悬浮效果
4. 响应式设计
5. 优雅的动画过渡

## 运行截图

![时钟界面](https://i.imgur.com/placeholder1.png)
*实时时钟显示界面*

![倒计时界面](https://i.imgur.com/placeholder2.png)
*倒计时功能界面*

## 项目亮点
1. 纯前端实现，无需后端支持
2. 现代化UI设计
3. 流畅的动画效果
4. 支持屏幕常亮
5. 响应式设计，支持移动端
6. 代码结构清晰，易于维护

## 使用说明
1. 打开网页即可看到实时时钟显示
2. 点击倒计时按钮可启动对应时长的倒计时
3. 倒计时开始后屏幕会保持常亮
4. 倒计时结束后自动关闭常亮

## 浏览器兼容性
- Chrome 84+
- Edge 84+
- Safari 14+
- Firefox 79+

注：屏幕常亮功能需要浏览器支持Web Wake Lock API

## 后续优化方向
1. 添加自定义倒计时时长功能
2. 增加声音提醒功能
3. 支持多组倒计时同时运行
4. 添加倒计时暂停功能
5. 支持本地存储记忆上次设置
```

这份文档详细介绍了项目的各个方面，包括技术栈、功能特点、关键代码实现、UI设计等。建议您添加实际运行时的截图来替换占位图片，这样可以让文档更加直观。如果您需要添加或修改任何部分，请随时告诉我。
