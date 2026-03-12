type UserCardProps = {
    name: string;
    role: string;
    email: string;
};

function UserCard({ name, role, email }: UserCardProps) {
    return (
        <div style={{border: '1px solid #ccc', padding: '20px', borderRadius: '8px', margin: '10px'}}>
            <h2>{name}</h2>
            <p>{role}</p>
            <p>{email}</p>
            </div>
    );
}
export default UserCard;