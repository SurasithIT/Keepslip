var { soap, url, specialRequest, options } = require("./service.config");

class StoreRequest {
  constructor(storeRequest) {
    this.username = "anonymous";
    this.password = "anonymous";
    this.TIN = storeRequest.TIN; // if don't know can be un define
    this.Name = storeRequest.Name; // if don't know can be un define
    this.ProvinceCode = storeRequest.ProvinceCode; // if don't know can define as '0'
    this.BranchNumber = storeRequest.BranchNumber; // if don't know can define as '0'
    this.AmphurCode = storeRequest.AmphurCode; // if don't know can define as '0'
  }
}

StoreRequest.getStoreData = (newStoreRequest, result) => {
  soap.createClient(url, options, function(err, client) {
    if (err) {
      console.error(err);
    }

    client.Service(newStoreRequest, async function(err, res) {
      if (err) {
        console.error(err);
        result(err, null);
      }
      if (res === null) {
        let err = {
          error: true,
          status: 400,
          message: `No data found`
        };
        result(err, null);
      } else {
        let rawData = res.ServiceResult;
        for (var key in rawData) {
          if (rawData[key]) {
            let value = rawData[key].anyType[0].$value;
            rawData[key] = value;
          }
        }
        console.log(rawData);

        let data = {
          NID: rawData.vNID,
          BusinessName: "",
          BranchNumber: rawData.vBranchNumber,
          BranchName: "",
          Address: "",
          PostCode: rawData.vPostCode,
          BusinessFirstDate: rawData.vBusinessFirstDate
        };

        await setBusinessName(rawData, data);
        await setBranchName(rawData, data);
        await setAddress(rawData, data);

        result(null, data);
      }
    });
  });
};

setBusinessName = (rawData, data) => {
  let BusinessName = {
    titleName: rawData.vtitleName,
    Name: rawData.vName,
    Surname: rawData.vSurname
  };

  for (let key in BusinessName) {
    if (BusinessName[key] !== "-") {
      data.BusinessName = data.BusinessName + " " + BusinessName[key];
    }
  }
  data.BusinessName = data.BusinessName.slice(1);
};

setBranchName = (rawData, data) => {
  let BranchName = {
    titleName: rawData.vBranchTitleName,
    Name: rawData.vBranchName
  };

  for (let key in BranchName) {
    if (BranchName[key] !== "-") {
      data.BranchName = data.BranchName + " " + BranchName[key];
    }
  }
  data.BranchName = data.BranchName.slice(1);
};

setAddress = (rawData, data) => {
  let Address = {
    BuildingName: `อาคาร ${rawData.vBuildingName}`,
    FloorNumber: `ชั้นที่ ${rawData.vFloorNumber}`,
    VillageName: `หมู่บ้าน ${rawData.vVillageName}`,
    RoomNumber: `ห้องที่ ${rawData.vRoomNumber}`,
    HouseNumber: `เลขที่ ${rawData.vHouseNumber}`,
    MooNumber: `หมู่ที่ ${rawData.vMooNumber}`,
    SoiName: `ซอย ${rawData.vSoiName}`,
    StreetName: `ถนน ${rawData.vStreetName}`,
    Thambol: `ตำบล/แขวง ${rawData.vThambol}`,
    Amphur: `อำเภอ/เขต ${rawData.vAmphur}`,
    Province: `จังหวัด ${rawData.vProvince}`
  };

  for (let key in Address) {
    if (Address[key].slice(-1) !== "-") {
      data.Address = data.Address + " " + Address[key];
    }
  }
  data.Address = data.Address.slice(1);
};

module.exports = StoreRequest;
