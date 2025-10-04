import { 
  Client, 
  Product, 
  Service, 
  Material, 
  User 
} from '../models/index.js';

export const seedTestData = async () => {
  try {
    console.log('\n🌱 Iniciando carga de datos de prueba...');

    // 1. Crear clientes de prueba
    const clients = await Client.bulkCreate([
      {
        name: 'Mynor Estrada',
        email: 'mynorestrada454@gmail.com',
        phone: '123-456-7890',
        address: 'Guatemala City, GT'
      },
      {
        name: 'María González',
        email: 'maria.gonzalez@email.com',
        phone: '098-765-4321',
        address: 'Antigua Guatemala, GT'
      },
      {
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@email.com',
        phone: '555-123-4567',
        address: 'Quetzaltenango, GT'
      },
      {
        name: 'Ana López',
        email: 'ana.lopez@email.com',
        phone: '777-888-9999',
        address: 'Escuintla, GT'
      }
    ]);
    console.log(`✅ ${clients.length} clientes creados`);

    // 2. Crear empleados de prueba
    const employees = await User.bulkCreate([
      {
        name: 'Juan Pérez',
        email: 'juan.perez@iccsa.com',
        password: 'empleado123',
        roleId: 2 // empleado
      },
      {
        name: 'Laura Martínez',
        email: 'laura.martinez@iccsa.com',
        password: 'empleado123',
        roleId: 2 // empleado
      }
    ]);
    console.log(`✅ ${employees.length} empleados creados`);

    // 3. Crear productos de prueba
    const products = await Product.bulkCreate([
      {
        name: 'Tarjetas de Presentación',
        description: 'Tarjetas de presentación profesionales en papel couché',
        basePrice: 50.00
      },
      {
        name: 'Volantes Publicitarios',
        description: 'Volantes promocionales a todo color',
        basePrice: 25.00
      },
      {
        name: 'Banners Vinílicos',
        description: 'Banners impresos en vinilo de alta calidad',
        basePrice: 75.00
      },
      {
        name: 'Carpetas Corporativas',
        description: 'Carpetas institucionales con logo personalizado',
        basePrice: 35.00
      },
      {
        name: 'Calendarios',
        description: 'Calendarios de escritorio personalizados',
        basePrice: 45.00
      }
    ]);
    console.log(`✅ ${products.length} productos creados`);

    // 4. Crear servicios de prueba
    const services = await Service.bulkCreate([
      {
        name: 'Diseño Gráfico',
        description: 'Servicio de diseño gráfico personalizado',
        price: 100.00
      },
      {
        name: 'Impresión Digital',
        description: 'Servicio de impresión digital de alta calidad',
        price: 15.00
      },
      {
        name: 'Laminado',
        description: 'Servicio de laminado para protección de documentos',
        price: 5.00
      },
      {
        name: 'Encuadernación',
        description: 'Servicio de encuadernación profesional',
        price: 20.00
      },
      {
        name: 'Troquelado',
        description: 'Servicio de troquelado personalizado',
        price: 30.00
      }
    ]);
    console.log(`✅ ${services.length} servicios creados`);

    // 5. Crear materiales de prueba
    const materials = await Material.bulkCreate([
      {
        name: 'Papel Couché 150g',
        unitCost: 0.05,
        unit: 'hoja'
      },
      {
        name: 'Papel Bond 75g',
        unitCost: 0.02,
        unit: 'hoja'
      },
      {
        name: 'Vinilo Adhesivo',
        unitCost: 2.50,
        unit: 'metro'
      },
      {
        name: 'Tinta CMYK',
        unitCost: 15.00,
        unit: 'cartucho'
      },
      {
        name: 'Laminado Mate',
        unitCost: 1.20,
        unit: 'metro'
      }
    ]);
    console.log(`✅ ${materials.length} materiales creados`);

    console.log('\n🎉 ¡Datos de prueba cargados exitosamente!');
    console.log('📊 Resumen de datos creados:');
    console.log(`   • ${clients.length} Clientes`);
    console.log(`   • ${employees.length} Empleados`);
    console.log(`   • ${products.length} Productos`);
    console.log(`   • ${services.length} Servicios`);
    console.log(`   • ${materials.length} Materiales`);
    console.log('\n💡 El sistema está listo para que crees cotizaciones manualmente');

  } catch (error) {
    console.error('❌ Error cargando datos de prueba:', error);
    throw error;
  }
};

export default seedTestData;