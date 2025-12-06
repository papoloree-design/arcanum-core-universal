# DecX Explorer Wallet

Wallet soberano con control total de claves y firmas.

## Características

- ✅ Creación de wallets
- ✅ Importación de private keys
- ✅ Firma de mensajes
- ✅ Multi-chain (Polygon + Sovereign)
- ✅ Encriptación local
- ✅ Export/Import para backup

## Uso

### Crear Wallet

```bash
./wallet/wallet-cli.sh create "Mi Wallet" "password123"
```

### Importar Wallet

```bash
./wallet/wallet-cli.sh import "Imported" "0xcfc34891bb..." "password123"
```

### Listar Wallets

```bash
./wallet/wallet-cli.sh list
```

### Firmar Mensaje

```bash
./wallet/wallet-cli.sh sign "0xdf0770..." "mensaje" "password123"
```

### Exportar Wallet (Backup)

```bash
./wallet/wallet-cli.sh export "0xdf0770..." "password123"
```

## Programático

```javascript
import { DecxWallet } from './wallet/decx-explorer.js';

const wallet = new DecxWallet();

// Crear
const { address } = wallet.createWallet('Mi Wallet', 'password');

// Firmar
const signature = wallet.sign(address, 'mensaje', 'password');

// Verificar
const valid = wallet.verify(address, 'mensaje', signature.signature);
```

## Seguridad

- Private keys encriptadas con AES-256-GCM
- Password requerido para todas las operaciones
- Storage local (wallets.db)
- Never transmite keys sin encriptar
