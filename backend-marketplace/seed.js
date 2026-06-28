require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('./src/config/database');
const User = require('./src/models/user');
const Category = require('./src/models/category');
const Product = require('./src/models/product');

async function seed() {
  try {
    // Sync tables
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas');

    // ── USUARIOS ──────────────────────────────────────
    const adminHash = await bcrypt.hash('admin123', 10);
    const customerHash = await bcrypt.hash('cliente123', 10);

    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: 'admin@marketplace.com' },
      defaults: { email: 'admin@marketplace.com', passwordHash: adminHash, role: 'ADMIN' },
    });
    console.log(adminCreated ? '✅ Admin creado' : '⚠️  Admin ya existía');

    const [customer, customerCreated] = await User.findOrCreate({
      where: { email: 'cliente@marketplace.com' },
      defaults: { email: 'cliente@marketplace.com', passwordHash: customerHash, role: 'CUSTOMER' },
    });
    if (!customerCreated) {
      // Force update password and role just in case
      await customer.update({ passwordHash: customerHash, role: 'CUSTOMER' });
      console.log('🔄 Customer actualizado con contraseña "cliente123"');
    } else {
      console.log('✅ Customer creado con contraseña "cliente123"');
    }

    // ── CATEGORÍAS ────────────────────────────────────
    const categoriesData = [
      { name: 'Electrónica',  imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
      { name: 'Ropa',         imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400' },
      { name: 'Hogar',        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
      { name: 'Deportes',     imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400' },
    ];

    const createdCategories = [];
    for (const cat of categoriesData) {
      const [category, created] = await Category.findOrCreate({
        where: { name: cat.name },
        defaults: cat,
      });
      createdCategories.push(category);
      console.log(created ? `✅ Categoría "${cat.name}" creada` : `⚠️  Categoría "${cat.name}" ya existía`);
    }

    // ── PRODUCTOS ─────────────────────────────────────
    const catMap = {};
    createdCategories.forEach(cat => { catMap[cat.name] = cat.id; });

    const productsData = [
      {
        nombre: 'Laptop Pro 15"',
        precio: 2499.99,
        descripcion: 'Laptop de alto rendimiento con procesador Intel i7 y 16GB RAM.',
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        categoryId: catMap['Electrónica'],
      },
      {
        nombre: 'Auriculares Bluetooth',
        precio: 199.99,
        descripcion: 'Auriculares inalámbricos con cancelación de ruido activa.',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        categoryId: catMap['Electrónica'],
      },
      {
        nombre: 'Camiseta Básica',
        precio: 39.99,
        descripcion: 'Camiseta 100% algodón, disponible en varios colores.',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        categoryId: catMap['Ropa'],
      },
      {
        nombre: 'Zapatillas Running',
        precio: 129.99,
        descripcion: 'Zapatillas ligeras para correr con suela amortiguada.',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        categoryId: catMap['Ropa'],
      },
      {
        nombre: 'Lámpara de Mesa LED',
        precio: 59.99,
        descripcion: 'Lámpara moderna con luz regulable y puerto USB.',
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
        categoryId: catMap['Hogar'],
      },
      {
        nombre: 'Pelota de Fútbol',
        precio: 49.99,
        descripcion: 'Pelota oficial tamaño 5, resistente a todo clima.',
        imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400',
        categoryId: catMap['Deportes'],
      },
      {
        nombre: 'Laptop Lenovo ThinkPad',
        precio: 4500.00,
        descripcion: 'Laptop corporativa de alta gama',
        imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
        categoryId: catMap['Electrónica'],
      },
      {
        nombre: 'Mouse Inalámbrico Logitech',
        precio: 89.90,
        descripcion: 'Mouse ergonómico con batería de larga duración',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        categoryId: catMap['Electrónica'],
      },
      {
        nombre: 'Monitor LG 27 pulgadas',
        precio: 1200.00,
        descripcion: 'Monitor IPS Full HD para gaming y oficina',
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
        categoryId: catMap['Electrónica'],
      },
      {
        nombre: 'Teclado Mecánico Redragon',
        precio: 250.00,
        descripcion: 'Teclado retroiluminado RGB switches rojos',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
        categoryId: catMap['Electrónica'],
      },
      {
        nombre: 'Audífonos Sony WH-1000XM4',
        precio: 999.00,
        descripcion: 'Audífonos inalámbricos con cancelación de ruido',
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
        categoryId: catMap['Electrónica'],
      },
      {
        nombre: 'Smartwatch Xiaomi Mi Band 8 Pro',
        precio: 229.90,
        descripcion: 'Nueva versión con pantalla más grande',
        imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
        categoryId: catMap['Electrónica'],
      },
      {
        nombre: 'Smartwatch Xiaomi Mi Band 9',
        precio: 199.90,
        descripcion: 'Pulsera inteligente con monitoreo de salud',
        imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400',
        categoryId: catMap['Electrónica'],
      },
    ];

    // Deduplicate products first
    const allProducts = await Product.findAll();
    const seenNames = new Set();
    for (const p of allProducts) {
      if (seenNames.has(p.nombre)) {
        console.log(`🗑️ Eliminando duplicado: "${p.nombre}" (ID: ${p.id})`);
        await p.destroy();
      } else {
        seenNames.add(p.nombre);
      }
    }

    for (const prod of productsData) {
      const [product, created] = await Product.findOrCreate({
        where: { nombre: prod.nombre },
        defaults: prod,
      });
      if (!created) {
        const updates = {};
        if (!product.imageUrl || product.imageUrl !== prod.imageUrl) {
          updates.imageUrl = prod.imageUrl;
        }
        if (!product.categoryId || product.categoryId !== prod.categoryId) {
          updates.categoryId = prod.categoryId;
        }
        if (Object.keys(updates).length > 0) {
          await product.update(updates);
          console.log(`🔄 Producto "${prod.nombre}" actualizado: ${Object.keys(updates).join(', ')}`);
        } else {
          console.log(`⚠️  Producto "${prod.nombre}" ya existía y está al día`);
        }
      } else {
        console.log(`✅ Producto "${prod.nombre}" creado`);
      }
    }


    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Seed completado. Datos de acceso:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 ADMIN    → admin@marketplace.com    / admin123');
    console.log('🛒 CUSTOMER → cliente@marketplace.com  / cliente123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  }
}

seed();
