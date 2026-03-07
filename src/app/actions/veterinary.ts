"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createConsultation(data: FormData) {
    const petId = data.get("petId") as string;
    const notes = data.get("notes") as string;

    if (!petId) return { error: "Pet is required" };

    try {
        await prisma.record.create({
            data: {
                petId,
                serviceType: "Consultation",
                date: new Date(),
                status: "In Consultation",
                notes
            }
        });
        revalidatePath("/veterinary");
        return { success: true };
    } catch (e) {
        return { error: "Failed to create consultation" };
    }
}

export async function createVaccination(petId: string, data: FormData) {
    const name = data.get("name") as string;
    const dateGivenStr = data.get("dateGiven") as string;
    const nextDueDateStr = data.get("nextDueDate") as string;
    const notes = data.get("notes") as string;

    if (!name || !dateGivenStr) return { error: "Vaccine name and date are required" };

    const dateGiven = new Date(dateGivenStr);
    const nextDueDate = nextDueDateStr ? new Date(nextDueDateStr) : null;

    try {
        await prisma.vaccination.create({
            data: {
                petId,
                name,
                dateGiven,
                nextDueDate,
                notes
            }
        });
        revalidatePath(`/patient/${petId}`);
        revalidatePath("/reminders");
        return { success: true };
    } catch (e) {
        return { error: "Failed to record vaccination" };
    }
}
