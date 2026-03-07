"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPrescription(petId: string, data: FormData) {
    const medicine = data.get("medicine") as string;
    const dosage = data.get("dosage") as string;
    const instructions = (data.get("instructions") as string) || null;

    if (!medicine || !dosage) return { error: "Medicine and dosage are required" };

    try {
        await prisma.prescription.create({
            data: {
                petId,
                medicine,
                dosage,
                instructions,
                status: "Active"
            }
        });
        revalidatePath(`/patient/${petId}`);
        return { success: true };
    } catch (e) {
        return { error: "Failed to save prescription" };
    }
}

export async function updatePrescriptionStatus(id: string, status: string, petId: string) {
    try {
        await prisma.prescription.update({
            where: { id },
            data: { status }
        });
        revalidatePath(`/patient/${petId}`);
        return { success: true };
    } catch (e) {
        return { error: "Failed to update prescription status" };
    }
}

export async function deletePrescription(id: string, petId: string) {
    try {
        await prisma.prescription.delete({ where: { id } });
        revalidatePath(`/patient/${petId}`);
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete prescription" };
    }
}
