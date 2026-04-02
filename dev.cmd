@echo off
setlocal

echo Iniciando backend em uma janela separada...
start "VisionBet Backend" cmd /k "cd /d %~dp0backend && npm.cmd run dev"

echo Iniciando frontend nesta janela...
cd /d %~dp0frontend
npm.cmd run dev -- --host 127.0.0.1 --port 5173
