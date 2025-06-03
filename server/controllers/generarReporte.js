import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import Mensaje from "../models/mensajes.js";

// Función para generar el PDF con los productos
function generarReportePDF(productos, nombreArchivo) {
  const doc = new PDFDocument({ margin: 50 });
  const filePath = path.resolve(`./reportes/${nombreArchivo}`);
  doc.pipe(fs.createWriteStream(filePath));

  const fechaPedido = new Date().toLocaleDateString();
  const fechaEntrega = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString();

  // --- ENCABEZADO ---
  doc.rect(0, 0, doc.page.width, 100).fill('#2c3e50');
  doc.fillColor('#ecf0f1').fontSize(24).font('Helvetica-Bold').text('FULL HACKS CORP', 50, 35, { align: 'left' });
  doc.fillColor('#bdc3c7').fontSize(12).text('Reporte de Productos', 50, 65);
  doc.moveDown(2);

  // --- INFORMACIÓN DEL PEDIDO ---
  doc.fillColor('#000000').fontSize(10)
     .text(`Fecha de pedido: ${fechaPedido}`, { continued: true })
     .text(`   |   Fecha de entrega: ${fechaEntrega}`, { align: 'left' });
  doc.moveDown(1.5);

  // --- TABLA DE PRODUCTOS ---
  doc.fillColor('#ffffff').rect(50, 180, doc.page.width - 100, 25).fill('#3498db');
  doc.fontSize(12).font('Helvetica-Bold')
     .text('Producto', 60, 185)
     .text('Cantidad', 250, 185)
     .text('Precio Unit.', 350, 185)
     .text('Total', 450, 185);

  let y = 210;
  let totalGeneral = 0;

  Object.entries(productos).forEach(([producto, datos], index) => {
    const total = datos.cantidad * datos.precio;
    totalGeneral += total;

    doc.fillColor(index % 2 === 0 ? '#f8f9fa' : '#ffffff')
       .rect(50, y, doc.page.width - 100, 25)
       .fill();

    doc.fillColor('#000000')
       .fontSize(10)
       .font('Helvetica')
       .text(producto, 60, y + 5)
       .text(datos.cantidad.toString(), 250, y + 5)
       .text(`$${datos.precio.toFixed(2)}`, 350, y + 5)
       .text(`$${total.toFixed(2)}`, 450, y + 5);

    y += 25;
  });

  // Total general
  doc.fillColor('#e74c3c').rect(50, y, doc.page.width - 100, 30).fill();
  doc.fillColor('#ffffff')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text('TOTAL GENERAL', 60, y + 8)
     .text(`$${totalGeneral.toFixed(2)}`, 450, y + 8);

  // --- PIE DE PÁGINA ---
  doc.fillColor('#7f8c8d').fontSize(8)
     .text('© 2023 Full Hacks Corporation - Todos los derechos reservados', 
           50, doc.page.height - 50, { align: 'center' });

  doc.strokeColor('#bdc3c7')
     .lineWidth(1)
     .moveTo(50, doc.page.height - 60)
     .lineTo(doc.page.width - 50, doc.page.height - 60)
     .stroke();

  doc.end();
  return filePath;
}

// Controlador principal
export const generarReporteMensajes = async (req, res) => {
  const { usuario1, usuario2 } = req.params;

  try {
    const mensajes = await Mensaje.find({
      $or: [
        { remitente: usuario1, destinatario: usuario2 },
        { remitente: usuario2, destinatario: usuario1 }
      ]
    }).sort({ timestamp: 1 });

    const mensajesTexto = mensajes
      .filter(m => m.mensaje)
      .map(m => m.mensaje);

    const mensajesProductos = mensajesTexto.filter(text => /[a-zA-Z]+:\s*\d+/.test(text));
    const productos = {};

    mensajesProductos.forEach(mensaje => {
      const items = mensaje.split(',');
      items.forEach(item => {
        const [nombre, cantidad] = item.split(':').map(str => str.trim());
        if (nombre && cantidad && !isNaN(cantidad)) {
          if (productos[nombre]) {
            productos[nombre] += Number(cantidad);
          } else {
            productos[nombre] = Number(cantidad);
          }
        }
      });
    });

    // Añadir precio simulado a cada producto
    const productosPDF = {};
    Object.entries(productos).forEach(([nombre, cantidad]) => {
      productosPDF[nombre] = {
        cantidad,
        precio: Math.floor(Math.random() * 5 + 1) + 0.99 // precio aleatorio
      };
    });

    const nombreArchivo = `reporte_${usuario1}_y_${usuario2}.pdf`;
    const rutaArchivo = generarReportePDF(productosPDF, nombreArchivo);

    // Devolver el archivo al cliente
    res.status(201).json({
      "message":"Reporte Creado con Éxito",
      "nombre":nombreArchivo, 
      "ruta": rutaArchivo
    })
      
     res.status(500).json({ error: 'Error al enviar el reporte PDF' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar el reporte de mensajes' });
  }
};
