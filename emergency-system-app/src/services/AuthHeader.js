// We also have methods for retrieving data from server.
// In the case we access protected resources,
// the HTTP request needs Authorization header.

//add a HTTP header with the help of authHeader() function when requesting authorized resource.
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  //checks Local Storage for user item. If there is a logged in user with accessToken (JWT),
  // return HTTP Authorization header. Otherwise, return an empty object.
  if (user && user.accessToken) {
    //returns an object containing the JWT of the currently logged in user from Local Storage.
    return { "x-access-token": user.accessToken };
  } else {
    return {};
  }
}
