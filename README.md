# HQ ICON

### 网址：

我自己的域名：https://icon.yukonga.top/

GitHub Page：https://yukonga.github.io/HQ-ICON/

### 使用：

完整例子: https://icon.yukonga.top/?name=Google&country=us&entity=software&limit=18&cut=2&resolution=1024&format=webp

搜索框也可直接粘贴 App Store 应用链接或 App ID。链接中的地区会用于查询，例如 `https://apps.apple.com/sg/app/siri/id6758482875` 会查询新加坡区的 Siri；只输入 `6758482875` 时使用当前选择的地区。页面 URL 中显式指定的 `country` 参数优先于 App Store 链接地区。部分应用不在所有地区上架，在其他地区搜索不到时请切换地区或粘贴对应地区的链接。

### 参数：

|  url 传参  |                     对应作用                     |  默认值  |
| :--------: | :----------------------------------------------: | :------: |
|    name    |             应用名称、链接或 App ID              |    无    |
|  country   |            国家/地区 (cn,us,jp,kr...)            |    cn    |
|   entity   | 搜索对象 (software/iPadSoftware/desktopSoftware) | software |
|   limit    |              搜索数量限额 (1..200)               |    18    |
|    cut     |         图标样式 (0 原图/1 标准/2 官方)          |    2     |
| resolution |              分辨率 (256/512/1024)               |   512    |
|   format   |             图片格式 (jpeg/png/webp)             |   png    |

### 致谢：

[React](https://react.dev/) /
[Vite](https://vitejs.dev/) /
[Country Codes](https://en.wikipedia.org/wiki/Country_code) /
[Search API](https://performance-partners.apple.com/search-api) /
[hq-icon](https://github.com/f48vj/hq-icon)
