# Vault Soberano

Almacenamiento seguro de claves privadas, seeds y secretos.

## Características

- ✅ Encriptación AES-256-GCM
- ✅ Key derivation con PBKDF2
- ✅ Sin dependencias externas
- ✅ Base de datos local (vault.db)

## Uso

### Configurar password

```bash
export VAULT_PASSWORD="tu-password-super-seguro"
```

### Agregar secreto

```bash
./vault/vault-cli.sh add DEPLOYER_KEY 0xcfc34891bb...
./vault/vault-cli.sh add SEED "word1 word2 word3..."
```

### Obtener secreto

```bash
./vault/vault-cli.sh get DEPLOYER_KEY
```

### Listar keys

```bash
./vault/vault-cli.sh list
```

## Seguridad

⚠️ **IMPORTANTE:**
- Cambia `VAULT_PASSWORD` por defecto
- No subas `vault.db` al repositorio
- Backup `vault.db` en lugar seguro offline
- Considera usar hardware security module (HSM) para producción
