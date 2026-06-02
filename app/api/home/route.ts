// // app/api/home/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// // ─────────────────────────────────────────────────────────────
// // GET /api/home
// // Returns the most recently created home record.
// // Optional query: /api/home?all=true  → returns all records
// // ─────────────────────────────────────────────────────────────
// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);

//     if (searchParams.get("all") === "true") {
//       const records = await prisma.home.findMany({
//         orderBy: { createdAt: "desc" },
//       });
//       return NextResponse.json({ data: records });
//     }

//     const record = await prisma.home.findFirst({
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ data: record ?? null });
//   } catch (error) {
//     console.error("[GET /api/home]", error);
//     return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // POST /api/home
// // Creates a new record.
// // Body: { name, area1, number1, area2, number2, sattaname, from, to }
// // ─────────────────────────────────────────────────────────────
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const required = ["name", "area1", "number1", "area2", "number2", "sattaname", "from", "to"];
//     for (const field of required) {
//       if (body[field] === undefined || body[field] === "") {
//         return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
//       }
//     }

//     const record = await prisma.home.create({
//       data: {
//         name:      String(body.name),
//         area1:     String(body.area1),
//         number1:   Number(body.number1),
//         area2:     String(body.area2),
//         number2:   Number(body.number2),
//         sattaname: String(body.sattaname),
//         from:      Number(body.from),
//         to:        Number(body.to),
//       },
//     });

//     return NextResponse.json({ data: record }, { status: 201 });
//   } catch (error) {
//     console.error("[POST /api/home]", error);
//     return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // PUT /api/home
// // Updates an existing record by id.
// // Body: { id, ...fields to update }
// // ─────────────────────────────────────────────────────────────
// export async function PUT(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { id, ...rest } = body;

//     if (!id) {
//       return NextResponse.json({ error: "id is required" }, { status: 400 });
//     }

//     const data: Record<string, string | number> = {};
//     if (rest.name      !== undefined) data.name      = String(rest.name);
//     if (rest.area1     !== undefined) data.area1     = String(rest.area1);
//     if (rest.number1   !== undefined) data.number1   = Number(rest.number1);
//     if (rest.area2     !== undefined) data.area2     = String(rest.area2);
//     if (rest.number2   !== undefined) data.number2   = Number(rest.number2);
//     if (rest.sattaname !== undefined) data.sattaname = String(rest.sattaname);
//     if (rest.from      !== undefined) data.from      = Number(rest.from);
//     if (rest.to        !== undefined) data.to        = Number(rest.to);

//     const record = await prisma.home.update({ where: { id }, data });

//     return NextResponse.json({ data: record });
//   } catch (error) {
//     console.error("[PUT /api/home]", error);
//     return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // DELETE /api/home
// // Deletes a record by id.
// // Body: { id }
// // ─────────────────────────────────────────────────────────────
// export async function DELETE(req: NextRequest) {
//   try {
//     const body = await req.json();
//     if (!body.id) {
//       return NextResponse.json({ error: "id is required" }, { status: 400 });
//     }
//     await prisma.home.delete({ where: { id: body.id } });
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("[DELETE /api/home]", error);
//     return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch latest or all records
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    if (all) {
      const records = await prisma.home.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ data: records });
    }

    const record = await prisma.home.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: record ?? null });
  } catch (error) {
    console.error("[GET /api/home]", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST - Create new record (No validation)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const record = await prisma.home.create({
      data: {
        name: String(body.name || ""),
        area1: String(body.area1 || ""),
        number1: Number(body.number1) || 0,
        area2: String(body.area2 || ""),
        number2: Number(body.number2) || 0,
        sattaname: String(body.sattaname || ""),
        from: Number(body.from) || 0,
        to: Number(body.to) || 0,
      },
    });

    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/home]", error);
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
  }
}

// PUT - Update record (Very flexible - can edit any field)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Convert types safely
    const data: any = {};

    if (updateData.name !== undefined) data.name = String(updateData.name);
    if (updateData.area1 !== undefined) data.area1 = String(updateData.area1);
    if (updateData.number1 !== undefined) data.number1 = Number(updateData.number1);
    if (updateData.area2 !== undefined) data.area2 = String(updateData.area2);
    if (updateData.number2 !== undefined) data.number2 = Number(updateData.number2);
    if (updateData.sattaname !== undefined) data.sattaname = String(updateData.sattaname);
    if (updateData.from !== undefined) data.from = Number(updateData.from);
    if (updateData.to !== undefined) data.to = Number(updateData.to);

    const record = await prisma.home.update({
      where: { id },
      data,
    });

    return NextResponse.json({ data: record });
  } catch (error) {
    console.error("[PUT /api/home]", error);
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}

// DELETE - Delete record
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.home.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/home]", error);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}