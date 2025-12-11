const PDFDocument = require("pdfkit");

const generateInvoice = (order, res) => {
  const doc = new PDFDocument({ bufferPages: true });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id.toString()}.pdf`
  );

  doc.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("PDF generation error", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Invoice generation failed" });
    }
    try {
      doc.end();
    } catch (_) {
      /* ignore */
    }
  });

  doc.pipe(res);

  doc.fontSize(20).text("Grocery Order Invoice", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.text(`Status: ${order.status}`);
  if (order.delivery?.trackingId || order.delivery?.courier || order.delivery?.expectedDate) {
    doc.moveDown();
    doc.text(`Courier: ${order.delivery?.courier || "N/A"}`);
    doc.text(`Tracking: ${order.delivery?.trackingId || "N/A"}`);
    if (order.delivery?.expectedDate)
      doc.text(`Expected: ${new Date(order.delivery.expectedDate).toLocaleDateString()}`);
  }
  doc.moveDown();
  doc.text(`Ship To: ${order.address?.line1 || ""}`);
  if (order.address?.line2) doc.text(order.address.line2);
  doc.text(
    `${order.address?.city || ""}, ${order.address?.state || ""} ${order.address?.postalCode || ""}`
  );
  doc.text(order.address?.country || "");
  doc.moveDown();

  doc.text("Items:");
  (order.items || []).forEach((item) => {
    doc
      .text(
        `- ${item.name || "Item"} (${item.quantity || 1} x ${
          item.discountPrice || item.price || 0
        } ${item.unit || ""})`
      )
      .moveDown(0.2);
  });
  doc.moveDown();
  const subtotal = Number(order.subtotal || 0);
  const tax = Number(order.tax || 0);
  const deliveryFee = Number(order.deliveryFee || 0);
  const total = Number(order.total || subtotal + tax + deliveryFee);
  doc.text(`Subtotal: ${subtotal.toFixed(2)}`);
  doc.text(`Tax: ${tax.toFixed(2)}`);
  doc.text(`Delivery: ${deliveryFee.toFixed(2)}`);
  doc.text(`Total: ${total.toFixed(2)}`);
  doc.end();
};

module.exports = { generateInvoice };

