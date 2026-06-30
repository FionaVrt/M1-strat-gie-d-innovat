import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

// ── Types ─────────────────────────────────────────────────────────────────────────────────

type Format = "csv" | "json";

type ExportLine = {
  orderId: number;
  date: string;
  status: string;
  productId: number;
  product: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type ExportOrder = {
  orderId: number;
  date: string;
  status: string;
  total: number;
  items: Omit<ExportLine, "orderId" | "date" | "status">[];
};

// ── Validation ──────────────────────────────────────────────────────────────────────────

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseArgs(args: string[]): { format: Format; dateDebut?: Date; dateFin?: Date } | { error: string } {
  const [formatArg, dateDebutArg, dateFinArg] = args;

  const format: Format = (formatArg as Format) ?? "json";
  if (format !== "csv" && format !== "json") {
    return { error: `Format invalide : "${format}". Valeurs acceptées : csv, json.` };
  }

  if (!dateDebutArg && !dateFinArg) {
    return { format };
  }

  if (!dateDebutArg || !dateFinArg) {
    return { error: "Les dates de début et de fin doivent être fournies ensemble." };
  }

  if (!DATE_RE.test(dateDebutArg)) {
    return { error: `Date de début invalide : "${dateDebutArg}". Format attendu : YYYY-MM-DD.` };
  }
  if (!DATE_RE.test(dateFinArg)) {
    return { error: `Date de fin invalide : "${dateFinArg}". Format attendu : YYYY-MM-DD.` };
  }

  const dateDebut = new Date(`${dateDebutArg}T00:00:00.000Z`);
  const dateFin = new Date(`${dateFinArg}T23:59:59.999Z`);

  if (isNaN(dateDebut.getTime())) {
    return { error: `Date de début invalide : "${dateDebutArg}".` };
  }
  if (isNaN(dateFin.getTime())) {
    return { error: `Date de fin invalide : "${dateFinArg}".` };
  }
  if (dateDebut > dateFin) {
    return { error: `La date de début (${dateDebutArg}) doit être antérieure ou égale à la date de fin (${dateFinArg}).` };
  }

  return { format, dateDebut, dateFin };
}

// ── Export ───────────────────────────────────────────────────────────────────────────────

function toLines(orders: Awaited<ReturnType<typeof fetchOrders>>): ExportLine[] {
  const lines: ExportLine[] = [];
  for (const order of orders) {
    for (const item of order.items) {
      lines.push({
        orderId: order.id,
        date: order.createdAt.toISOString(),
        status: order.status,
        productId: item.product.id,
        product: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: Math.round(item.quantity * item.unitPrice * 100) / 100,
      });
    }
  }
  return lines;
}

function toJsonStructure(orders: Awaited<ReturnType<typeof fetchOrders>>): ExportOrder[] {
  return orders.map((order) => ({
    orderId: order.id,
    date: order.createdAt.toISOString(),
    status: order.status,
    total: order.total,
    items: order.items.map((item) => ({
      productId: item.product.id,
      product: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: Math.round(item.quantity * item.unitPrice * 100) / 100,
    })),
  }));
}

function toCsv(lines: ExportLine[]): string {
  const header = "orderId,date,status,productId,product,quantity,unitPrice,lineTotal";
  const rows = lines.map((l) =>
    [
      l.orderId,
      l.date,
      l.status,
      l.productId,
      `"${l.product.replace(/"/g, '""')}"`,
      l.quantity,
      l.unitPrice.toFixed(2),
      l.lineTotal.toFixed(2),
    ].join(",")
  );
  return [header, ...rows].join("\n");
}

// ── Prisma ──────────────────────────────────────────────────────────────────────────────

async function fetchOrders(prisma: PrismaClient, dateDebut?: Date, dateFin?: Date) {
  return prisma.order.findMany({
    where: dateDebut && dateFin
      ? { createdAt: { gte: dateDebut, lte: dateFin } }
      : undefined,
    orderBy: { createdAt: "asc" },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true } },
        },
      },
    },
  });
}

// ── Main ────────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);

  if ("error" in parsed) {
    console.error(`Erreur : ${parsed.error}`);
    process.exit(1);
  }

  const { format, dateDebut, dateFin } = parsed;

  const prisma = new PrismaClient();
  try {
    const orders = await fetchOrders(prisma, dateDebut, dateFin);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const exportsDir = path.resolve(process.cwd(), "exports");
    fs.mkdirSync(exportsDir, { recursive: true });
    const filePath = path.join(exportsDir, `orders-export-${timestamp}.${format}`);

    if (format === "json") {
      const data = toJsonStructure(orders);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } else {
      const lines = toLines(orders);
      fs.writeFileSync(filePath, toCsv(lines), "utf-8");
    }

    console.log(`✓ ${orders.length} commande(s) exportée(s)`);
    console.log(`  Fichier : ${filePath}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
