# <center> MyNote

<div align=center>
<img src="./public/logo.png" alt="logo" style="zoom: 30%" />
</div>

## 介绍

Microsoft Edge 浏览器开拓者大赛参赛项目。

团队名：请为您的队伍去个名吧

还在为记笔记发愁吗？还在为网页与笔记软件的频繁切换而烦恼吗？还在为笔记太多又疏于整理而糟心吗？

现在，来试试这款浏览器扩展吧！

> 由于比赛时间有限，有些代码写的不够合理，因此将其重构。在此基础上，还添加了新的功能。
> 比赛代码可以查看[match](https://github.com/LittleLittleLi97/Note-WebExtension/tree/match)分支。

## 已完成部分

- [x] Popup页面
- [x] Content页面
- [x] Light / Dark模式
- [x] 笔记自动保存
- [x] markdown解析
- [x] 添加/删除笔记
- [x] 页面标注
- [x] 笔记导出
- [x] i18n 中文/英文

## 使用方法

终端运行
```
npm install
npm run build
```
然后将生成的dist目录添加到浏览器扩展中

## 预览图

### light模式

收藏夹
<img src="./forshow/light%20popup.png" alt="light收藏夹" style="zoom:50%;" />

写笔记
![light写笔记](./forshow/light%20content.png)

### dark模式

收藏夹
<img src="./forshow/dark%20popup.png" alt="dark收藏夹" style="zoom:50%;" />

写笔记
![dark写笔记](./forshow/dark%20content.png)

### 页面标注

![页面标注](./forshow/highlight.png)