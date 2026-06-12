interface LoadingMessageProps {
    message: string;
}

export function LoadingMessage({
    message,
}: LoadingMessageProps) {

    return (
        <div
            className="loading-message"
            role="status"
            aria-live="polite"
        >
            {message}
        </div>
    );
}