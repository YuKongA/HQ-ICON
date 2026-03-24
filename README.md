# HQ ICON

### 网址：

我自己的域名：https://icon.yukonga.top/

GitHub Page：https://yukonga.github.io/HQ-ICON/

### 使用：

完整例子: https://icon.yukonga.top/?name=Google&country=us&entity=software&limit=18&cut=0&resolution=1024&format=webp

### 参数：

|  url 传参  |                     对应作用                     |  默认值  |
| :--------: | :----------------------------------------------: | :------: |
|    name    |                     应用名称                     |    无    |
|  country   |            国家/地区 (cn,us,jp,kr...)            |    cn    |
|   entity   | 搜索对象 (software/iPadSoftware/desktopSoftware) | software |
|   limit    |              搜索数量限额 (1..200)               |    18    |
|    cut     |                是否裁切圆角 (0/1)                |    1     |
| resolution |              分辨率 (256/512/1024)               |   512    |
|   format   |             图片格式 (jpeg/png/webp)             |   png    |

### 注意：

由于 Apple 有时会对 Android UA 进行限制，Android 设备查询时可能只会返回一个名称完全匹配的结果。

如遇此问题，可以尝试使用我隔壁仓库的 [App](https://github.com/YuKongA/HQ-ICON_Compose/releases) 版本绕过这个限制。

### 致谢：

[React](https://react.dev/) /
[Vite](https://vitejs.dev/) /
[Country Codes](https://en.wikipedia.org/wiki/Country_code) /
[Search API](https://performance-partners.apple.com/search-api) /
[hq-icon](https://github.com/f48vj/hq-icon)
