"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInventoryItems() {
    return prisma.inventoryItem.findMany({
        orderBy: { name: "asc" },
    });
}

export async function createInventoryItem(data: FormData) {
    const name = data.get("name") as string;
    const category = data.get("category") as string;
    const stock = parseInt(data.get("stock") as string) || 0;
    const unit = data.get("unit") as string;
    const expiryDateStr = data.get("expiryDate") as string;

    if (!name || !category || !unit) {
        return { error: "Name, category, and unit are required" };
    }

    let status = "Ok";
    if (stock <= 0) status = "Out of Stock";
    else if (stock <= 5) status = "Low";

    const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null;

    try {
        await prisma.inventoryItem.create({
            data: {
                name,
                category,
                stock,
                unit,
                expiryDate,
                status,
            }
        });
        revalidatePath("/inventory");
        revalidatePath("/reports");
        return { success: true };
    } catch (e) {
        console.error("Failed to create inventory item", e);
        return { error: "Failed to create inventory item" };
    }
}
