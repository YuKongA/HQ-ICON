# HQ ICON

### 网址：
我自己的域名：https://icon.yukonga.top/ (用了 vercel 构建 + cf 托管，速度一般)

GitHub Page：https://yukonga.github.io/HQ-ICON/ (如果你能正常访问 GitHub，那访问它应该很快)

### 支持的平台：
- **iOS 应用** - 从 App Store 获取高清图标
- **macOS 应用** - 从 Mac App Store 获取高清图标
- **Android 应用** - 从 Google Play 获取高清图标 (需要部署在支持 serverless 函数的环境，如 Vercel)

### 使用：
完整例子: https://icon.yukonga.top/?name=Google&country=us&entity=software&limit=18&cut=0&resolution=1024&format=webp

### 对照表：
|  url 传参  |                    对应作用                    |  默认值  |
| :--------: | :--------------------------------------------: | :------: |
|    name    |                    应用名称                    |    无    |
|  country   |          国家/地区 (cn,us,jp,kr... )           |    cn    |
|   entity   | 搜索对象 (software/macSoftware/googlePlay )    | software |
|   limit    |             搜索数量限额 (1..200 )             |    18    |
|    cut     |              是否裁切圆角 (0/1 )               |    1     |
| resolution |             分辨率 (256/512/1024 )             |   512    |
|   format   |            图片格式 (jpeg/png/webp )            |   png    |

其中 `entity` 可选值：
- `software` - iOS 应用
- `macSoftware` - macOS 应用
- `googlePlay` - Android 应用 (仅在 Vercel 等支持 serverless 的环境中可用)

### 注意：
由于 Apple 目前限制了 Android UA 查询，只会返回一个名称完全符合的查询结果。

所以 Android 用户请使用隔壁仓库的 [App](https://github.com/YuKongA/HQ-ICON_Compose/releases) 版本。

**关于 iOS 液态玻璃风格图标：**
部分 iOS 应用已采用 Apple 的液态玻璃 (Liquid Glass) 风格图标，这是 App Store 提供的官方图标样式。如果您希望获取原始的应用图标（非液态玻璃风格），可以考虑：
- 使用本项目的 Google Play 选项获取 Android 版本的应用图标
- 从 APK 文件中提取原始图标
- 联系应用开发者获取原始图标资源

### 致谢：
[React](https://react.dev/) / 
[Vite](https://vitejs.dev/) / 
[Country Codes](https://en.wikipedia.org/wiki/Country_code) / 
[Search API](https://performance-partners.apple.com/search-api) / 
[hq-icon](https://github.com/f48vj/hq-icon)
