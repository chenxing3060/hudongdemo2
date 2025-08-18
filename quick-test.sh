#!/bin/bash

# 快速测试启动脚本
# 使用方法: chmod +x quick-test.sh && ./quick-test.sh

echo "🚀 移动应用快速测试工具"
echo "=============================="
echo ""
echo "由于 Android Studio 无法正常启动，我们为您提供以下测试方案："
echo ""
echo "📱 测试方案选择:"
echo "1) 浏览器移动端模拟 (推荐 - 最快速)"
echo "2) ADB + 物理设备测试 (最真实)"
echo "3) 修复 Android Studio"
echo "4) 查看详细指南"
echo "0) 退出"
echo ""
read -p "请选择测试方案 (0-4): " choice

case $choice in
    1)
        echo "🌐 启动浏览器移动端测试..."
        echo ""
        echo "1. 检查开发服务器状态..."
        
        # 检查开发服务器是否运行
        if lsof -i :8000 > /dev/null 2>&1; then
            echo "✅ 开发服务器正在运行 (端口 8000)"
        else
            echo "⚠️  开发服务器未运行，正在启动..."
            npm run dev &
            sleep 3
            echo "✅ 开发服务器已启动"
        fi
        
        echo ""
        echo "2. 测试地址:"
        echo "   本地访问: http://localhost:8000/game.html"
        echo ""
        echo "3. 获取本地 IP 地址用于移动设备访问:"
        LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
        if [ ! -z "$LOCAL_IP" ]; then
            echo "   移动设备访问: http://$LOCAL_IP:8000/game.html"
        else
            echo "   请手动获取本地 IP 地址"
        fi
        
        echo ""
        echo "4. 浏览器调试步骤:"
        echo "   - Chrome: F12 > 设备模拟按钮 📱"
        echo "   - Firefox: F12 > 响应式设计模式"
        echo "   - Safari: 开发 > 进入响应式设计模式"
        
        echo ""
        echo "📖 详细指南: BROWSER_MOBILE_TESTING_GUIDE.md"
        
        # 尝试打开浏览器
        if command -v open &> /dev/null; then
            read -p "是否在浏览器中打开测试页面? (y/n): " open_browser
            if [ "$open_browser" = "y" ] || [ "$open_browser" = "Y" ]; then
                open "http://localhost:8000/game.html"
                echo "✅ 已在默认浏览器中打开测试页面"
            fi
        fi
        ;;
        
    2)
        echo "📱 启动 ADB 物理设备测试..."
        echo ""
        
        # 检查是否存在测试脚本
        if [ -f "./test-apk.sh" ]; then
            echo "🔧 运行 APK 测试脚本..."
            ./test-apk.sh
        else
            echo "❌ 测试脚本不存在"
            echo "请确保 test-apk.sh 文件存在并具有执行权限"
        fi
        ;;
        
    3)
        echo "🔧 修复 Android Studio..."
        echo ""
        
        # 检查是否存在修复脚本
        if [ -f "./fix-android-studio.sh" ]; then
            echo "🛠️  运行 Android Studio 修复脚本..."
            ./fix-android-studio.sh
        else
            echo "❌ 修复脚本不存在"
            echo "请查看 ANDROID_STUDIO_TROUBLESHOOTING.md 获取手动修复方法"
        fi
        ;;
        
    4)
        echo "📚 查看详细指南..."
        echo ""
        echo "可用的指南文档:"
        echo "📄 ANDROID_STUDIO_TROUBLESHOOTING.md - Android Studio 故障排除"
        echo "📄 ALTERNATIVE_APK_TESTING_GUIDE.md - APK 测试替代方案"
        echo "📄 BROWSER_MOBILE_TESTING_GUIDE.md - 浏览器移动端测试"
        echo ""
        echo "可用的脚本工具:"
        echo "🔧 fix-android-studio.sh - Android Studio 修复工具"
        echo "📱 test-apk.sh - APK 测试工具"
        echo "🚀 quick-test.sh - 快速测试启动器 (当前脚本)"
        echo ""
        
        # 列出文件
        echo "📁 当前目录中的相关文件:"
        ls -la *.md *.sh 2>/dev/null | grep -E "\.(md|sh)$" || echo "未找到指南文件"
        
        echo ""
        read -p "按回车键返回主菜单..."
        exec "$0"  # 重新运行脚本
        ;;
        
    0)
        echo "👋 退出测试工具"
        exit 0
        ;;
        
    *)
        echo "❌ 无效选择，请重新运行脚本"
        exit 1
        ;;
esac

echo ""
echo "🎉 测试环境准备完成！"
echo ""
echo "💡 提示:"
echo "- 浏览器测试适合快速开发和 UI 调试"
echo "- 物理设备测试提供最真实的用户体验"
echo "- 如需帮助，请查看相应的指南文档"
echo ""
echo "祝您测试愉快！ 🎮"