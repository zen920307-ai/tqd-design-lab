@echo off
chcp 65001 >nul
title 拯的个人网站服务器
cd /d "E:\拯的个人网站\zen"

echo ==========================================
echo   拯的个人网站
echo   服务器正在启动，浏览器会自动打开...
echo   地址: http://127.0.0.1:4317/
echo   （保持此窗口打开 = 网站在线）
echo ==========================================
echo.

REM 3秒后用默认浏览器打开（后台，不阻塞）
start /b "" cmd /c "timeout /t 3 >nul & rundll32.exe url.dll,FileProtocolHandler http://127.0.0.1:4317/"

REM 前台运行服务器
npx vite preview --host 127.0.0.1 --port 4317 --strictPort

echo.
echo 服务器已停止。按任意键关闭窗口...
pause >nul
