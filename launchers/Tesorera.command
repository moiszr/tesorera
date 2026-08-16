#!/bin/bash
# Tesorera — doble clic para abrir (macOS).
cd "$(dirname "$0")/.." || exit 1

echo "Abriendo Tesorera…"

# Si hay internet, se actualiza sola. Si no, sigue igual.
git pull --ff-only --quiet 2>/dev/null

if [ ! -d node_modules ] || [ package.json -nt node_modules ]; then
  echo "Instalando lo que hace falta (solo esta vez)…"
  npm install || { echo "No pude instalar. Avísale a Moisés."; read -r; exit 1; }
fi

npm start
