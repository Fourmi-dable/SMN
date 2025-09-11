import { avatars } from "../avatars";

type AvatarListProps = {
    setAvatarListOpen: (open: boolean) => void;
    setSelectedAvatar: (avatar: string) => void;
};

export const AvatarList: React.FC<AvatarListProps> = ({ setAvatarListOpen, setSelectedAvatar }) => {
    return (
        <div className="window active" style={{ width: "500px", position: "absolute", top: "20%" }}>
            <div className="title-bar">
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
                        onClick={() => { setSelectedAvatar(avatars[id]); setAvatarListOpen(false) }}
                    />
                ))}
            </div>
        </div >
    )
}