#!/bin/bash
cd "$(dirname "$0")"

if ! command -v python3 &> /dev/null; then
    echo ""
    echo "============================================================"
    echo " Python 3 nao foi encontrado no seu computador."
    echo ""
    echo " 1. Baixe em: https://www.python.org/downloads/"
    echo " 2. Instale e depois execute este arquivo novamente"
    echo "    (de um duplo-clique em 'Iniciar - Mac.command')"
    echo "============================================================"
    echo ""
    read -p "Pressione Enter para sair..."
    exit 1
fi

echo ""
echo "Abrindo o Pokemon Explorer no seu navegador..."
echo "NAO FECHE esta janela enquanto estiver usando o app."
echo "Para encerrar, feche esta janela ou pressione Ctrl+C."
echo ""

( sleep 1 && open http://localhost:1989 ) &
python3 server.py
