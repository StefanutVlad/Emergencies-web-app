import React from "react";

const UserCard = ({ id, username }) => {
  return (
    <div className="user-card">
      <div className="user-card-info">
        <p className="user-card-content">
          <strong className="card-names">
            #{id} {username}
          </strong>
        </p>
      </div>
    </div>
  );
};

export default UserCard;
