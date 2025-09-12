import { avatars } from "../assets/avatars";

type AvatarProps = {
    onlineStatus: number;
    selectedAvatar: number;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
};

export const Avatar: React.FC<AvatarProps> = ({ onlineStatus, selectedAvatar, size }) => {
    return (
        <div
            className={`avatar-container ${onlineStatus === 0
                ? 'online'
                : onlineStatus === 1
                    ? 'busy'
                    : 'away'
                } ${size
                    ? size
                    : 'medium'
                }`
            }>
            <img src={avatars[selectedAvatar]} alt="Avatar" />
        </div>
    );
}