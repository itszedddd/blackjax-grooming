"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Syringe } from "lucide-react";
import { useState } from "react";
import { createVaccination } from "@/app/actions/veterinary";

export default function RecordVaccinationForm({ petId }: { petId: string }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function action(formData: FormData) {
        setIsLoading(true);
        setError("");

        const result = await createVaccination(petId, formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setOpen(false);
        }
        setIsLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                    <Syringe className="h-4 w-4" /> Record Vaccination
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={action}>
                    <DialogHeader>
                        <DialogTitle>Record Vaccination</DialogTitle>
                        <DialogDescription>
                            Add a new vaccination record for this patient.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {error && <div className="text-sm text-destructive">{error}</div>}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Vaccine *</Label>
                            <Input id="name" name="name" placeholder="e.g. 5-in-1, Rabies" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dateGiven" className="text-right">Date Given *</Label>
                            <Input id="dateGiven" name="dateGiven" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nextDueDate" className="text-right">Next Due</Label>
                            <Input id="nextDueDate" name="nextDueDate" type="date" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">Notes</Label>
                            <Input id="notes" name="notes" placeholder="Batch number, reactions, etc." className="col-span-3" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Record"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
