export const getFormattedDate = (date) => {
  new Date(date).toLocaleDateString("en-US") ===
  new Date(Date.now()).toLocaleDateString("en-US")
    ? new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : new Date(date).toLocaleDateString("en-US");
};
