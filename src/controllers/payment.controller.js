import Payment from "../models/payment.model.js";
import { Quote, Client } from "../models/index.js";
import { updateQuoteQR } from "../utils/qrGenerator.js";
import { Op } from "sequelize";

// Crear un nuevo pago
export const createPayment = async (req, res) => {
  const { quoteId, amount, paymentMethod, transactionReference, notes } = req.body;

  if (!quoteId || !amount || !paymentMethod) {
    return res.status(400).json({ 
      message: "Datos incompletos: quoteId, amount y paymentMethod son requeridos" 
    });
  }

  try {
    // Verificar que la cotización existe
    const quote = await Quote.findByPk(quoteId, {
      include: [{ model: Payment }]
    });

    if (!quote) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }

    // Verificar que la cotización no esté ya entregada
    if (quote.status === "ENTREGADA") {
      return res.status(400).json({ 
        message: "No se pueden agregar pagos a una cotización ya entregada" 
      });
    }

    // Calcular el total pagado hasta ahora
    const totalPaid = quote.Payments?.reduce((sum, payment) => 
      sum + parseFloat(payment.amount), 0) || 0;

    // Verificar que el nuevo pago no exceda el total pendiente
    const remainingAmount = parseFloat(quote.total) - totalPaid;
    const newPaymentAmount = parseFloat(amount);

    if (newPaymentAmount > remainingAmount) {
      return res.status(400).json({ 
        message: `El pago de $${newPaymentAmount} excede el monto pendiente de $${remainingAmount.toFixed(2)}` 
      });
    }

    // Determinar si es pago parcial o completo
    const isCompletePayment = (newPaymentAmount === remainingAmount);
    const paymentType = isCompletePayment ? "COMPLETO" : "PARCIAL";

    // Crear el pago
    const payment = await Payment.create({
      quoteId,
      amount: newPaymentAmount,
      paymentMethod,
      paymentType,
      transactionReference,
      notes,
      status: "CONFIRMADO"
    });

    // Actualizar el estado de la cotización según el pago
    await updateQuoteStatusByPayment(quote, totalPaid + newPaymentAmount);

    res.status(201).json({
      message: "Pago registrado correctamente",
      payment,
      paymentSummary: {
        totalQuote: parseFloat(quote.total),
        totalPaid: totalPaid + newPaymentAmount,
        remainingAmount: remainingAmount - newPaymentAmount,
        isFullyPaid: isCompletePayment
      }
    });

  } catch (error) {
    console.error("Error creando pago:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Listar todos los pagos (uso administrativo)
export const getAllPayments = async (req, res) => {
  try {
    const { 
      page = 1, 
      pageSize = 10, 
      quoteId, 
      status, 
      paymentMethod, 
      dateFrom, 
      dateTo 
    } = req.query;

    // Configurar filtros
    const whereClause = {};
    
    if (quoteId) whereClause.quoteId = quoteId;
    if (status) whereClause.status = status;
    if (paymentMethod) whereClause.paymentMethod = paymentMethod;
    
    // Filtros de fecha
    if (dateFrom || dateTo) {
      whereClause.paymentDate = {};
      if (dateFrom) {
        whereClause.paymentDate[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        // Agregar 23:59:59 al dateTo para incluir todo el día
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        whereClause.paymentDate[Op.lte] = endDate;
      }
    }

    // Configurar paginación
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const { count, rows: payments } = await Payment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Quote,
          attributes: ["id", "total", "status"],
          include: [
            {
              model: Client,
              attributes: ["name", "email"]
            }
          ]
        }
      ],
      order: [["paymentDate", "DESC"]],
      limit,
      offset
    });

    // Calcular totales de la página actual
    const pageTotal = payments.reduce((sum, payment) => 
      sum + parseFloat(payment.amount), 0);

    res.json({
      payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalPayments: count,
        paymentsPerPage: limit,
        pageTotal: pageTotal.toFixed(2)
      },
      filters: {
        quoteId: quoteId || null,
        status: status || null,
        paymentMethod: paymentMethod || null,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null
      }
    });

  } catch (error) {
    console.error("Error obteniendo pagos:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Resumen de pagos por período
export const getPaymentsSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validaciones
    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Los parámetros startDate y endDate son requeridos (formato: YYYY-MM-DD)"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validar fechas válidas
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Formato de fecha inválido. Use YYYY-MM-DD"
      });
    }

    // Validar que startDate <= endDate
    if (start > end) {
      return res.status(400).json({
        message: "startDate debe ser menor o igual a endDate"
      });
    }

    // Ajustar endDate para incluir todo el día
    end.setHours(23, 59, 59, 999);

    // Consulta principal de agregados
    const summaryQuery = await Payment.findAll({
      where: {
        paymentDate: {
          [Op.between]: [start, end]
        },
        status: "CONFIRMADO" // Solo contar pagos confirmados
      },
      attributes: [
        [Payment.sequelize.fn('COUNT', Payment.sequelize.col('id')), 'count'],
        [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'totalAmount'],
        [Payment.sequelize.fn('AVG', Payment.sequelize.col('amount')), 'averageAmount']
      ],
      raw: true
    });

    // Desglose por método de pago
    const paymentMethodBreakdown = await Payment.findAll({
      where: {
        paymentDate: {
          [Op.between]: [start, end]
        },
        status: "CONFIRMADO"
      },
      attributes: [
        'paymentMethod',
        [Payment.sequelize.fn('COUNT', Payment.sequelize.col('id')), 'count'],
        [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'totalAmount']
      ],
      group: ['paymentMethod'],
      raw: true
    });

    // Desglose por tipo de pago
    const paymentTypeBreakdown = await Payment.findAll({
      where: {
        paymentDate: {
          [Op.between]: [start, end]
        },
        status: "CONFIRMADO"
      },
      attributes: [
        'paymentType',
        [Payment.sequelize.fn('COUNT', Payment.sequelize.col('id')), 'count'],
        [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'totalAmount']
      ],
      group: ['paymentType'],
      raw: true
    });

    // Desglose por día (últimos 30 días del período)
    const dailyBreakdown = await Payment.findAll({
      where: {
        paymentDate: {
          [Op.between]: [start, end]
        },
        status: "CONFIRMADO"
      },
      attributes: [
        [Payment.sequelize.fn('DATE', Payment.sequelize.col('paymentDate')), 'date'],
        [Payment.sequelize.fn('COUNT', Payment.sequelize.col('id')), 'count'],
        [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'totalAmount']
      ],
      group: [Payment.sequelize.fn('DATE', Payment.sequelize.col('paymentDate'))],
      order: [[Payment.sequelize.fn('DATE', Payment.sequelize.col('paymentDate')), 'ASC']],
      raw: true
    });

    const summary = summaryQuery[0];

    res.json({
      period: {
        startDate: startDate,
        endDate: endDate,
        daysInPeriod: Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      },
      summary: {
        totalAmount: parseFloat(summary.totalAmount || 0).toFixed(2),
        count: parseInt(summary.count || 0),
        averageAmount: parseFloat(summary.averageAmount || 0).toFixed(2)
      },
      breakdowns: {
        byPaymentMethod: paymentMethodBreakdown.map(item => ({
          method: item.paymentMethod,
          count: parseInt(item.count),
          totalAmount: parseFloat(item.totalAmount).toFixed(2)
        })),
        byPaymentType: paymentTypeBreakdown.map(item => ({
          type: item.paymentType,
          count: parseInt(item.count),
          totalAmount: parseFloat(item.totalAmount).toFixed(2)
        })),
        byDay: dailyBreakdown.map(item => ({
          date: item.date,
          count: parseInt(item.count),
          totalAmount: parseFloat(item.totalAmount).toFixed(2)
        }))
      }
    });

  } catch (error) {
    console.error("Error obteniendo resumen de pagos:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Función auxiliar para actualizar el estado de la cotización
const updateQuoteStatusByPayment = async (quote, totalPaid) => {
  const quoteTotal = parseFloat(quote.total);
  const isFullyPaid = totalPaid >= quoteTotal;

  let newStatus = quote.status;

  // Lógica de estados según el pago
  if (isFullyPaid) {
    if (quote.status === "FINALIZADA") {
      newStatus = "PAGADA";
    }
  } else {
    // Si hay pagos parciales, asegurar que esté al menos en EN_PROCESO
    if (quote.status === "CREADA") {
      newStatus = "ACEPTADA";
    }
  }

  if (newStatus !== quote.status) {
    quote.status = newStatus;
    await quote.save();

    // Regenerar QR si cambió el estado
    try {
      const Client = (await import("../models/index.js")).Client;
      const client = await Client.findByPk(quote.clientId);
      const qrCodeUrl = await updateQuoteQR(quote, client);
      quote.qrCodeUrl = qrCodeUrl;
      await quote.save();
    } catch (qrError) {
      console.error("Error regenerando QR:", qrError);
    }
  }
};

// Obtener todos los pagos de una cotización
export const getPaymentsByQuote = async (req, res) => {
  try {
    const { quoteId } = req.params;

    const quote = await Quote.findByPk(quoteId);
    if (!quote) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }

    const payments = await Payment.findAll({
      where: { quoteId },
      order: [["paymentDate", "DESC"]]
    });

    const totalPaid = payments.reduce((sum, payment) => 
      sum + parseFloat(payment.amount), 0);

    const remainingAmount = parseFloat(quote.total) - totalPaid;

    res.json({
      payments,
      summary: {
        totalQuote: parseFloat(quote.total),
        totalPaid,
        remainingAmount,
        isFullyPaid: remainingAmount <= 0,
        paymentCount: payments.length
      }
    });

  } catch (error) {
    console.error("Error obteniendo pagos:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener un pago específico
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ 
        model: Quote, 
        attributes: ["id", "total", "status"] 
      }]
    });

    if (!payment) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    res.json(payment);
  } catch (error) {
    console.error("Error obteniendo pago:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar un pago (solo notas y referencia de transacción)
export const updatePayment = async (req, res) => {
  try {
    const { notes, transactionReference } = req.body;
    const payment = await Payment.findByPk(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    // Solo permitir actualizar notas y referencia de transacción
    if (notes !== undefined) payment.notes = notes;
    if (transactionReference !== undefined) payment.transactionReference = transactionReference;

    await payment.save();

    res.json({ 
      message: "Pago actualizado correctamente", 
      payment 
    });
  } catch (error) {
    console.error("Error actualizando pago:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Eliminar un pago (solo si la cotización no está entregada)
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Quote }]
    });

    if (!payment) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    if (payment.Quote.status === "ENTREGADA") {
      return res.status(400).json({ 
        message: "No se puede eliminar un pago de una cotización entregada" 
      });
    }

    await payment.destroy();

    // Recalcular el estado de la cotización
    const remainingPayments = await Payment.findAll({
      where: { quoteId: payment.quoteId }
    });

    const totalPaid = remainingPayments.reduce((sum, p) => 
      sum + parseFloat(p.amount), 0);

    await updateQuoteStatusByPayment(payment.Quote, totalPaid);

    res.json({ message: "Pago eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando pago:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Verificar si una cotización puede cambiar a ENTREGADA
export const checkDeliveryEligibility = async (req, res) => {
  try {
    const { quoteId } = req.params;

    const quote = await Quote.findByPk(quoteId, {
      include: [{ model: Payment }]
    });

    if (!quote) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }

    const totalPaid = quote.Payments?.reduce((sum, payment) => 
      sum + parseFloat(payment.amount), 0) || 0;

    const isFullyPaid = totalPaid >= parseFloat(quote.total);

    // ✅ VALIDACIÓN PARA COTIZACIÓN YA ENTREGADA
    if (quote.status === "ENTREGADA") {
      return res.json({
        canDeliver: false, // Ya no puede ser entregada porque ya lo fue
        currentStatus: quote.status,
        totalQuote: parseFloat(quote.total),
        totalPaid,
        isFullyPaid,
        isAlreadyDelivered: true, // ✅ Nueva propiedad
        message: "La cotización ya ha sido entregada exitosamente"
      });
    }

    const canDeliver = isFullyPaid && quote.status === "PAGADA";

    res.json({
      canDeliver,
      currentStatus: quote.status,
      totalQuote: parseFloat(quote.total),
      totalPaid,
      isFullyPaid,
      isAlreadyDelivered: false, // ✅ Nueva propiedad
      message: canDeliver 
        ? "La cotización puede ser marcada como entregada"
        : isFullyPaid 
          ? `La cotización está pagada pero debe estar en estado PAGADA (actual: ${quote.status})`
          : `Faltan Q${(parseFloat(quote.total) - totalPaid).toFixed(2)} por pagar`
    });

  } catch (error) {
    console.error("Error verificando elegibilidad de entrega:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
