import React from "react";

/**
 * Temporary component to be used as placeholder for areas that are WIP (Work in Progress).
 */
export default function WIPSection() {
    return (
        <div
            className={"flex-grow flex items-center justify-center border-4 border-dashed border-yellow-400 rounded-xl p-6"}>
            <h1 className="text-4xl font-bold text-foreground">WIP</h1>
        </div>
    )
}