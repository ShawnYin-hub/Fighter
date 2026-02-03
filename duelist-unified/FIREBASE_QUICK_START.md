# Firebase 快速配置指南（简化版）

如果你只需要快速开始，可以按照这个简化版本配置。

## 快速步骤

### 1. 创建 Firebase 项目

1. 访问 https://console.firebase.google.com/
2. 点击 "添加项目"
3. 输入项目名称：`duelist-app`
4. 完成创建

### 2. 启用 Authentication

1. 左侧菜单 → **Authentication**
2. 点击 **"开始使用"**
3. 点击 **"Sign-in method"** 标签
4. 启用以下登录方式：
   - ✅ **Email/Password**（邮箱/密码）
   - ✅ **Google**（Google 登录）

### 3. 创建 Firestore 数据库

1. 左侧菜单 → **Firestore Database**
2. 点击 **"创建数据库"**
3. 选择 **"以测试模式启动"**
4. 选择区域（推荐：asia-east1）
5. 点击 **"启用"**

### 4. 获取配置信息

1. 点击左侧的 **⚙️ 项目设置**
2. 滚动到 **"你的应用"**
3. 点击 **"</>"** 图标（添加 Web 应用）
4. 输入应用昵称：`Duelist Web`
5. 点击 **"注册应用"**
6. **复制配置信息**

### 5. 配置环境变量

在项目根目录创建 `.env` 文件：

```env
# DeepSeek API（已提供）
DEEPSEEK_API_KEY=sk-bf1778c500a04bc399b65f046236618f

# Firebase 配置（从步骤 4 复制）
FIREBASE_API_KEY=你的_apiKey
FIREBASE_AUTH_DOMAIN=你的_authDomain
FIREBASE_PROJECT_ID=你的_projectId
FIREBASE_STORAGE_BUCKET=你的_storageBucket
FIREBASE_MESSAGING_SENDER_ID=你的_messagingSenderId
FIREBASE_APP_ID=你的_appId
```

### 6. 设置安全规则（可选，但推荐）

1. Firestore Database → **规则**
2. 粘贴以下规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /decisions/{decisionId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == resource.data.userId;
    }
  }
}
```

3. 点击 **"发布"**

### 7. 测试

```bash
npm install
npm run dev
```

访问 http://localhost:3000，尝试注册和登录！

---

## 最小配置（仅邮箱登录）

如果你只需要邮箱登录，可以跳过社交登录的配置：

1. 只启用 **Email/Password**
2. 跳过 Google/Facebook/Twitter/GitHub 的配置
3. 其他步骤相同

---

## 需要帮助？

查看完整教程：`FIREBASE_SETUP.md`
