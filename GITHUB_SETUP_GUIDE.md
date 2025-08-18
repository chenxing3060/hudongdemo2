# GitHub 仓库设置和推送指南

## 项目准备状态

✅ **已完成的准备工作：**
- Git 仓库已初始化
- .gitignore 文件已配置（排除 APK、构建文件等）
- Git LFS 已配置用于处理大型视频文件（850MB）
- 所有项目文件已添加到 Git
- 初始提交已创建

## 第一步：在 GitHub 上创建仓库

1. 访问 [GitHub](https://github.com) 并登录您的账户
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `thecodexwalker` 或 `万象行者`
   - **Description**: `万象行者 - 一个沉浸式的互动叙事游戏，探索多重现实的奥秘`
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"
   - **不要**添加 .gitignore 或 license（我们已经有了）
4. 点击 "Create repository"

## 第二步：连接本地仓库到 GitHub

在终端中执行以下命令（将 `YOUR_USERNAME` 替换为您的 GitHub 用户名）：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/thecodexwalker.git

# 设置主分支名称
git branch -M main

# 推送到 GitHub
git push -u origin main
```

## 第三步：处理 Git LFS（重要）

由于项目包含大型视频文件，需要确保 Git LFS 正常工作：

```bash
# 验证 LFS 文件
git lfs ls-files

# 如果需要，推送 LFS 文件
git lfs push origin main
```

## 可能遇到的问题和解决方案

### 1. 推送失败 - 文件过大
如果遇到文件过大的错误：
```bash
# 确保所有大文件都被 LFS 跟踪
git lfs track "*.mp4"
git lfs track "*.apk"
git add .gitattributes
git commit -m "Update LFS tracking"
git push
```

### 2. 认证问题
如果遇到认证问题，建议使用 Personal Access Token：
1. 访问 GitHub Settings > Developer settings > Personal access tokens
2. 生成新的 token，选择 repo 权限
3. 使用 token 作为密码进行推送

### 3. LFS 配额问题
GitHub 免费账户的 LFS 存储限制为 1GB，带宽限制为 1GB/月。
如果超出限制，考虑：
- 升级到 GitHub Pro
- 使用其他存储方案（如 Git LFS 的第三方存储）
- 压缩视频文件

## 验证上传成功

上传完成后，检查以下内容：

1. **仓库文件结构**：确保所有文件都已上传
2. **LFS 文件**：在 GitHub 上查看视频文件，应该显示为 LFS 指针
3. **README 显示**：确保 README.md 正确显示项目信息
4. **游戏可访问性**：如果设置了 GitHub Pages，测试游戏是否可以在线访问

## 后续维护

### 日常更新流程
```bash
# 添加更改
git add .

# 提交更改
git commit -m "描述您的更改"

# 推送到 GitHub
git push
```

### 版本标签
为重要版本创建标签：
```bash
# 创建标签
git tag -a v1.5.0 -m "版本 1.5.0 - 小米15兼容性修复"

# 推送标签
git push origin v1.5.0
```

## 项目特色说明

这个项目包含：
- 🎮 完整的互动叙事游戏
- 📱 移动端优化和 APK 构建
- 🎬 850MB 的高质量视频内容
- 📚 详细的世界观设定文档
- 🛠️ 完整的开发和构建工具链
- 📖 丰富的文档和指南

---

**注意**：由于项目包含大量视频文件，首次推送可能需要较长时间。请确保网络连接稳定。