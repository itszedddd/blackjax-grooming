"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Dog, Activity } from "lucide-react";

export default function PetStatusPage() {
    const [petId, setPetId] = useState("");
    const [statusData, setStatusData] = useState<any>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setStatusData(null);

        if (!petId.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/public/status/${encodeURIComponent(petId)}`);
            if (res.ok) {
                const data = await res.json();
                setStatusData(data);
            } else {
                const errData = await res.json();
                setError(errData.error || "Pet not found");
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-primary/20">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                        <Dog className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Check Pet Status</CardTitle>
                    <CardDescription>
                        Enter your Pet ID to view their current grooming or veterinary status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex space-x-2 mb-6">
                        <Input
                            placeholder="e.g. TIC-1001 or cuxyz123..."
                            value={petId}
                            onChange={(e) => setPetId(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" disabled={isLoading || !petId.trim()}>
                            {isLoading ? "Searching..." : <><Search className="h-4 w-4 mr-2" /> Track</>}
                        </Button>
                    </form>

                    {error && (
                        <div className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-md">
                            {error}
                        </div>
                    )}

                    {statusData && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="p-4 border rounded-lg bg-card text-card-foreground">
                                <div className="flex justify-between items-center border-b pb-3 mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg">{statusData.name} {statusData.breed ? `(${statusData.breed})` : ''}</h3>
                                        <p className="text-sm text-muted-foreground">Owner: {statusData.clientName}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-muted-foreground">
                                            <Activity className="h-4 w-4 mr-2" />
                                            Current Status
                                        </div>
                                        <div className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                                            {statusData.currentStatus}
                                        </div>
                                    </div>

                                    {statusData.latestService && (
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-muted-foreground pl-6">
                                                Service
                                            </div>
                                            <div className="text-sm font-medium">
                                                {statusData.latestService}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {statusData.currentStatus === 'Ready' && (
                                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-sm text-center border border-emerald-200">
                                    🎉 Great news! Your pet is ready for pickup!
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
