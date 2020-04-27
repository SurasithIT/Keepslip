console.log("Service Worker Loaded...");
const cacheName = "v1";

const cacheAssets = ["src/KeelSlip_Icon.png"];

// Call Install Event
self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed");

  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("Service Worker: Caching Files");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Call Activate Event
self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activated");
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener("fetch", (e) => {
  console.log("Service Worker: Fetching");
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

self.addEventListener("push", (e) => {
  let title = "Push test";
  self.registration.showNotification(title, {
    body: `Test Push Notification`,
    icon: "/src/KeelSlip_Icon.png",
  });
});

self.addEventListener("notificationclick", (e) => {
  // console.log(e);
  // console.log(e.notification.data);
  let data = e.notification.data;
  var notification = e.notification;
  var action = e.action;

  if (action === "close") {
    notification.close();
  } else {
    clients.openWindow(
      `http://www.keepslip.com/receipt?receipt_id=${data.rec_id}`
    );
    notification.close();
  }
});

var sentNoti;
var notiTimeoutList = [];
var notiIntervalList = [];

self.addEventListener("message", function (event) {
  var data = JSON.parse(event.data);

  console.log("SW Received Message:");
  console.log(data);

  self.rec_id = data.rec_id;
  self.item_id = data.item_id;
  self.remain = data.remain;
  let title = "KeepSlip";
  let one_day = 1000 * 60 * 60 * 24;
  self.notiTime = data.remain - 7 * one_day;
  let notiDay = self.notiTime + new Date().getTime();
  // console.log("NotiTime", self.notiTime);
  // console.log("NotiDay", new Date(notiDay));

  function showNoti() {
    if (self.notiTime > one_day) {
      console.log("More than one day");
      var sentNotiInterval = setInterval(() => {
        self.notiTime = self.notiTime - one_day;
        if (self.notiTime <= one_day) {
          var sentNotiTimeout = setTimeout(() => {
            self.registration.showNotification(title, {
              body: `Your Receipt ID: ${data.rec_id} Item: ${data.item_id} will expire in 7 days`,
              icon: "/src/KeelSlip_Icon.png",
              data: { rec_id: data.rec_id },
            });
            notiTimeoutList.push(sentNotiTimeout);
            clearInterval(sentNotiTimeout);
          }, self.notiTime);
        }
      }, one_day);
      notiIntervalList.push(sentNotiInterval);
    }

    if (self.notiTime <= one_day) {
      console.log("Less than one day");
      var sentNotiTimeout = setTimeout(() => {
        self.registration.showNotification(title, {
          body: `Your Receipt ID: ${data.rec_id} Item: ${data.item_id} will expire in 7 days and`,
          icon: "/src/KeelSlip_Icon.png",
          data: { rec_id: data.rec_id },
        });
        notiTimeoutList.push(sentNotiTimeout);
      }, self.notiTime);
    }
    console.log(notiIntervalList);
    console.log(notiTimeoutList);
  }

  if (data.status == "sent") {
    console.log(
      `Your Receipt ID: ${data.rec_id} Item: ${data.item_id} will expire in ${
        data.remain / one_day
      } day`
    );
    showNoti();
  }

  if (data.status == "clear") {
    console.log("Clear all Notification timeouts");
    for (const id of notiTimeoutList) {
      console.log("Clear Timeout ID", id);
      clearTimeout(id);
    }
    for (const id of notiIntervalList) {
      console.log("Clear Interval ID", id);
      clearInterval(id);
    }
    notiTimeoutList = [];
    notiIntervalList = [];
  }
});
