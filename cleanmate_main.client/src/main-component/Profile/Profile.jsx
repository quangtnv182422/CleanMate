import useAuth from "../../hooks/useAuth";

const Profile = () => {
    const { user, loading } = useAuth();
    console.log(user);

    return (
        <div className="profile">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="profile-info">
                    <h2>{user.name}</h2>
                </div>
            )}
        </div>
    )
}

export default Profile;