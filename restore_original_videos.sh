#!/bin/bash

# 万象行者 - 恢复原始视频文件脚本
# 用于PWA Builder测试完成后恢复完整版本

echo "🎮 万象行者 - 恢复原始视频文件"
echo "======================================"

# 检查备份是否存在
if [ ! -d "game/videos_backup" ] && [ ! -d "game/videos_original" ]; then
    echo "❌ 错误: 未找到视频备份文件"
    echo "   请确保之前运行过 create_lite_version.sh"
    exit 1
fi

# 移除轻量版本
echo "🗑️  移除轻量版本..."
if [ -d "game/videos" ]; then
    rm -rf game/videos
    echo "   ✅ 轻量版本已移除"
fi

# 恢复原始视频
echo "📦 恢复原始视频文件..."
if [ -d "game/videos_original" ]; then
    mv game/videos_original game/videos
    echo "   ✅ 从 videos_original 恢复"
elif [ -d "game/videos_backup" ]; then
    cp -r game/videos_backup game/videos
    echo "   ✅ 从 videos_backup 恢复"
fi

# 检查恢复后的大小
echo "📊 检查恢复后的大小:"
du -sh game/videos
du -sh .

echo ""
echo "✅ 原始视频文件已恢复！"
echo ""
echo "📋 下一步操作:"
echo "1. 提交更改到GitHub:"
echo "   git add ."
echo "   git commit -m '恢复原始视频文件'"
echo "   git push origin main"
echo ""
echo "2. 如果PWA Builder测试失败，推荐使用:"
echo "   📖 Capacitor方案: 查看 CAPACITOR_APK_GUIDE.md"
echo "   🔧 问题排查: 查看 PWA_BUILDER_TROUBLESHOOTING.md"
echo ""
echo "3. 清理备份文件 (可选):"
echo "   rm -rf game/videos_backup"
echo ""
echo "🎯 项目现在已恢复到完整版本，包含所有850MB视频文件"