const express = require("express");
const PDFDocument = require("pdfkit");
const { format } = require("date-fns");
const { adminOnly, authMiddleware } = require("../middleware/auth");
const Order = require("../models/Order");
const { writeToBuffer } = require("@fast-csv/format");

const router = express.Router();

router.use(authMiddleware, adminOnly);

const aggregateBy = async (range) => {
  const groupId =
    range === "yearly"
      ? { year: { $year: "$createdAt" } }
      : { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };

  const data = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    {
      $group: {
        _id: groupId,
        totalSales: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  return data;
};

router.get("/sales", async (req, res) => {
  const range = req.query.range || "monthly";
  const data = await aggregateBy(range);
  res.json({ range, data });
});

router.get("/sales.csv", async (req, res) => {
  const range = req.query.range || "monthly";
  const data = await aggregateBy(range);
  const rows = data.map((d) => ({
    year: d._id.year,
    month: d._id.month || "",
    orders: d.orders,
    total: d.totalSales,
  }));
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=sales.csv");
  const buffer = await writeToBuffer(rows, { headers: true });
  res.send(buffer);
});

router.get("/sales.pdf", async (req, res) => {
  const range = req.query.range || "monthly";
  const data = await aggregateBy(range);
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=sales.pdf");
  doc.pipe(res);
  doc.fontSize(18).text("Sales Report", { align: "center" });
  doc.fontSize(12).text(`Range: ${range}`);
  doc.moveDown();
  data.forEach((d) => {
    doc.text(
      `${d._id.month ? format(new Date(d._id.year, d._id.month - 1, 1), "MMM yyyy") : d._id.year
      }: Orders ${d.orders} | Total ${d.totalSales.toFixed(2)}`
    );
  });
  doc.end();
});

module.exports = router;

