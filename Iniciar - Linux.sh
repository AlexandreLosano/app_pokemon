#!/bin/bash
cd "$(dirname "$0")"

if ! command -v python3 &> /dev/null; then
    echo ""
    echo "============================================================"
    echo " Python 3 nao foi encontrado no seu computador."
    echo ""
    echo " Instale com o gerenciador de pacotes da sua distro, ex:"
    echo "   Ubuntu/Debian: sudo apt install python3"
    echo "   Fedora:        sudo dnf install python3"
    echo "   Arch:          sudo pacman -S python"
    echo "============================================================"
    echo ""
    read -p "Pressione Enter para sair..."
    exit 1
fi

echo ""
echo "Abrindo o Pokemon Explorer no seu navegador..."
echo "NAO FECHE este terminal enquanto estiver usando o app."
echo "Para encerrar, feche esta janela ou pressione Ctrl+C."
echo ""

( sleep 1 && xdg-open http://localhost:1989 2>/dev/null ) &
python3 server.py
