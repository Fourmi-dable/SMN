const StatusSelect = ({ onlineStatus, setOnlineStatus }:
    { onlineStatus: number, setOnlineStatus: (status: number) => void }) => {

    const onOnlineStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOnlineStatus(Number(e.target.value));
    }

    return (<div className="status-select">
        <label htmlFor="online">Etat:</label>
        <select
            id="online"
            value={onlineStatus}
            onChange={onOnlineStatusChange}
        >
            <option value={0}>🟢 En ligne</option>
            <option value={1}>🔴 Occupé</option>
            <option value={2}>🟠 Ailleurs</option>
        </select>
    </div>);
}

export default StatusSelect;