#!/bin/bash

# Nome do alias
ALIAS_NAME="dcli"

# Comando do alias
ALIAS_COMMAND="docker compose -f docker-compose.cli.yml run --rm"

# Arquivo onde o alias será adicionado
ALIAS_FILE="$HOME/.bash_aliases"

# Verifica se o arquivo de aliases existe; caso contrário, cria-o
if [ ! -f "$ALIAS_FILE" ]; then
  touch "$ALIAS_FILE"
  echo "Arquivo $ALIAS_FILE criado."
fi

# Verifica se o alias já existe
if grep -q "alias $ALIAS_NAME=" "$ALIAS_FILE"; then
  echo "O alias '$ALIAS_NAME' já existe."
else
  # Adiciona o alias ao arquivo
  echo "alias $ALIAS_NAME='$ALIAS_COMMAND'" >> "$ALIAS_FILE"
  echo "Alias '$ALIAS_NAME' adicionado ao arquivo $ALIAS_FILE."
fi

# Recarrega o arquivo de aliases para aplicar as mudanças
if [ -f "$HOME/.bashrc" ]; then
  source "$HOME/.bashrc"
fi
# shellcheck disable=SC1090
source "$ALIAS_FILE"

echo "Agora você pode usar '$ALIAS_NAME'."