"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClient(data: FormData) {
    const name = data.get("name") as string;
    const phone = (data.get("phone") as string) || null;
    const email = (data.get("email") as string) || null;
    const address = (data.get("address") as string) || null;

    if (!name) return { error: "Name is required" };

    try {
        await prisma.client.create({
            data: {
                name,
                phone,
                email,
                address
            }
        });
        revalidatePath("/admin");
        revalidatePath("/admin/clients");
        return { success: true };
    } catch (e) {
        return { error: "Failed to create client" };
    }
}

export async function updateClient(id: string, data: FormData) {
    const name = data.get("name") as string;
    const phone = (data.get("phone") as string) || null;
    const email = (data.get("email") as string) || null;
    const address = (data.get("address") as string) || null;

    if (!name) return { error: "Name is required" };

    try {
        await prisma.client.update({
            where: { id },
            data: {
                name,
                phone,
                email,
                address
            }
        });
        revalidatePath("/admin");
        revalidatePath("/admin/clients");
        return { success: true };
    } catch (e) {
        return { error: "Failed to update client" };
    }
}

export async function deleteClient(id: string) {
    try {
        await prisma.client.delete({
            where: { id }
        });
        revalidatePath("/admin");
        revalidatePath("/admin/clients");
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete client" };
    }
}
