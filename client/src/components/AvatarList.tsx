import React from "react";
import { avatars } from "../assets/avatars";

type AvatarListProps = {
    setAvatarListOpen: (open: boolean) => void;
    setSelectedAvatar: (avatar: number) => void;
};

export const AvatarList: React.FC<AvatarListProps> = ({ setAvatarListOpen, setSelectedAvatar }) => {
    const windowRef = React.useRef<HTMLDivElement>(null);
    const offset = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const isDragging = React.useRef(false);

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        isDragging.current = true;
        const rect = windowRef.current!.getBoundingClientRect();
        offset.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (event: MouseEvent) => {
        if (!isDragging.current || !windowRef.current) return;
        windowRef.current.style.left = `${event.clientX - offset.current.x}px`;
        windowRef.current.style.top = `${event.clientY - offset.current.y}px`;
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
            ref={windowRef}
            className="window active avatar-list-container"
        >
            <div className="title-bar" onMouseDown={onMouseDown} style={{ cursor: "move" }}>
                <div className="title-bar-text">SMN Messenger - Choisis ton avatar</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close" onClick={() => setAvatarListOpen(false)}></button>
                </div>
            </div>
            <div className="window-body has-space avatar-list">
                {avatars.map((src, id) => (
                    <img
                        src={src}
                        alt="avatar-image"
                        key={id}
                        onClick={() => { setSelectedAvatar(id); setAvatarListOpen(false) }}
                    />
                ))}
            </div>
        </div>
    );
};