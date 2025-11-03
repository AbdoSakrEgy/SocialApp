const baseURL = "http://localhost:3000/api/v1";

$("#login").click(() => {
  const email = $("#email").val();
  const password = $("#password").val();
  const data = {
    email,
    password,
  };
  axios({
    method: "post",
    url: `${baseURL}/auth/login`,
    data: data,
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  })
    .then(function (response) {
      console.log(response);
      const { message,status,result } = response.data;
      console.log({ message });

      if (status == 200) {
        localStorage.setItem("token", result.accessToken);
        window.location.href = "chat.html";
      } else {
        console.log("In-valid email or password");
        alert("In-valid email or password");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
