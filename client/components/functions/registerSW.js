let register;

registerFunc = async () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/service-worker.js");
    });
  }
};
registerFunc();
console.log(register);

module.exports = register;
