// There are 4 user controller functions:
// – /api/test/all for public access
// – /api/test/user for loggedin users (any role)
// – /api/test/mod for moderator users
// – /api/test/admin for admin users

const allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

const userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

const adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

const moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

export default { allAccess, userBoard, adminBoard, moderatorBoard };
