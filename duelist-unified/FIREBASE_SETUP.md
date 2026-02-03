# Firebase 完整配置教程

本教程将详细指导你如何配置 Firebase，包括 Authentication 和 Firestore 数据库。

## 目录

1. [创建 Firebase 项目](#1-创建-firebase-项目)
2. [启用 Authentication](#2-启用-authentication)
3. [配置登录方式](#3-配置登录方式)
4. [启用 Firestore 数据库](#4-启用-firestore-数据库)
5. [获取配置信息](#5-获取配置信息)
6. [配置环境变量](#6-配置环境变量)
7. [设置安全规则](#7-设置安全规则)
8. [测试配置](#8-测试配置)

---

## 1. 创建 Firebase 项目

### 步骤 1.1：访问 Firebase 控制台

1. 打开浏览器，访问 [Firebase 控制台](https://console.firebase.google.com/)
2. 使用你的 Google 账号登录

### 步骤 1.2：创建新项目

1. 点击 **"添加项目"** 或 **"Create a project"**
2. 输入项目名称，例如：`duelist-app`
3. 点击 **"继续"** 或 **"Continue"**

### 步骤 1.3：配置 Google Analytics（可选）

1. 选择是否启用 Google Analytics
   - **推荐：启用**（有助于分析用户行为）
2. 如果启用，选择或创建 Analytics 账号
3. 点击 **"创建项目"** 或 **"Create project"**
4. 等待项目创建完成（约 30 秒）
5. 点击 **"继续"** 或 **"Continue"**

---

## 2. 启用 Authentication

### 步骤 2.1：进入 Authentication 页面

1. 在 Firebase 控制台左侧菜单中，点击 **"Authentication"** 或 **"身份验证"**
2. 如果首次使用，点击 **"Get started"** 或 **"开始使用"**

### 步骤 2.2：启用 Authentication

Authentication 会自动启用，你会看到登录方法列表。

---

## 3. 配置登录方式

### 3.1 邮箱/密码登录

1. 在 Authentication 页面，点击 **"Sign-in method"** 或 **"登录方法"** 标签
2. 找到 **"Email/Password"** 或 **"电子邮件/密码"**
3. 点击它
4. 启用 **"Email/Password"** 开关
5. 启用 **"Email link (passwordless sign-in)"**（可选，用于无密码登录）
6. 点击 **"保存"** 或 **"Save"**

### 3.2 Google 登录

1. 在登录方法列表中，找到 **"Google"**
2. 点击它
3. 启用 **"Enable"** 开关
4. 设置 **"Project support email"**（项目支持邮箱）
5. 点击 **"保存"** 或 **"Save"**

**注意**：Google 登录会自动配置，无需额外设置。

### 3.3 Facebook 登录

#### 步骤 3.3.1：创建 Facebook 应用

1. 访问 [Facebook Developers](https://developers.facebook.com/)
2. 登录你的 Facebook 账号
3. 点击右上角的 **"我的应用"** 或 **"My Apps"**
4. 点击 **"创建应用"** 或 **"Create App"**
5. 选择 **"Consumer"** 或 **"消费者"** 类型
6. 填写应用名称，例如：`Duelist App`
7. 填写联系邮箱
8. 点击 **"创建应用"** 或 **"Create App"**

#### 步骤 3.3.2：配置 Facebook 应用

1. 在 Facebook 应用控制台中，找到 **"设置" > "基本"** 或 **"Settings > Basic"**
2. 记录 **"应用 ID"** 和 **"应用密钥"**
3. 在 **"添加平台"** 或 **"Add Platform"** 中，选择 **"网站"** 或 **"Website"**
4. 在 **"网站网址"** 中，输入：
   - 开发环境：`http://localhost:3000`
   - 生产环境：你的实际域名
5. 点击 **"保存更改"**

#### 步骤 3.3.3：在 Firebase 中配置 Facebook

1. 回到 Firebase 控制台
2. 在 Authentication > Sign-in method 中，点击 **"Facebook"**
3. 启用 **"Enable"** 开关
4. 输入 **"App ID"** 和 **"App Secret"**（从 Facebook 应用获取）
5. 复制 **"OAuth redirect URI"**
6. 回到 Facebook 应用控制台
7. 在 **"Facebook 登录" > "设置"** 中，添加重定向 URI
8. 在 Firebase 中点击 **"保存"**

### 3.4 Twitter 登录

#### 步骤 3.4.1：创建 Twitter 应用

1. 访问 [Twitter Developer Portal](https://developer.twitter.com/)
2. 登录你的 Twitter 账号
3. 点击 **"Developer Portal"** 或 **"开发者门户"**
4. 点击 **"Create Project"** 或 **"创建项目"**
5. 填写项目信息：
   - 项目名称：`Duelist App`
   - 用例：选择 **"Making a bot"** 或其他选项
6. 创建应用：
   - 应用名称：`Duelist`
   - 应用类型：选择 **"Web App"**
7. 记录 **"API Key"** 和 **"API Secret"**

#### 步骤 3.4.2：配置 Twitter 回调 URL

1. 在 Twitter 应用设置中，找到 **"Callback URLs"**
2. 添加回调 URL：
   ```
   https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler
   ```
   （将 `YOUR_PROJECT_ID` 替换为你的 Firebase 项目 ID）

#### 步骤 3.4.3：在 Firebase 中配置 Twitter

1. 在 Firebase 控制台，Authentication > Sign-in method 中，点击 **"Twitter"**
2. 启用 **"Enable"** 开关
3. 输入 **"API Key"** 和 **"API Secret"**
4. 点击 **"保存"**

### 3.5 GitHub 登录

#### 步骤 3.5.1：创建 GitHub OAuth App

1. 访问 [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. 点击 **"New OAuth App"** 或 **"新建 OAuth 应用"**
3. 填写信息：
   - **Application name**：`Duelist App`
   - **Homepage URL**：`http://localhost:3000`（开发环境）
   - **Authorization callback URL**：
     ```
     https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler
     ```
4. 点击 **"Register application"**
5. 记录 **"Client ID"** 和 **"Client secret"**

#### 步骤 3.5.2：在 Firebase 中配置 GitHub

1. 在 Firebase 控制台，Authentication > Sign-in method 中，点击 **"GitHub"**
2. 启用 **"Enable"** 开关
3. 输入 **"Client ID"** 和 **"Client secret"**
4. 点击 **"保存"**

---

## 4. 启用 Firestore 数据库

### 步骤 4.1：创建 Firestore 数据库

1. 在 Firebase 控制台左侧菜单，点击 **"Firestore Database"** 或 **"Firestore 数据库"**
2. 点击 **"创建数据库"** 或 **"Create database"**

### 步骤 4.2：选择安全规则模式

1. 选择 **"以测试模式启动"** 或 **"Start in test mode"**
   - **注意**：测试模式允许所有读写，仅用于开发
   - 生产环境需要配置安全规则（见步骤 7）
2. 点击 **"下一步"** 或 **"Next"**

### 步骤 4.3：选择数据库位置

1. 选择离你最近的区域，例如：
   - **asia-east1**（台湾）
   - **asia-southeast1**（新加坡）
   - **us-central1**（美国中部）
2. 点击 **"启用"** 或 **"Enable"**
3. 等待数据库创建完成（约 1-2 分钟）

---

## 5. 获取配置信息

### 步骤 5.1：获取 Web 应用配置

1. 在 Firebase 控制台，点击左侧的 **⚙️ 项目设置** 或 **⚙️ Project settings**
2. 滚动到 **"你的应用"** 或 **"Your apps"** 部分
3. 如果没有 Web 应用，点击 **"</>"** 图标添加 Web 应用
4. 填写应用昵称，例如：`Duelist Web`
5. 可选：勾选 **"Also set up Firebase Hosting"**
6. 点击 **"注册应用"** 或 **"Register app"**
7. 你会看到配置信息，类似：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

8. **重要**：记录这些值，稍后需要用到

---

## 6. 配置环境变量

### 步骤 6.1：创建 .env 文件

在项目根目录 `duelist-unified/` 下创建 `.env` 文件：

```bash
# 在项目根目录执行
cd duelist-unified
touch .env  # Windows: type nul > .env
```

### 步骤 6.2：填写环境变量

打开 `.env` 文件，填入以下内容：

```env
# DeepSeek API Key（已提供）
DEEPSEEK_API_KEY=sk-bf1778c500a04bc399b65f046236618f

# Firebase 配置（从步骤 5 获取）
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**替换说明**：
- `FIREBASE_API_KEY`：从步骤 5.1 的 `apiKey` 获取
- `FIREBASE_AUTH_DOMAIN`：从步骤 5.1 的 `authDomain` 获取
- `FIREBASE_PROJECT_ID`：从步骤 5.1 的 `projectId` 获取
- `FIREBASE_STORAGE_BUCKET`：从步骤 5.1 的 `storageBucket` 获取
- `FIREBASE_MESSAGING_SENDER_ID`：从步骤 5.1 的 `messagingSenderId` 获取
- `FIREBASE_APP_ID`：从步骤 5.1 的 `appId` 获取

### 步骤 6.3：验证配置

确保 `.env` 文件在 `.gitignore` 中（已包含），避免提交敏感信息。

---

## 7. 设置安全规则

### 步骤 7.1：配置 Firestore 安全规则

1. 在 Firebase 控制台，进入 **Firestore Database**
2. 点击 **"规则"** 或 **"Rules"** 标签
3. 替换默认规则为以下内容：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 决策集合：用户只能读写自己的数据
    match /decisions/{decisionId} {
      // 允许读取：仅当用户已登录且是数据所有者
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      
      // 允许创建：仅当用户已登录且 userId 匹配
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      
      // 允许更新：仅当用户已登录且是数据所有者
      allow update: if request.auth != null && 
                       request.auth.uid == resource.data.userId;
      
      // 允许删除：仅当用户已登录且是数据所有者
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.userId;
    }
    
    // 用户资料集合（如果需要）
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. 点击 **"发布"** 或 **"Publish"**

### 步骤 7.2：配置 Authentication 授权域名

1. 在 Firebase 控制台，进入 **Authentication > Settings**
2. 滚动到 **"授权域名"** 或 **"Authorized domains"**
3. 确保包含以下域名：
   - `localhost`（开发环境）
   - 你的生产域名（如果已配置）

---

## 8. 测试配置

### 步骤 8.1：安装依赖

```bash
cd duelist-unified
npm install
```

### 步骤 8.2：启动开发服务器

```bash
npm run dev
```

### 步骤 8.3：测试认证功能

1. 打开浏览器访问 `http://localhost:3000`
2. 尝试注册新账号（邮箱/密码）
3. 测试登录功能
4. 测试社交登录（Google、Facebook、Twitter、GitHub）

### 步骤 8.4：测试数据库

1. 登录后，创建一个决策
2. 在 Firebase 控制台，进入 **Firestore Database**
3. 查看 `decisions` 集合，应该能看到你创建的决策数据
4. 验证数据包含 `userId` 字段

### 步骤 8.5：验证安全规则

1. 使用不同账号登录
2. 尝试访问其他用户的数据（应该被拒绝）
3. 验证只能访问自己的数据

---

## 常见问题排查

### 问题 1：认证失败

**可能原因**：
- Firebase 配置信息错误
- 授权域名未配置
- 登录方式未启用

**解决方法**：
1. 检查 `.env` 文件中的配置是否正确
2. 检查 Firebase 控制台中的授权域名
3. 确认登录方式已启用

### 问题 2：数据库写入失败

**可能原因**：
- Firestore 安全规则过于严格
- 用户未登录
- 数据格式不符合规则

**解决方法**：
1. 检查 Firestore 规则是否正确
2. 确认用户已登录（检查 `request.auth`）
3. 验证数据包含 `userId` 字段

### 问题 3：社交登录失败

**可能原因**：
- OAuth 应用配置错误
- 回调 URL 不匹配
- API Key/Secret 错误

**解决方法**：
1. 检查 OAuth 应用的回调 URL
2. 确认 API Key/Secret 正确
3. 查看浏览器控制台的错误信息

---

## 生产环境部署

### 步骤 1：配置生产域名

1. 在 Firebase 控制台，进入 **Authentication > Settings**
2. 添加你的生产域名到授权域名列表

### 步骤 2：更新环境变量

在生产环境中，使用相同的 Firebase 配置，但确保：
- 使用 HTTPS
- 配置正确的授权域名

### 步骤 3：优化安全规则

生产环境建议使用更严格的安全规则，并启用：
- 请求频率限制
- 数据验证
- 审计日志

---

## 总结

完成以上步骤后，你的 Firebase 配置应该包括：

✅ Firebase 项目已创建  
✅ Authentication 已启用  
✅ 多种登录方式已配置  
✅ Firestore 数据库已创建  
✅ 安全规则已设置  
✅ 环境变量已配置  
✅ 功能已测试  

现在你的应用已经可以：
- 支持多种登录方式
- 安全地存储用户数据
- 实现多设备数据同步

如有问题，请参考 Firebase 官方文档或查看控制台的错误信息。
