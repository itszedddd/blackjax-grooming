import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
    try {
        const { petId, status } = await req.json();

        // Get the latest record for this pet
        const latestRecord = await prisma.record.findFirst({
            where: { petId },
            orderBy: { date: "desc" }
        });

        if (!latestRecord) {
            return NextResponse.json({ error: "No record found for pet" }, { status: 404 });
        }

        // Determine mapped status since PRISMA/DB doesn't restrict it, we can just save it.
        // We will just save the exact string to `status`
        const newRecord = await prisma.record.update({
            where: { id: latestRecord.id },
            data: { status }
        });

        return NextResponse.json(newRecord);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
