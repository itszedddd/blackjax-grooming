import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const pets = await prisma.pet.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                client: true,
                records: {
                    orderBy: { date: "desc" },
                    take: 1
                }
            }
        });
        return NextResponse.json(pets);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 });
    }
}
