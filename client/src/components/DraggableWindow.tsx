import React, { useRef, useState } from "react";

let zIndexCounter = 10;

type DraggableWindowProps = {
    children: React.ReactNode;
    initialPosition?: { left: number; top: number };
    className?: string;
    style?: React.CSSProperties;
};

export const DraggableWindow: React.FC<DraggableWindowProps> = ({
    children,
    initialPosition = { left: 20, top: 20 },
    className = "",
    style = {},
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
        if (!isDragging.current) return;
        setPosition({
            left: event.clientX - offset.current.x,
            top: event.clientY - offset.current.y,
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