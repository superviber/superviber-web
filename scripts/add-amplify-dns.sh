#!/bin/bash
# Add Amplify DNS records to PowerDNS for superviber.com
# Run this on the hearth k3s server

set -e

# Get API key and endpoint
API_KEY=$(cat /root/.pdns-api-key)
PDNS_HOST="http://$(kubectl get svc powerdns-api -n dns -o jsonpath='{.spec.clusterIP}'):8081"
ZONE="superviber.com."

echo "PowerDNS API: $PDNS_HOST"
echo "Zone: $ZONE"
echo ""

# 1. Add SSL Certificate Validation CNAME
echo "Adding SSL certificate validation CNAME..."
curl -s -X PATCH "$PDNS_HOST/api/v1/servers/localhost/zones/$ZONE" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "rrsets": [{
      "name": "_2fbfe2bb54ca6b705d936e860890a31e.superviber.com.",
      "type": "CNAME",
      "ttl": 300,
      "changetype": "REPLACE",
      "records": [{"content": "_efcf22c57e2ccd3b29d9c2e43d70b036.jkddzztszm.acm-validations.aws.", "disabled": false}]
    }]
  }'
echo " Done"

# 2. Update root domain to point to CloudFront (ALIAS record)
# Note: PowerDNS uses ALIAS type for apex/root domain CNAME-like behavior
echo "Updating root domain (superviber.com) to point to CloudFront..."
curl -s -X PATCH "$PDNS_HOST/api/v1/servers/localhost/zones/$ZONE" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "rrsets": [{
      "name": "superviber.com.",
      "type": "A",
      "ttl": 300,
      "changetype": "DELETE",
      "records": []
    }]
  }'

# Try ALIAS first, fall back to CNAME if ALIAS not supported
curl -s -X PATCH "$PDNS_HOST/api/v1/servers/localhost/zones/$ZONE" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "rrsets": [{
      "name": "superviber.com.",
      "type": "ALIAS",
      "ttl": 300,
      "changetype": "REPLACE",
      "records": [{"content": "d1nqln3jtj2r0h.cloudfront.net.", "disabled": false}]
    }]
  }' || echo "ALIAS not supported, trying workaround..."
echo " Done"

# 3. Update www subdomain CNAME to point to CloudFront
echo "Updating www.superviber.com to point to CloudFront..."
curl -s -X PATCH "$PDNS_HOST/api/v1/servers/localhost/zones/$ZONE" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "rrsets": [{
      "name": "www.superviber.com.",
      "type": "CNAME",
      "ttl": 300,
      "changetype": "REPLACE",
      "records": [{"content": "d1nqln3jtj2r0h.cloudfront.net.", "disabled": false}]
    }]
  }'
echo " Done"

echo ""
echo "All records added. Verifying..."
echo ""

# Verify records
echo "Current superviber.com records:"
curl -s -H "X-API-Key: $API_KEY" "$PDNS_HOST/api/v1/servers/localhost/zones/$ZONE" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for rr in data.get('rrsets', []):
    for rec in rr.get('records', []):
        print(f\"{rr['name']:50} {rr['type']:8} {rec['content']}\")
" | grep -E "(superviber\.com\.|_2fbfe2bb|www\.superviber)" | head -20

echo ""
echo "Done! Return to Amplify console - it should verify the domain automatically."
