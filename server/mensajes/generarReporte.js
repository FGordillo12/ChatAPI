import PDFDocument from 'pdfkit';
import fs from 'fs';

const productos = { 
  Arroz: { cantidad: 5, precio: 2.50 }, 
  Café: { cantidad: 8, precio: 3.75 }, 
  Licuados: { cantidad: 10, precio: 4.20 } 
};

const fechaPedido = new Date().toLocaleDateString();
const fechaEntrega = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString();

function generarReportePDF(nombreArchivo) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(nombreArchivo));

  // --- ENCABEZADO ---
  // Fondo de color para el encabezado
  doc.rect(0, 0, doc.page.width, 100).fill('#2c3e50');
  
  // Logo (texto simulado)
  doc.fillColor('#ecf0f1')
     .fontSize(24)
     .font('Helvetica-Bold')
     .text('FULL HACKS CORP', 50, 35, { align: 'left' });
  
  // Subtítulo
  doc.fillColor('#bdc3c7')
     .fontSize(12)
     .text('Reporte de Productos', 50, 65);
  
  doc.moveDown(2);

  // --- INFORMACIÓN DEL PEDIDO ---
  doc.fillColor('#000000') // Negro para el texto normal
     .fontSize(10)
     .text(`Fecha de pedido: ${fechaPedido}`, { continued: true })
     .text(`   |   Fecha de entrega: ${fechaEntrega}`, { align: 'left' });
  
  doc.moveDown(1.5);

  // --- TABLA DE PRODUCTOS ---
  // Encabezado de tabla
  doc.fillColor('#ffffff')
     .rect(50, 180, doc.page.width - 100, 25)
     .fill('#3498db');
  
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text('Producto', 60, 185)
     .text('Cantidad', 250, 185)
     .text('Precio Unit.', 350, 185)
     .text('Total', 450, 185);
  
  // Filas de productos
  let y = 210;
  let totalGeneral = 0;
  
  Object.entries(productos).forEach(([producto, datos], index) => {
    const total = datos.cantidad * datos.precio;
    totalGeneral += total;
    
    // Fondo alternado para filas
    doc.fillColor(index % 2 === 0 ? '#f8f9fa' : '#ffffff')
       .rect(50, y, doc.page.width - 100, 25)
       .fill();
    
    // Contenido de la fila
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
  doc.fillColor('#e74c3c')
     .rect(50, y, doc.page.width - 100, 30)
     .fill();
  
  doc.fillColor('#ffffff')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text('TOTAL GENERAL', 60, y + 8)
     .text(`$${totalGeneral.toFixed(2)}`, 450, y + 8);
  
  // --- PIE DE PÁGINA ---
  doc.fillColor('#7f8c8d')
     .fontSize(8)
     .text('© 2023 Full Hacks Corporation - Todos los derechos reservados', 
           50, doc.page.height - 50, { align: 'center' });
  
  // Línea decorativa
  doc.strokeColor('#bdc3c7')
     .lineWidth(1)
     .moveTo(50, doc.page.height - 60)
     .lineTo(doc.page.width - 50, doc.page.height - 60)
     .stroke();
  
  doc.end();
  console.log(`PDF generado con estilos: ${nombreArchivo}`);
}

generarReportePDF('reporte_estilizado.pdf');