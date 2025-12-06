#!/bin/bash
# CoinFactory Bridge CLI

set -e

ACTION="$1"
shift

case "$ACTION" in
    bridge)
        TOKEN="$1"
        FROM_CHAIN="$2"
        TO_CHAIN="$3"
        FROM_ADDR="$4"
        TO_ADDR="$5"
        AMOUNT="$6"
        
        if [ -z "$TOKEN" ] || [ -z "$FROM_CHAIN" ] || [ -z "$TO_CHAIN" ] || [ -z "$FROM_ADDR" ] || [ -z "$TO_ADDR" ] || [ -z "$AMOUNT" ]; then
            echo "Uso: $0 bridge <token> <from_chain> <to_chain> <from_addr> <to_addr> <amount>"
            echo "Ejemplo: $0 bridge 0x123... polygon sovereign 0xabc... 0xdef... 100"
            exit 1
        fi
        
        node -e "
        import { CoinfactoryBridge } from './bridge/coinfactory-bridge.js';
        const bridge = new CoinfactoryBridge();
        const transferId = bridge.bridgeToken(
            '$TOKEN',
            '$FROM_CHAIN',
            '$TO_CHAIN',
            '$FROM_ADDR',
            '$TO_ADDR',
            '$AMOUNT'
        );
        console.log('Transfer ID:', transferId);
        "
        ;;
    
    status)
        TRANSFER_ID="$1"
        
        if [ -z "$TRANSFER_ID" ]; then
            echo "Uso: $0 status <transfer_id>"
            exit 1
        fi
        
        node -e "
        import { CoinfactoryBridge } from './bridge/coinfactory-bridge.js';
        const bridge = new CoinfactoryBridge();
        const status = bridge.getTransferStatus('$TRANSFER_ID');
        console.log('Status:', status.status);
        console.log('Progress:', status.progress + '%');
        console.log('Confirmations:', status.confirmations + '/' + status.required);
        "
        ;;
    
    history)
        ADDRESS="$1"
        
        node -e "
        import { CoinfactoryBridge } from './bridge/coinfactory-bridge.js';
        const bridge = new CoinfactoryBridge();
        const history = bridge.getHistory('$ADDRESS');
        console.log('Bridge History:');
        history.forEach(t => {
            console.log('  ID:', t.id);
            console.log('  From:', t.fromChain, '->', t.toChain);
            console.log('  Amount:', t.amount);
            console.log('  Status:', t.status);
            console.log('  ---');
        });
        "
        ;;
    
    fees)
        AMOUNT="$1"
        FROM_CHAIN="$2"
        TO_CHAIN="$3"
        
        if [ -z "$AMOUNT" ]; then
            echo "Uso: $0 fees <amount> [from_chain] [to_chain]"
            exit 1
        fi
        
        node -e "
        import { CoinfactoryBridge } from './bridge/coinfactory-bridge.js';
        const bridge = new CoinfactoryBridge();
        const fees = bridge.calculateFees('$AMOUNT', '$FROM_CHAIN', '$TO_CHAIN');
        console.log('Amount:', '$AMOUNT');
        console.log('Total Fee:', fees.totalFee);
        console.log('Fee Amount:', fees.feeAmount);
        console.log('Net Amount:', fees.netAmount);
        "
        ;;
    
    stats)
        node -e "
        import { CoinfactoryBridge } from './bridge/coinfactory-bridge.js';
        const bridge = new CoinfactoryBridge();
        const stats = bridge.getStats();
        console.log('Bridge Statistics:');
        console.log('Total Transfers:', stats.totalTransfers);
        console.log('Completed:', stats.completed);
        console.log('Pending:', stats.pending);
        console.log('Success Rate:', stats.successRate);
        console.log('Volume by Chain:', JSON.stringify(stats.volumeByChain, null, 2));
        "
        ;;
    
    *)
        echo "CoinFactory Bridge CLI"
        echo ""
        echo "Uso: $0 <action> [args]"
        echo ""
        echo "Actions:"
        echo "  bridge <token> <from> <to> <from_addr> <to_addr> <amount>  - Iniciar bridge"
        echo "  status <transfer_id>                                        - Ver estado"
        echo "  history [address]                                           - Ver historial"
        echo "  fees <amount> [from_chain] [to_chain]                       - Calcular fees"
        echo "  stats                                                        - Estadísticas"
        exit 1
        ;;
esac
