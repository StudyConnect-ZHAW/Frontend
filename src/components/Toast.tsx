import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

export enum ToastType {
    Success = "success",
    Error = "error",
    Info = "info",
    Warning = "warning",
};

type ToastProps = {
    id: number;
    type: ToastType;
    title: string;
    message: string;
    duration: number;
    onClose: (id: number) => void;
};

const iconMap: Record<ToastType, string> = {
    [ToastType.Success]: "fas fa-check-circle",
    [ToastType.Error]: "fas fa-times-circle",
    [ToastType.Info]: "fas fa-info-circle",
    [ToastType.Warning]: "fas fa-exclamation-circle",
};

/**
 * The toast component displays some feedback for the user, including whether an action was successful or if an error occurred.
 */
const Toast = ({ id, type, title, message, duration, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose(id), duration);
        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    return (
        <div className={`toast ${type}`}>
            <div className="toast-content">
                <p>{title}</p>
                <p>{message}</p>
            </div>
            <button onClick={() => onClose(id)}>&times;</button>
        </div>
    );
};

let addToastExternal: ((toast: Omit<ToastProps, "id" | "onClose">) => void) | null = null;

export function showToast(
    type: ToastType,
    title: string,
    message: string,
    duration = 5000
) {
    if (addToastExternal) {
        addToastExternal({ type, title, message, duration });
    } else {
        console.warn("Toast system not initialized yet.");
    }
}

let toastIdCounter = 0;

export const ToastContainer = () => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const addToast = (toast: Omit<ToastProps, "id" | "onClose">) => {
        setToasts((prev) => [
            ...prev,
            { ...toast, id: toastIdCounter++, onClose: removeToast },
        ]);
    };

    useEffect(() => {
        addToastExternal = addToast;
        return () => {
            addToastExternal = null;
        };
    }, []);

    const portalRoot = typeof window !== "undefined"
        ? document.getElementById("toast-container")
        : null;

    return portalRoot
        ? createPortal(
            <>
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </>,
            portalRoot
        )
        : null;
};