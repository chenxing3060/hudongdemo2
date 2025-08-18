#!/bin/bash

# 万象行者 - PWA Builder 轻量版本创建脚本
# 用于解决PWA Builder大文件限制问题

echo "🎮 万象行者 - 创建PWA Builder轻量版本"
echo "========================================"

# 检查ffmpeg是否安装
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ 错误: 未找到ffmpeg，请先安装:"
    echo "   brew install ffmpeg"
    exit 1
fi

# 备份原始视频文件
echo "📦 备份原始视频文件..."
if [ -d "game/videos" ] && [ ! -d "game/videos_backup" ]; then
    cp -r game/videos game/videos_backup
    echo "✅ 原始视频已备份到 game/videos_backup"
else
    echo "⚠️  备份已存在或视频目录不存在"
fi

# 创建轻量视频目录
echo "🔧 创建轻量视频目录..."
rm -rf game/videos_lite
mkdir -p game/videos_lite/{bg,cg,ui}

# 创建占位视频文件（1秒黑屏，小文件）
echo "🎬 创建占位视频文件..."

# UI视频 (1个)
ffmpeg -f lavfi -i color=black:size=1280x720:duration=1 -c:v libx264 -crf 30 -an game/videos_lite/ui/ui_opening.mp4 -y -loglevel quiet
echo "   ✅ ui_opening.mp4 (占位)"

# CG视频 (关键剧情，5个)
ffmpeg -f lavfi -i color=black:size=1280x720:duration=1 -c:v libx264 -crf 30 -an game/videos_lite/cg/cg_first_choice.mp4 -y -loglevel quiet
ffmpeg -f lavfi -i color=black:size=1280x720:duration=1 -c:v libx264 -crf 30 -an game/videos_lite/cg/cg_act2_intro.mp4 -y -loglevel quiet
ffmpeg -f lavfi -i color=black:size=1280x720:duration=1 -c:v libx264 -crf 30 -an game/videos_lite/cg/cg_heroine_cute.mp4 -y -loglevel quiet
ffmpeg -f lavfi -i color=black:size=1280x720:duration=1 -c:v libx264 -crf 30 -an game/videos_lite/cg/cg_male_intro_part1.mp4 -y -loglevel quiet
ffmpeg -f lavfi -i color=black:size=1280x720:duration=1 -c:v libx264 -crf 30 -an game/videos_lite/cg/cg_dva_intro.mp4 -y -loglevel quiet
echo "   ✅ 5个CG视频 (占位)"

# BG视频 (背景，4个)
ffmpeg -f lavfi -i color=black:size=1280x720:duration=1 -c:v libx264 -crf 30 -an game/videos_lite/bg/bg_final_choice.mp4 -y -loglevel quiet
ffmpeg -f lavfi -i color=black:size=1280x720:duration=1 -c:v libx264 -crf 30 -an game/videos_lite/bg/bg_dream_prologue.mp4 -y -loglevel quiet
ffmpeg -f lavfi -i color=black:size=1280x720:duration=1 -c:v libx264 -crf 30 -an game/videos_lite/bg/bg_eva_route.mp4 -y -loglevel quiet
ffmpeg -f lavfi -i color=black:size=1280x720:duration=1 -c:v libx264 -crf 30 -an game/videos_lite/bg/bg_ending_partner.mp4 -y -loglevel quiet
echo "   ✅ 4个BG视频 (占位)"

# 替换视频目录
echo "🔄 切换到轻量版本..."
if [ -d "game/videos" ]; then
    mv game/videos game/videos_original
fi
mv game/videos_lite game/videos

# 检查新版本大小
echo "📊 检查轻量版本大小:"
du -sh game/videos
du -sh .

echo ""
echo "✅ 轻量版本创建完成！"
echo ""
echo "📋 下一步操作:"
echo "1. 提交更改到GitHub:"
echo "   git add ."
echo "   git commit -m 'PWA Builder轻量版本测试'"
echo "   git push origin main"
echo ""
echo "2. 等待5分钟让GitHub Pages更新"
echo ""
echo "3. 在PWA Builder中重新测试:"
echo "   https://www.pwabuilder.com/"
echo "   输入: https://chenxing3060.github.io/hudongdemo2/"
echo ""
echo "4. 测试完成后恢复原始版本:"
echo "   ./restore_original_videos.sh"
echo ""
echo "⚠️  注意: 轻量版本只包含占位视频，用于测试PWA Builder兼容性"
echo "   实际游戏体验请使用Capacitor方案 (参考 CAPACITOR_APK_GUIDE.md)"