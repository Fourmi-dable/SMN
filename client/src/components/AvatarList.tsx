import React from "react";
import { avatars } from "../assets/avatars";
import { DraggableWindow } from "./DraggableWindow";

type AvatarListProps = {
    setAvatarListOpen: (open: boolean) => void;
    setSelectedAvatar: (avatar: number) => void;
};

export const AvatarList: React.FC<AvatarListProps> = ({ setAvatarListOpen, setSelectedAvatar }) => {
    return (
        <DraggableWindow
            className="window active avatar-list-container"
            initialPosition={{ left: 10, top: 60 }}
        >
            <div className="title-bar" >
                <div className="title-bar-text">SMN Messenger - Choisis ton avatar</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close" onClick={() => setAvatarListOpen(false)}></button>
                </div>
            </div>
            <div className="window-body has-space avatar-list">
                {avatars.map((src, id) => (
                    <button
                        key={id}
                        onClick={() => { setSelectedAvatar(id); setAvatarListOpen(false) }}
                        autoFocus={id === 0}
                        aria-label={"Select avatar " + id}
                    >
                        < img
                            src={src}
                            alt={"avatar-image-" + id}
                        />
                    </button>
                ))}
            </div>
        </DraggableWindow >
    );
};