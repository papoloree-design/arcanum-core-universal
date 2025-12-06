#!/bin/bash
# DecX Explorer Wallet CLI

set -e

ACTION="$1"
shift

case "$ACTION" in
    create)
        NAME="$1"
        PASSWORD="$2"
        
        if [ -z "$NAME" ] || [ -z "$PASSWORD" ]; then
            echo "Uso: $0 create <name> <password>"
            exit 1
        fi
        
        node -e "
        import { DecxWallet } from './wallet/decx-explorer.js';
        const wallet = new DecxWallet();
        const result = wallet.createWallet('$NAME', '$PASSWORD');
        console.log('Dirección:', result.address);
        console.log('Public Key:', result.publicKey);
        "
        ;;
    
    import)
        NAME="$1"
        PRIVATE_KEY="$2"
        PASSWORD="$3"
        
        if [ -z "$NAME" ] || [ -z "$PRIVATE_KEY" ] || [ -z "$PASSWORD" ]; then
            echo "Uso: $0 import <name> <private_key> <password>"
            exit 1
        fi
        
        node -e "
        import { DecxWallet } from './wallet/decx-explorer.js';
        const wallet = new DecxWallet();
        const result = wallet.importWallet('$NAME', '$PRIVATE_KEY', '$PASSWORD');
        console.log('Wallet importada:', result.address);
        "
        ;;
    
    list)
        node -e "
        import { DecxWallet } from './wallet/decx-explorer.js';
        const wallet = new DecxWallet();
        const wallets = wallet.listWallets();
        console.log('Wallets:');
        wallets.forEach(w => {
            console.log('  -', w.name, ':', w.address);
            console.log('    Polygon:', w.chains.polygon.balance);
            console.log('    Sovereign:', w.chains.sovereign.balance);
        });
        "
        ;;
    
    sign)
        ADDRESS="$1"
        MESSAGE="$2"
        PASSWORD="$3"
        
        if [ -z "$ADDRESS" ] || [ -z "$MESSAGE" ] || [ -z "$PASSWORD" ]; then
            echo "Uso: $0 sign <address> <message> <password>"
            exit 1
        fi
        
        node -e "
        import { DecxWallet } from './wallet/decx-explorer.js';
        const wallet = new DecxWallet();
        const sig = wallet.sign('$ADDRESS', '$MESSAGE', '$PASSWORD');
        console.log('Signature:', sig.signature);
        "
        ;;
    
    export)
        ADDRESS="$1"
        PASSWORD="$2"
        
        if [ -z "$ADDRESS" ] || [ -z "$PASSWORD" ]; then
            echo "Uso: $0 export <address> <password>"
            exit 1
        fi
        
        echo "⚠️  ADVERTENCIA: Esto mostrará tu private key. Úsalo en lugar seguro."
        read -p "Continuar? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            node -e "
            import { DecxWallet } from './wallet/decx-explorer.js';
            const wallet = new DecxWallet();
            const exported = wallet.exportWallet('$ADDRESS', '$PASSWORD');
            console.log(JSON.stringify(exported, null, 2));
            "
        fi
        ;;
    
    *)
        echo "DecX Explorer Wallet CLI"
        echo ""
        echo "Uso: $0 <action> [args]"
        echo ""
        echo "Actions:"
        echo "  create <name> <password>           - Crear nueva wallet"
        echo "  import <name> <key> <password>     - Importar wallet"
        echo "  list                               - Listar wallets"
        echo "  sign <address> <msg> <password>    - Firmar mensaje"
        echo "  export <address> <password>        - Exportar wallet"
        exit 1
        ;;
esac
