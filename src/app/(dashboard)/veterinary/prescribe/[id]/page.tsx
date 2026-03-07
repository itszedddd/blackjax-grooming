"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Printer, Save } from "lucide-react";
import Link from "next/link";
import { createPrescription } from "@/app/actions/prescriptions";

interface Pet {
    id: string;
    name: string;
    breed: string | null;
    client: { name: string; phone: string | null };
}

export default function PrescribePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);
    const [medicine, setMedicine] = useState("");
    const [dosage, setDosage] = useState("");
    const [instructions, setInstructions] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchPet() {
            try {
                const res = await fetch(`/api/pets/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPet(data);
                }
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        }
        fetchPet();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        const formData = new FormData();
        formData.append("medicine", medicine);
        formData.append("dosage", dosage);
        formData.append("instructions", instructions);

        const result = await createPrescription(id, formData);

        if (result.error) {
            alert(result.error);
        } else {
            alert(`Prescription saved for ${pet?.name}:\n${medicine} - ${dosage}`);
            router.push(`/patient/${id}`);
        }
        setSaving(false);
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="p-8 text-muted-foreground">Loading patient...</div>;
    }

    if (!pet) {
        return (
            <div className="p-8 flex flex-col items-center gap-4">
                <p>Patient not found.</p>
                <Button variant="link" asChild><Link href="/veterinary">Back to Dashboard</Link></Button>
            </div>
        );
    }

    return (
        <div className="grid gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/patient/${id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-lg font-semibold md:text-2xl">Write Prescription</h1>
            </div>

            <Card className="print:shadow-none print:border-none">
                <CardHeader>
                    <CardTitle>Rx: {pet.name}</CardTitle>
                    <CardDescription>Owner: {pet.client.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Medicine Name</label>
                        <Input
                            placeholder="e.g. Amoxicillin"
                            value={medicine}
                            onChange={e => setMedicine(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Dosage</label>
                        <Input
                            placeholder="e.g. 500mg twice daily"
                            value={dosage}
                            onChange={e => setDosage(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Instructions</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="e.g. Give twice daily with food..."
                            value={instructions}
                            onChange={e => setInstructions(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 pt-4 print:hidden">
                        <Button onClick={handleSave} className="gap-2" disabled={saving || !medicine}>
                            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Prescription"}
                        </Button>
                        <Button variant="outline" onClick={handlePrint} className="gap-2">
                            <Printer className="h-4 w-4" /> Print View
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
