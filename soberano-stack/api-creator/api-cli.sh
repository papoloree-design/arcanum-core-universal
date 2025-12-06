#!/bin/bash
# SOBERANO GLOBAL API CREATOR CLI

set -e

ACTION="$1"
shift

case "$ACTION" in
    create)
        NAME="$1"
        CATEGORY="$2"
        
        if [ -z "$NAME" ] || [ -z "$CATEGORY" ]; then
            echo "Uso: $0 create <name> <category>"
            echo "Ejemplo: $0 create weather global"
            exit 1
        fi
        
        echo "Creating API: $NAME in category $CATEGORY"
        echo "Edit the handler in the script below..."
        
        cat > "api-creator/custom-${NAME}.js" <<EOF
import { globalAPI } from './global-api-engine.js';

await globalAPI.createAPI({
  name: '$NAME',
  category: '$CATEGORY',
  method: 'GET',
  description: 'Custom API: $NAME',
  handler: async (data) => {
    // TODO: Implement your logic here
    return {
      api: '$NAME',
      category: '$CATEGORY',
      data: data,
      timestamp: Date.now()
    };
  }
});

console.log('✅ API created: $CATEGORY/$NAME');

// Test
const result = await globalAPI.handleRequest('$CATEGORY/$NAME', {
  test: true
});

console.log('Test result:', result);
EOF
        
        echo "✅ API template created: api-creator/custom-${NAME}.js"
        echo "Run: node api-creator/custom-${NAME}.js"
        ;;
    
    test)
        ENDPOINT="$1"
        DATA="$2"
        
        if [ -z "$ENDPOINT" ]; then
            echo "Uso: $0 test <endpoint> [data_json]"
            echo "Ejemplo: $0 test wallet/list"
            echo "Ejemplo: $0 test mining/price '{\"coin\":\"bitcoin\"}'"
            exit 1
        fi
        
        node -e "
        import { globalAPI } from './api-creator/global-api-engine.js';
        
        const data = $DATA || {};
        const result = await globalAPI.handleRequest('$ENDPOINT', data, { verbose: true });
        console.log('Result:', JSON.stringify(result, null, 2));
        "
        ;;
    
    list)
        CATEGORY="$1"
        
        if [ -z "$CATEGORY" ]; then
            echo "Listing all APIs..."
            node -e "
            import { globalAPI } from './api-creator/global-api-engine.js';
            const apis = globalAPI.listAPIs();
            console.log('Total APIs:', apis.length);
            console.log('');
            apis.forEach(api => {
                console.log(\`  \${api.path}\`);
                console.log(\`    Category: \${api.category}\`);
                console.log(\`    Method: \${api.method}\`);
                console.log(\`    Description: \${api.description}\`);
                console.log('');
            });
            "
        else
            echo "Listing APIs in category: $CATEGORY"
            node -e "
            import { globalAPI } from './api-creator/global-api-engine.js';
            const apis = globalAPI.listAPIs('$CATEGORY');
            console.log('APIs in $CATEGORY:', apis.length);
            console.log('');
            apis.forEach(api => {
                console.log(\`  \${api.path}\`);
                console.log(\`    Description: \${api.description}\`);
                console.log('');
            });
            "
        fi
        ;;
    
    categories)
        node -e "
        import { globalAPI } from './api-creator/global-api-engine.js';
        const categories = globalAPI.listCategories();
        console.log('Categories:');
        categories.forEach(cat => console.log('  -', cat));
        "
        ;;
    
    status)
        node -e "
        import { globalAPI } from './api-creator/global-api-engine.js';
        const status = await globalAPI.handleRequest('system/status');
        console.log('System Status:');
        console.log('  Status:', status.status);
        console.log('  Categories:', status.categories.length);
        console.log('  Total APIs:', status.totalAPIs);
        console.log('  Uptime:', status.uptime.toFixed(2), 'seconds');
        "
        ;;
    
    examples)
        echo "Running examples..."
        node api-creator/examples.js
        ;;
    
    export)
        OUTPUT="${1:-api-config.json}"
        
        node -e "
        import { globalAPI } from './api-creator/global-api-engine.js';
        globalAPI.saveConfig('$OUTPUT');
        "
        
        echo "✅ Config exported to: $OUTPUT"
        ;;
    
    *)
        echo "SOBERANO GLOBAL API CREATOR CLI"
        echo ""
        echo "Uso: $0 <action> [args]"
        echo ""
        echo "Actions:"
        echo "  create <name> <category>       - Create new API"
        echo "  test <endpoint> [data]         - Test an endpoint"
        echo "  list [category]                - List APIs"
        echo "  categories                     - List categories"
        echo "  status                         - System status"
        echo "  examples                       - Run examples"
        echo "  export [file]                  - Export config"
        echo ""
        echo "Examples:"
        echo "  $0 create weather global"
        echo "  $0 test mining/price '{\"coin\":\"bitcoin\"}'"
        echo "  $0 list wallet"
        echo "  $0 status"
        exit 1
        ;;
esac
