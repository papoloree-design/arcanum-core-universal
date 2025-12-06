#!/bin/bash
# CLI mínimo para interactuar con vault.db
# Uso: ./vault-cli.sh <action> <args...>

set -e

ACTION="$1"
shift

DB_FILE="vault/vault.db"

if [ ! -f "$DB_FILE" ]; then
    echo '{}' > "$DB_FILE"
fi

case "$ACTION" in
    add)
        KEY="$1"
        VALUE="$2"
        
        if [ -z "$KEY" ] || [ -z "$VALUE" ]; then
            echo "Uso: $0 add <key> <value>"
            exit 1
        fi
        
        echo "Agregando '$KEY' al vault..."
        
        node -e "
        import fs from 'fs';
        import { encrypt } from './vault/vault-crypto.js';
        
        const PASSWORD = process.env.VAULT_PASSWORD || 'default-password-change-me';
        const db = JSON.parse(fs.readFileSync('$DB_FILE', 'utf8'));
        
        db['$KEY'] = encrypt('$VALUE', PASSWORD);
        
        fs.writeFileSync('$DB_FILE', JSON.stringify(db, null, 2));
        console.log('✅ Guardado exitosamente');
        "
        ;;
    
    get)
        KEY="$1"
        
        if [ -z "$KEY" ]; then
            echo "Uso: $0 get <key>"
            exit 1
        fi
        
        node -e "
        import fs from 'fs';
        import { decrypt } from './vault/vault-crypto.js';
        
        const PASSWORD = process.env.VAULT_PASSWORD || 'default-password-change-me';
        const db = JSON.parse(fs.readFileSync('$DB_FILE', 'utf8'));
        
        if (!db['$KEY']) {
            console.log('❌ Key no encontrada');
            process.exit(1);
        }
        
        const value = decrypt(db['$KEY'], PASSWORD);
        console.log(value);
        "
        ;;
    
    list)
        echo "Keys en el vault:"
        node -e "
        import fs from 'fs';
        const db = JSON.parse(fs.readFileSync('$DB_FILE', 'utf8'));
        Object.keys(db).forEach(k => console.log('  -', k));
        "
        ;;
    
    *)
        echo "Uso: $0 <action> [args]"
        echo "Actions:"
        echo "  add <key> <value>  - Agregar/actualizar key"
        echo "  get <key>          - Obtener valor"
        echo "  list               - Listar keys"
        echo ""
        echo "Env vars:"
        echo "  VAULT_PASSWORD - Password del vault (default: cambiar)"
        exit 1
        ;;
esac
