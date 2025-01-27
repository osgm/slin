<h3 align="center">浏览器抓包插件</h3>

### 开发目的

- 提高B/S项目接口测试的数据抓包和自动化脚本调试的效率。
- 仅为网络监听工具，此工作仅作为桌面工具slin的浏览器辅助工具，后续会提供桌面工具以更好的支持网络监听抓包。

### 插件功能

- **开发工具模式下抓包**: 使用devtools API直接获取网络请求的响应数据，抓包时需要开启开发工具；
- **IndexedDB本地存储**: 基于IndexedDB存储网络数据，未来考虑使用长链接的方式处理，以便支持webRequest API抓包；
- **脚本加工处理**: 为便于加工处理脚本数据，增加目标值和变量的替换功能，将请求数据中的目标值替换为变量值，并判返回值中第一位存在目标值的请求，标记为首次提取变量API
- **测试脚本导出**: 当前支持Postman格式、jmeter的JMX格式导出脚本，后续会支持HAR，EXCEL的脚本导出，以便支持其他平台的导入。
- **API自定义名称功能**: 待完成：从api文档或者swagger自动获取接口名
- **变量提取脚本标记功能**: 待完成：自动计算标记第一位提取 ，接口名,备注字段修改后的持久化
### 安装部署
本项目暂未申请build版本，请通过浏览器的直接导入扩展插件

### 使用说明

```text
1、打开浏览器并开启开发者工具。
2、点击开发工具设置按钮，偏好设置中的全局Global设置勾选为弹窗自动启动devtools。
3、地址栏输入并访问被测URL。
4、浏览器扩展程序启用slin，弹窗进入抓包页面。
5、操作浏览器内容并抓包。
6、抓包页面可暂停/启动，删除替换操作，以便加工监听数据。
7、可导出脚本，并基于文本进行二次加工。
```

### 版本说明

slin 西林 版本号命名规则为：v大版本.功能版本.Bug修复版本。比如：

```text
v1.0.1 是 v1.0.0 之后的Bug修复版本；
v1.1.0 是 v1.0.0 之后的功能版本。
```

### 其他说明

欢迎大家参与共建打造强可用性的辅助工具，如果您在使用过程中发现任何问题，请通过以下方式直接联系我们：

### 致谢
- 感谢开源代码

### 发布计划
- 已完成支持 ： postman、swagger、json、excel和jmeter脚本的导出
- 已完成火狐和谷歌浏览器的兼容支持，过滤设置和指定导出以及刷新的缺陷

