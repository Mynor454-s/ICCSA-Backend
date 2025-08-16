// scripts/generateMissingQRs.js
import { Quote, Client } from "../src/models/index.js";
import { generateQuoteQR } from "../src/utils/qrGenerator.js";

/**
 * Script para generar códigos QR para cotizaciones existentes que no los tienen
 */
const generateMissingQRs = async () => {
  try {
    console.log("🔍 Buscando cotizaciones sin código QR...");

    // Encontrar cotizaciones sin código QR
    const quotesWithoutQR = await Quote.findAll({
      where: {
        qrCodeUrl: null
      },
      include: [{ model: Client, attributes: ["name"] }]
    });

    console.log(`📋 Encontradas ${quotesWithoutQR.length} cotizaciones sin código QR`);

    if (quotesWithoutQR.length === 0) {
      console.log("✅ Todas las cotizaciones ya tienen código QR");
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const quote of quotesWithoutQR) {
      try {
        console.log(`🔄 Generando QR para cotización #${quote.id}...`);

        const qrCodeUrl = await generateQuoteQR({
          id: quote.id,
          clientName: quote.Client.name,
          total: quote.total,
          status: quote.status,
          deliveryDate: quote.deliveryDate
        });

        quote.qrCodeUrl = qrCodeUrl;
        await quote.save();

        console.log(`✅ QR generado para cotización #${quote.id}: ${qrCodeUrl}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error generando QR para cotización #${quote.id}:`, error.message);
        errorCount++;
      }
    }

    console.log("\n📊 Resumen:");
    console.log(`✅ Códigos QR generados exitosamente: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📝 Total procesadas: ${quotesWithoutQR.length}`);

  } catch (error) {
    console.error("💥 Error ejecutando el script:", error);
  }
};

// Ejecutar el script si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  generateMissingQRs()
    .then(() => {
      console.log("🎉 Script completado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Error fatal:", error);
      process.exit(1);
    });
}

export default generateMissingQRs;
