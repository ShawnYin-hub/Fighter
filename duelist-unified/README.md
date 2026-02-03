# Duelist - 决斗家

一个决策降维工具，帮助用户通过 1v1 对决的方式做出选择。

## 功能特性

- 🌓 **双主题支持**：Light 和 Dark 主题，一键切换
- 🌍 **多语言支持**：中文和英文
- 🤖 **AI 辅助决策**：使用 DeepSeek API 提供智能建议
- 🔐 **多种认证方式**：支持邮箱、Google、Facebook、Twitter、GitHub 登录
- 💾 **数据同步**：Firebase Firestore 存储，支持多设备同步
- 📱 **多平台支持**：Web、iOS、微信小程序

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Firebase (Auth + Firestore)
- DeepSeek API
- Capacitor (iOS)
- React Router

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

## 环境变量

创建 `.env` 文件：

```env
DEEPSEEK_API_KEY=sk-bf1778c500a04bc399b65f046236618f
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## Firebase 配置

**详细配置教程**：请查看 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

**快速开始**：请查看 [FIREBASE_QUICK_START.md](./FIREBASE_QUICK_START.md)

### 快速配置步骤

1. 访问 [Firebase 控制台](https://console.firebase.google.com/)
2. 创建新项目
3. 启用 Authentication（至少启用 Email/Password）
4. 创建 Firestore 数据库
5. 获取 Web 应用配置信息
6. 填入 `.env` 文件

详细步骤请参考上面的文档。

## iOS 打包

```bash
# 同步 Capacitor
npm run cap:sync

# 打开 Xcode
npm run cap:ios
```

## 微信小程序

项目支持通过 Taro 或 uni-app 转换为微信小程序。需要单独配置。

## 许可证

MIT
