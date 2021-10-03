function signUp() {
  console.log("HERE");
  preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log(name, email, password);
  const url = "http://localhost:1000/signup";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, email: email, password: password }),
  })
    .then((response) => console.log(response))
    .then((data) => console.log(data));
}

function signIn() {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const url = "http://localhost:1000/signin";
  
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((response) => console.log(response))
    .then((data) => console.log(data));
}
