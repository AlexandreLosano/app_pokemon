@echo off
title Pokemon Explorer
cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel%==0 (
    set PYCMD=python
    goto :run
)

where python3 >nul 2>nul
if %errorlevel%==0 (
    set PYCMD=python3
    goto :run
)

echo.
echo  ============================================================
echo   Python nao foi encontrado no seu computador.
echo.
echo   1. Baixe o Python em: https://www.python.org/downloads/
echo   2. Durante a instalacao, marque a opcao "Add Python to PATH"
echo   3. Depois de instalar, execute este arquivo novamente
echo      (de um duplo-clique em "Iniciar - Windows.bat")
echo  ============================================================
echo.
pause
exit /b

:run
echo.
echo  Abrindo o Pokemon Explorer no seu navegador...
echo  NAO FECHE esta janela enquanto estiver usando o app.
echo  Para encerrar, feche esta janela ou pressione Ctrl+C.
echo.
start "" http://localhost:1989
%PYCMD% server.py
pause
