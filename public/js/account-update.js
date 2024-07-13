const account = document.querySelector("form");

account.addEventListener("change", function () {
  const updateBtn = document.querySelector("input[type='submit']");
  updateBtn.removeAttribute("disabled");
});
