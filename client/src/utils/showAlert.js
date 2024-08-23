export const showAlert = (message, id) => {
    const container = document.getElementById(id);
    console.log(message)
    const alert = `<div class="alert">${
      message.includes(":") ? message.split(":")[2] : message
    }</div>`;
    container.insertAdjacentHTML("afterbegin", alert);
    const alertEl = container.querySelector(".alert");
    setTimeout(() => alertEl.remove(), 3000);
  };