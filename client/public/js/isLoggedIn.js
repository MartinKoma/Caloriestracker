export default async function isLoggedIn() {
  const credentials = sessionStorage.getItem("jwt");
  if (credentials) {
    const res = await fetch("http://localhost:3000/api/v1/isLoggedin", {
      method: "GET",
      credentials: "include",
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${credentials}`,
        "Content-Type": "application/json",
        Accept: "*/*",
        "Access-Control-Allow-Origin": "http://localhost",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
      },
    });

    const data = await res.json();
    if (data.status === "success") {
      return true;
    }
    return false;
  }
}
