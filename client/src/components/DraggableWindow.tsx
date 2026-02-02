import React, { useRef, useState } from "react";

let zIndexCounter = 10;

type DraggableWindowProps = {
    children: React.ReactNode;
    initialPosition?: { left: number; top: number };
    className?: string;
    style?: React.CSSProperties;
    ref?: React.Ref<HTMLDivElement>;
    isMobile?: boolean;
};

export const DraggableWindow: React.FC<DraggableWindowProps> = ({
    children,
    initialPosition = { left: 20, top: 20 },
    className = "",
    style = {},
    ref,
    isMobile,
}) => {
    const [position, setPosition] = useState<{ left: number; top: number }>(initialPosition);
    const [zIndex, setZIndex] = useState(zIndexCounter);
    const offset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const isDragging = useRef(false);

    const bringToFront = () => {
        zIndexCounter += 1;
        setZIndex(zIndexCounter);
    };

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        bringToFront();
        isDragging.current = true;
        offset.current = {
            x: event.clientX - position.left,
            y: event.clientY - position.top,
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (event: MouseEvent) => {
        if (!isDragging.current || !ref?.current) return;
        const rect = ref.current.getBoundingClientRect();
        const newLeft = event.clientX - offset.current.x;
        const newTop = event.clientY - offset.current.y;
        const maxLeft = window.innerWidth - rect.width;
        const maxTop = window.innerHeight - rect.height;
        setPosition({
            left: Math.max(0, Math.min(newLeft, maxLeft)),
            top: Math.max(0, Math.min(newTop, maxTop)),
        });
    };

    const onMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    };

    React.useEffect(() => {
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    // Disable dragging on mobile devices
    if (isMobile) {
        return (
            <div
                className={className}
                style={{
                    ...style,
                    position: "absolute",
                    zIndex,
                    left: 10,
                    top: 60,
                }}
                ref={ref}
            >
                {children}
            </div>
        );
    }

    return (
        <div
            className={className}
            style={{
                ...style,
                position: "absolute",
                zIndex,
                left: position.left,
                top: position.top,
            }}
            ref={ref}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child) && (child as { props: { className?: string } }).props.className?.includes("title-bar")
                    ? React.cloneElement(
                        child as React.ReactElement<
                            React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
                        >,
                        { onMouseDown }
                    )
                    : child
            )}
        </div>
    );
};