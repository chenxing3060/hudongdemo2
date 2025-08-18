#!/bin/bash

# 万象行者 - Java环境配置脚本
# 解决APK构建中的Java Runtime问题

echo "🚀 配置Java环境用于APK构建..."

# 1. 设置Java环境变量
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"

# 2. 设置Android SDK路径（如果存在）
if [ -d "$HOME/Library/Android/sdk" ]; then
    export ANDROID_HOME="$HOME/Library/Android/sdk"
    export PATH="$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH"
    echo "✅ Android SDK已配置: $ANDROID_HOME"
else
    echo "⚠️  Android SDK未找到，请安装Android Studio"
fi

# 3. 验证Java安装
echo "📋 验证Java安装:"
java -version

# 4. 检查Gradle是否可用
echo "📋 检查Gradle:"
if command -v gradle &> /dev/null; then
    gradle -version
else
    echo "Gradle将通过gradlew自动下载"
fi

# 5. 将环境变量添加到shell配置文件
echo "📝 更新shell配置文件..."
if ! grep -q "JAVA_HOME=/opt/homebrew/opt/openjdk@17" ~/.zshrc; then
    echo 'export JAVA_HOME=/opt/homebrew/opt/openjdk@17' >> ~/.zshrc
    echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
    echo "✅ Java环境变量已添加到 ~/.zshrc"
else
    echo "✅ Java环境变量已存在于 ~/.zshrc"
fi

echo "🎯 Java环境配置完成！"
echo "💡 提示: 重新打开终端或运行 'source ~/.zshrc' 来应用环境变量"
echo "🔨 现在可以运行: cd android && ./gradlew assembleDebug"