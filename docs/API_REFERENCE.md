# API Reference

## Endpoints

### GET /api/status
Health check endpoint to verify backend connectivity.

**Response**
\`\`\`json
{
  "success": true,
  "message": "Samosa House API is running",
  "data": {
    "status": "ok"
  }
}
\`\`\`

### GET /api/menu
Retrieves the complete, structured menu data including categories and items.

**Response**
\`\`\`json
{
  "success": true,
  "data": {
    "schemaVersion": 1,
    "currency": "USD",
    "menuType": "restaurant",
    "publicationStatus": "draft",
    "isProvisional": true,
    "categories": [
      {
        "id": "appetizers",
        "name": "Appetizers",
        "description": "",
        "sortOrder": 1,
        "items": [
          {
            "id": "samosa",
            "name": "Samosa",
            "description": "",
            "basePriceCents": 225,
            "priceStatus": "needs-confirmation",
            "image": "/images/menu/samosa.webp",
            "dietary": [],
            "spicy": false,
            "allergens": [],
            "available": true,
            "sortOrder": 1,
            "needsReview": true
          }
        ]
      }
    ]
  }
}
\`\`\`
