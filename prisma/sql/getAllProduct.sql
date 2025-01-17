SELECT p.*, JSON_BUILD_OBJECT(
          'id', d.id,
          'description', d.description
        ) AS detail
        FROM products p
        LEFT JOIN details d ON p.id = d.product_id;