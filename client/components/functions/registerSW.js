let register;

registerFunc = async () => {
  if (
    typeof window !== "undefined" &&
    typeof window.navigator !== "undefined"
  ) {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/service-worker.js");
      });
    }
  }
};
registerFunc();
console.log(register);

module.exports = register;
