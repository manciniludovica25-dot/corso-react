interface SuccessMessageProps {
    message: string;
}

export function SuccessMessage({
    message,
}: SuccessMessageProps) {

    return (
        <div
            className="success-message"
            role="status"
            aria-live="polite"
        >
            {message}
        </div>
    );
}