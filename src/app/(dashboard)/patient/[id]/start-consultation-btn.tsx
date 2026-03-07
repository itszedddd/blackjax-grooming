"use client";

import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { useState } from "react";
import { createConsultation } from "@/app/actions/veterinary";

export default function StartConsultationBtn({ petId }: { petId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleStart() {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("petId", petId);
        formData.append("notes", "Started from patient profile.");
        await createConsultation(formData);
        setIsLoading(false);
    }

    return (
        <Button className="w-full gap-2" onClick={handleStart} disabled={isLoading}>
            <Stethoscope className="h-4 w-4" /> {isLoading ? "Starting..." : "Start Consultation"}
        </Button>
    )
}
