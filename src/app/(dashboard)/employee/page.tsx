"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, Droplets, Scissors, RefreshCw } from "lucide-react";

type PetStatus = "Pending" | "Shower" | "Trimming Nails" | "Washing" | "Grooming" | "Ready" | "Completed" | "In Consultation" | "Admitted";

interface EmployeePet {
    id: string;
    name: string;
    breed: string | null;
    client: { name: string | null };
    records: { status: string; serviceType: string }[];
    status: PetStatus;
}

export default function EmployeePage() {
    const [pets, setPets] = useState<EmployeePet[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPets = async () => {
        const res = await fetch("/api/pets");
        const data = await res.json();
        const mapped: EmployeePet[] = data.map((pet: any) => {
            const latestRecord = pet.records[0];
            let status: PetStatus = "Pending";
            if (latestRecord) {
                const s = latestRecord.status;
                if (s === "completed") status = "Completed";
                else if (s === "In Consultation") status = "In Consultation";
                else if (s === "scheduled") status = "Pending";
                else if (s === "Shower") status = "Shower";
                else if (s === "Trimming Nails") status = "Trimming Nails";
                else if (s === "Washing") status = "Washing";
                else if (s === "Grooming") status = "Grooming";
                else if (s === "Ready") status = "Ready";
            }
            return { ...pet, status };
        });
        setPets(mapped);
        setLoading(false);
    };

    useEffect(() => { fetchPets(); }, []);

    const updateStatus = async (id: string, newStatus: PetStatus) => {
        // Optimistic update
        setPets(pets.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));

        // Find the specific pet's latest record to update its status in DB
        const pet = pets.find(p => p.id === id);
        if (pet && pet.records && pet.records.length > 0) {
            try {
                // we assume there's an API route we will create next
                await fetch(`/api/records/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ petId: id, status: newStatus })
                });
            } catch (e) {
                console.error("Failed to update status", e);
            }
        }
    };

    if (loading) return <div className="p-8 text-muted-foreground">Loading tasks...</div>;

    const getNextStatus = (current: PetStatus): PetStatus | null => {
        switch (current) {
            case "Pending":
                return "Shower";
            case "Shower":
                return "Trimming Nails";
            case "Trimming Nails":
                return "Washing";
            case "Washing":
                return "Grooming";
            case "Grooming":
                return "Ready";
            case "Ready":
                return "Completed";
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Employee Dashboard</h1>
            <p className="text-muted-foreground">Manage active grooming tasks.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pets
                    .filter((p) => p.status !== "Completed")
                    .map((pet) => (
                        <Card key={pet.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{pet.name}</CardTitle>
                                        <CardDescription>{pet.breed}</CardDescription>
                                    </div>
                                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{pet.id}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col gap-4">
                                <div className="text-sm">
                                    <div className="flex justify-between py-1 border-b">
                                        <span className="text-muted-foreground">Service:</span>
                                        <span className="font-medium">{pet.records[0]?.serviceType || "Grooming"}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b">
                                        <span className="text-muted-foreground">Owner:</span>
                                        <span>{pet.client.name}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b">
                                        <span className="text-muted-foreground">Status:</span>
                                        <span className="font-bold text-primary">{pet.status}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 flex gap-2">
                                    {pet.status !== 'Ready' && (
                                        <Button
                                            className="w-full"
                                            onClick={() => {
                                                const next = getNextStatus(pet.status);
                                                if (next) updateStatus(pet.id, next);
                                            }}
                                        >
                                            {pet.status === 'Pending' && <><Droplets className="mr-2 h-4 w-4" /> Start Shower</>}
                                            {pet.status === 'Shower' && <><Scissors className="mr-2 h-4 w-4" /> Trim Nails</>}
                                            {pet.status === 'Trimming Nails' && <><Droplets className="mr-2 h-4 w-4" /> Start Wash</>}
                                            {pet.status === 'Washing' && <><Scissors className="mr-2 h-4 w-4" /> Start Groom</>}
                                            {pet.status === 'Grooming' && <><Check className="mr-2 h-4 w-4" /> Mark Ready</>}
                                        </Button>
                                    )}
                                    {pet.status === 'Ready' && (
                                        <Button
                                            variant="secondary"
                                            className="w-full"
                                            onClick={() => updateStatus(pet.id, "Completed")}
                                        >
                                            <Check className="mr-2 h-4 w-4" /> Complete Pickup
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
            </div>

            {pets.filter(p => p.status !== 'Completed').length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No active pets in the queue. Good job!
                </div>
            )}
        </div>
    );
}
