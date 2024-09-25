export const showAlert = (message, id) => {
  document.querySelector(".alert")?.remove();
  const container = document.getElementById(id);
  const alert = `<div class="alert">${
    message?.includes(":") ? message.split(":")[2] : message
  }</div>`;
  container.insertAdjacentHTML("afterbegin", alert);
  const alertEl = container.querySelector(".alert");
  setTimeout(() => alertEl.remove(), 4000);
};
