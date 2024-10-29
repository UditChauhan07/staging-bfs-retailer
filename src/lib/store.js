export const originAPi = process.env.REACT_APP_OA_URL || "https://temp.beautyfashionsales.com"
// export const originAPi = "https://dev.beautyfashionsales.com"
// export const originAPi = "http://localhost:2611"

let url = `${originAPi}/retailer/`;
let url2 = `${originAPi}/retailerv2/`;
const orderKey = "orders";
const accountIdKey = "AccountId__c";
const brandIdKey = "ManufacturerId__c";
const brandKey = "Account";
const accountKey = "manufacturer";
const POCount = "woX5MkCSIOlHXkT";
const support = "AP0HBuNwbNnuhKR";
const shareKey = "3a16FWFtoPA5FMC";
// export const originAPi = "https://dev.beautyfashionsales.com"

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ShareDrive(data, remove = false) {
  if (remove) {
    localStorage.removeItem(shareKey);
    return true;
  }
  if (data) {
    localStorage.setItem(shareKey, JSON.stringify(data))
    return true;
  } else {
    let strData = localStorage.getItem(shareKey);
    return JSON.parse(strData);
  }
}

export async function AuthCheck() {
  if (JSON.parse(localStorage.getItem("jAuNW7c6jdi6mg7"))) {
    return true;
  } else {
    DestoryAuth();
    return false;
  }
}
export const sortArrayHandler = (arr, getter, order = 'asc') =>
  arr.sort(
    order === 'desc'
      ? (a, b) => getter(b).localeCompare(getter(a))
      : (a, b) => getter(a).localeCompare(getter(b))
  );

export function fetchBeg() {
  let orderStr = localStorage.getItem("AA0KfX2OoNJvz7x");


  if (orderStr) {
    let orderList = JSON.parse(orderStr);

    return orderList;
  }
}


export async function POGenerator() {
  try {

    let orderDetails = fetchBeg();
    if (orderDetails.Manufacturer?.id && orderDetails.Account?.id) {

      let date = new Date();

      //  const response = await fetch( "http://localhost:2611/PoNumber/generatepo"
      const response = await fetch(originAPi + "/qX8COmFYnyAj4e2/generatepov2", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountName: orderDetails.Account?.name,
          manufacturerName: orderDetails.Manufacturer?.name,
          orderDate: date.toISOString(),
          accountId: orderDetails.Account?.id,
          manufacturerId: orderDetails.Manufacturer?.id
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }


      const poData = await response.json();

      if (poData.success) {
        let generatedPONumber = poData.poNumber;

        return await generatedPONumber;
      } else {
        console.error('Failed to generate PO number:', poData.message);
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error generating PO number:', error.message);
    return null;
  }
}

// Helper function to generate codes
export function getStrCode(str) {
  if (!str) return null;
  let codeLength = str.split(" ");

  if (codeLength.length >= 2) {
    return `${codeLength[0].charAt(0).toUpperCase() + codeLength[1].charAt(0).toUpperCase()}`;
  } else {
    return `${codeLength[0].charAt(0).toUpperCase() + codeLength[0].charAt(codeLength[0].length - 1).toUpperCase()}`;
  }
}

// Helper function to pad numbers
function padNumber(n, isTwoDigit) {
  if (isTwoDigit) {
    return n < 10 ? "0" + n : n;
  } else {
    if (n < 10) return "000" + n;
    if (n < 100) return "00" + n;
    if (n < 1000) return "0" + n;
    return n;
  }
}

export function formatNumber(num) {
  if (num >= 0 && num < 1000000) {
    return (num / 1000).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "K";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "M";
  } else if (num < 0) {
    return (num / 1000).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "K";
  } else {
    return num;
  }
}

export function supportDriveBeg() {
  let supportList = localStorage.getItem(support);
  return JSON.parse(supportList);
}
export async function supportShare(data) {
  localStorage.setItem(support, JSON.stringify(data));
  return true;
}
export function supportClear() {
  localStorage.removeItem(support);
  if (localStorage.getItem(support)) {
    return false;
  } else {
    return true;
  }
}




export async function DestoryAuth() {
  for (var key in localStorage) {
    if (localStorage.hasOwnProperty(key) && (key != "AA0KfX2OoNJvz7x" && key != "passwordB2B" && key != "emailB2B")) {
      localStorage.removeItem(key);
    }
  }
  window.location.href = window.location.origin;
  return true;
}

export async function GetAuthData() {
  if (!AuthCheck) {
    DestoryAuth();
  } else {
    return JSON.parse(localStorage.getItem("jAuNW7c6jdi6mg7"))?.data;
  }
}


export async function getOrderofSalesRep({ user, month }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", user.key);
  bodyContent.append("salesRepId", user.Sales_Rep__c);

  let response = await fetch(url + "v3/8QUZQtEILKLsFeE", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getOrderDetailsBasedId({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("opportunity_id", rawData.id);

  let response = await fetch(url + "0DS68FOD7s", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getOrderDetailsInvoice({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("opportunity_id", rawData.id);

  let response = await fetch(url + "yDJTccwNd7sgrTr", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return { data: data.data, attachment: data.attachedmenetdata };
  }
}


export async function getSupportFormRaw({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("AccountId", rawData.AccountId);

  let response = await fetch(url + "v3/HX0RbhJ3jppDwQX", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getAllAccount({ user }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let body = {
    key: user.x_access_token,
    salesRepId: user.Sales_Rep__c,
  };
  let response = await fetch(originAPi + "v3/fmJJCh9HaL33Iqp", {
    method: "POST",
    headers: headersList,
    body: JSON.stringify(body),
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth()
  } else {
    return data.data;
  }
}

export async function postSupport({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "jO39qP1LpsBFM5B", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}
export async function uploadFileSupport({ key, supportId, files }) {
  if (files.length) {

    let headersList = {
      "Accept": "*/*", key, supportId
    }
    let bodyContent = new FormData();
    files.map((file) => {
      bodyContent.append("files", file.file);
    })
    let response = await fetch(originAPi + "/unCb9Coo4FFqCtG/w72MrdYNHfsSsqe", {
      method: "POST",
      body: bodyContent,
      headers: headersList
    });

    let data = JSON.parse(await response.text());
    if (data) {
      return data.data
    }
  }
}
//retailer
export async function getRetailerBrands({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let response = await fetch(originAPi + "/retailer/GQGpen0kmGHGPtx", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getOrderProduct({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/retailer/NDgzTcdHqMCCRFd", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function cartSync({ cart }) {

  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url2 + "/SQ26OYkaaEAGNnK", {
    method: "POST",
    body: JSON.stringify(cart),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.data) {
    return data.data;
  } else {
    return true;
  }
}

export async function OrderPlaced({ order, cartId }) {
  let orderinit = {
    info: order, cartId
  };
  let headersList = {
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/retailer/XXwo3xQF5CwslB9", {
    method: "POST",
    body: JSON.stringify(orderinit),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 200) {
    localStorage.removeItem(orderKey);
    localStorage.removeItem(accountIdKey);
    localStorage.removeItem(brandIdKey);
    localStorage.removeItem(brandKey);
    localStorage.removeItem(accountKey);
    let lastCount = localStorage.getItem(POCount) || 1;
    localStorage.setItem(POCount, parseInt(+lastCount + 1));
    return data.order;
  } else if (data.status == 300) {
    DestoryAuth();
  } else {
    if (data?.data) {
      return data.data
    } else {
      return false;
    }
  }
}

export async function getOrderList({ user, month }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", user.key);
  bodyContent.append("AccountId", user.accountId);
  bodyContent.append("month", month === "last-6-months" ? "" : month);

  let response = await fetch(originAPi + "/retailer/sWNZ2zjgP0prhlI", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getOrderCustomerSupport({ user, month }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", user.key);
  bodyContent.append("AccountId", user.accountId);
  bodyContent.append("month", month === "last-6-months" ? "" : month);
  let response = await fetch(originAPi + "/retailer/7Zcldl3YmUOrhmF", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getOrderDetailId({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("opportunity_id", rawData.opportunity_id);

  let response = await fetch(originAPi + "/retailer/rrIWkEGMzSBJzBg", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}
export async function getDashboardata({ user }) {
  let headersList = {};
  if (user.headers) {
    headersList = { ...user.headers } || {};
  } else {
    headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };
  }

  let response = await fetch(originAPi + "/95zWpMEFtbAr8lqn/38Akka0hdLL8Kyo", {
    // let response = await fetch(url + "v3/3kMMguJj62cyyf0", {
    method: "POST",
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getRollOver({ key, accountIds = null }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  let response = await fetch(originAPi + "/95zWpMEFtbAr8lqn/ujlyvJcLHjRtIbd", {
    method: "POST",
    headers: headersList,
    body: JSON.stringify({ key, accountIds }),
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getSupportList({ user }) {
  let headersList = {
    Accept: "*/*",
  };
  let bodyContent = new FormData();
  bodyContent.append("key", user?.data?.x_access_token);
  bodyContent.append("accountId", user?.data?.accountId);

  let response = await fetch(url + "XIj26x1E4d2kMKg", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getSupportDetails({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("caseId", rawData.caseId);

  let response = await fetch(url + "DJ2ITqAxnaCY1BA", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getTargetReportAll({ user, year, preOrder, accountIds = null }) {
  if (user) {
    let headersList = {
      Accept: "*/*",
      key: user?.data?.x_access_token,
      accountIds: accountIds || JSON.stringify(user?.data?.accountIds),
      year, preOrder
    };
    let response = await fetch(url2 + "/K2uJd7bnERtviUv", {
      method: "POST",
      headers: headersList,
    });
    let data = JSON.parse(await response.text());
    if (data.status == 300) {
      DestoryAuth();
    } else {
      let rawRes = { ownerPermission: false, list: data.data }
      return rawRes;
    }
  } else {
    return false
  }
}

export async function postSupportComment({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "fZY7ItyXCLWH4iO", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function postSupportAny({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "pu5OWqfUCR7Onj2", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getProductImage({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "fdhaszAFw5XNltP", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.url;
  }
}

export async function getProductImageAll({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  // let response = await fetch(url + "v3/Ftr7xyLKqgFo5MO", {
  let response = await fetch(url + "hm8CnzTBfdfjXLZ", {

    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getProductDetails({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url2 + "dLobBeDavajtlNa", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function getProductList({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "NDgzTcdHqMCCRFd", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function topProduct({ month, manufacturerId, accountIds }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url2 + "IelYpnHX2RDZxkj", {
    method: "POST",
    body: JSON.stringify({ month, manufacturerId, accountIds }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function getSessionStatus({ key, retailerId }) {

  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let response = await fetch(url + "v3/VQzxx7VoZqQrVKe", {
    method: "POST",
    body: JSON.stringify({ key, retailerId }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}
export async function getMarketingCalendar({ key, manufacturerId, year, accountIds }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url2 + "eVC3IaiEEz3x7ym", {
    method: "POST",
    body: JSON.stringify({ key, manufacturerId, year, accountIds }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());

  if (data.status == 300) {
    DestoryAuth();
  } else {
    let discount = {};
    if (data?.Discount) {
      discount = data.Discount;
    }
    return { list: data?.data, discount };
  }
}

export async function getOrderDetailsPdf({ key, opportunity_id }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/mIRX7B9FlQjmOaf/0DS68FOD7s", {
    method: "POST",
    body: JSON.stringify({ key, opportunity_id }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.file || false;
  }
}

export async function getMarketingCalendarPDF({ key, manufacturerId, month, manufacturerStr, year }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let response = await fetch(originAPi + "/mIRX7B9FlQjmOaf/Finmh4OvrI0Yc46", {
    method: "POST",
    body: JSON.stringify({ key, manufacturerId, month, manufacturerStr, year }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.file || false;
  }
}

export async function getMarketingCalendarPDFV2({ key, manufacturerId, month, manufacturerStr, year }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let response = await fetch(originAPi + "/mIRX7B9FlQjmOaf/Y6C9n4OZMqRdhvr", {
    method: "POST",
    body: JSON.stringify({ key, manufacturerId, month, manufacturerStr, year }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.file || false;
  }
}

export async function getMarketingCalendarPDFV3({ key, manufacturerId, month, manufacturerStr, year }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/mIRX7B9FlQjmOaf/H893PuzIaG1miIo", {
    method: "POST",
    body: JSON.stringify({ key, manufacturerId, month, manufacturerStr, year }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.file || false;
  }
}


export async function getAllAccountLocation({ key, accountIds }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url2 + "/GQGpen0kmGHGPtx", {
    method: "POST",
    body: JSON.stringify({ key, accountIds }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.data || [];
  }
}

export async function getAllAccountBrand({ key, accountIds }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url2 + "/EACucX1daQv1ZhN", {
    method: "POST",
    body: JSON.stringify({ key, accountIds }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());

  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.data || [];
  }
}
export async function getAllAccountOrders({ key, accountIds, month, date = null }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url2 + "UQPIByU1hllkP9m", {
    method: "POST",
    body: JSON.stringify({ key, accountIds, month, date }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.data || [];
  }
}
export async function getAllAccountSupport({ key, accountIds }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url2 + "/XIj26x1E4d2kMKg", {
    method: "POST",
    body: JSON.stringify({ key, accountIds }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.data || [];
  }
}
export async function getAllAccountStore({ key, retailerId }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url2 + "/zxkaD90Zl3tboJ6", {
    method: "POST",
    body: JSON.stringify({ key, retailerId }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data || {};
  }
}

export async function getStoreDetails({ key, Id }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url2 + "/Ne1oMmMZP2GGFUv", {
    method: "POST",
    body: JSON.stringify({ key, Id }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data || {};
  }
}

export const hexabrand = {
  a0O3b00000hym7GEAQ: "#38A3A5",
  a0O3b00000fQrZyEAK: "#9EC1DA",
  a0O1O00000XYBvQUAX: "#f6b6ad",
  a0O3b00000pY2vqEAC: "#ffe3d5",
  a0O3b00000p80IJEAY: "#fff9ed",
  a0O3b00000lCFmREAW: "#a6a0d4",
  a0ORb000000BQ0nMAG: "#206BA1",
  a0O3b00000p7zqKEAQ: "#BEE6DC",
  a0O3b00000ffNzbEAE: "#A66C98",
  a0O3b00000p4F4DEAU: "#6D597A",
  a0O3b00000p4F4CEAU: "#CBA188",
  a0ORb0000000uwfMAA: "#EFD6B1",
  a0O3b00000p4F4HEAU: "#D9D9D9",
  a0ORb000000QzsfMAC: "#B7C8B3",
  a0O1O00000XYBvkUAH: "#6D243E",
  a0O1O00000XYBvaUAH: "#4B95DD",
  a0ORb000000nDfFMAU: "#073763",
  a0ORb000000nDIiMAM: "#7f6000"
};

export const hexabrandText = {
  a0O3b00000hym7GEAQ: "#ffffff",
  a0O3b00000fQrZyEAK: "#2a516d",
  a0O1O00000XYBvQUAX: "#972111",
  a0O3b00000pY2vqEAC: "#bb3e00",
  a0O3b00000p80IJEAY: "#c58300",
  a0O3b00000lCFmREAW: "#352e66",
  a0ORb000000BQ0nMAG: "#0d2b40",
  a0O3b00000p7zqKEAQ: "#2f7967",
  a0O3b00000ffNzbEAE: "#EEDD82",
  a0O3b00000p4F4DEAU: "#ffffff",
  a0O3b00000p4F4CEAU: "#5e3d29",
  a0ORb0000000uwfMAA: "#8a5e1c",
  a0O3b00000p4F4HEAU: "#575757",
  a0ORb000000QzsfMAC: "#445840",
  a0O1O00000XYBvkUAH: "#ffffff",
  a0O1O00000XYBvaUAH: "#ffffff",
  a0ORb000000nDfFMAU: "#deb887",
  a0ORb000000nDIiMAM: "#deb887"
};

export const brandDetails =
{
  a0O3b00000hym7GEAQ: {
    img: { src: "https://beautyfashionsales.vercel.app/static/media/Byredo%20Ben%20Gorham-main.6dd86132b5ca75e66104.jpg" },
    tagLine: "REINVENTING THE WORLD OF LUXURY.",
    desc: '<p class="seti">Byredo is a European luxury brand founded in Stockholm in 2006 by Ben Gorham, with an ambition to translate memories and emotions into products and experiences.</p><p class="seti">Byredo is reinventing the world of luxury through a new approach, where creation is led by emotions, expressing a full and limitless brand universe.</p><p class="seti">Byredo conceives objects using the highest quality materials available, and high-end design details to fuel a renewed approach to modern luxury.</p><p class="seti">Byredo creates and develops a range of products such as fragrance, makeup, home, leather goods and accessories, and is sold in more than 40 countries in a very high-end exclusive network worldwide. We believe that through creativity, we are able to develop timeless products, both meaningful and inspirational, to people and their lives.</p><p class="seti">A native Swede, born to an Indian mother and a Canadian father, Ben grew up in Toronto, New York and Stockholm. He graduated from the Stockholm art school with a degree in fine arts, but a chance meeting with perfumer Pierre Wulff convinced him that he`d rather create fragrances than paintings. With no formal training in the field, Gorham, 31 years old , sought out the services of world renowned perfumers Olivia Giacobetti and Jerome Epinette, explaining his olfactory desires and letting them create the compositions. As an outsider in the beauty industry, Ben is somewhat of an anomaly and has been recognized for his personal style and connection to fashion and art in several international magazines such as French Vogue, Vanity Fair, Elle, V Magazine and Fantastic Man to name a few.</p>'
  },
  a0O3b00000fQrZyEAK: {
    img: { src: "https://beautyfashionsales.vercel.app/static/media/Diptyque-main.58df6e56a34604ee019f.webp" },
    tagLine: "AN OLFACTORY JOURNEY.",
    desc: '<p class="seti">For Diptyque, creating fragrances is an art and art is a journey. An imaginary journey of the mind and the senses across olfactory landscapes, far from the paths that others take, in search of rare raw materials and unexpected accords. A journey between the past and the future, between tradition and the avant-garde, toward another place where history, new ideas, and disruption combine.</p><p class="seti">Diptyque is always in between two worlds, finding its balance between dreams and reality, free from traditional gender codes or cultural boundaries, committed to developing connections and blends that nourish its inspiration. It is a creator of essences and images where the eye, the hand, and the nose are united to constantly revisit the surprising world of Haute Parfumerie.</p>'
  },
  a0O1O00000XYBvQUAX: {
    img: { src: "https://beautyfashionsales.vercel.app/static/media/rms-main.d3808346ce74c6385895.png" },
    tagLine: "MASTERFULLY MADE. BEAUTIFULLY CLEAN.",
    desc: '<p class="seti">A pioneer of the clean beauty movement, Rose-Marie Swift is the founder and the spirit of the brand. A master makeup artist for over 30 years, her lightbulb moment was realizing that cosmetics could be made with better, safer ingredients while simultaneously making women more beautiful. Bold, authentic, and unwavering in her quest for innovative clean ingredients that perform, she launched RMS in 2009 to clean up the industry and set a higher standard for beauty.</p><p class="seti"> If you know...you know. Just ask the world’s top supermodels and a community of loyal followers who have worn RMS for over a decade. As a professional makeup artist, it was important to Rose-Marie that RMS products were not only safe to use but could also be beautiful and long-lasting on a photo shoot, a runway show, and, of course, every day.</p><p class="seti"> RMS products are simple to understand, easy to use, and showcase the need for pure, simple, plant-based, skin-loving ingredients - and the beauty of radiant, glowing, natural human skin.</p>'
  },
  a0O3b00000pY2vqEAC: {
    img: { src: "https://beautyfashionsales.vercel.app/static/media/revive-main.6f1d78477450b18ea9ab.png" },
    tagLine: "RESEARCH. RENEWAL. RESULTS",
    desc: '<p class="seti"><b>GIVE NEW LIFE TO SKIN.</b></p><p class="seti">A high-performance, luxury skincare line developed by plastic and reconstructive surgeon Dr. Gregory Bays Brown in 1997. RéVive formulas unlock the power of Bio-Renewal Technology, a cutting edge science, which visibly transforms renews, restoring skin to a younger, healthier, more supple version of itself. This collection of bio-engineered, skin-identical peptides mimic your own bio-renewal process to help restore skin`s youthful glow.</p><p class="seti"> RéBuild your skin, from the inside, out.</p>'
  },
  a0O3b00000p80IJEAY: {
    img: { src: "https://beautyfashionsales.vercel.app/static/media/Bb.Brand-main.2d847754b231e7165727.jpg" },
    tagLine: "SUSTAINABLE LUXURY.",
    desc: '<p class="seti">Bumble and bumble began as an New York City salon in 1977, where we clipped, colored, and styled our way into prominence – with a strong design aesthetic and extraordinary products; in magazines, on runways, and backstage worldwide. Bumble and bumble has over 40+ years of salon industry expertise, owns and operates two leading flagship salons in NYC, and has salon partnerships with over 1500 independently owned salons all across North America.</p><p class="seti">Bumble and bumble is inspired by masters of the craft: hairstylists and colorists obsessed with technical and artistic excellence through bold self-expression. Bumble and bumble invents products to meet these professional, exacting standards that are also easy enough for anyone to use: from the iconic wave-enhancing Surf Spray to the best-selling mega-moisturizing Hairdresser`s Invisible Oil range. These well-loved products are used by pros in Bumble and bumble salons and by millions of people around the world at home every day. Bumble and bumble creates products for all hair types, textures, and style preferences with uncompromising quality to instantly elevate your personal style with an effortlessly modern look. We are deeply, passionately, and fearlessly dedicated to the craft of hair. </p>'
  },
  a0O3b00000lCFmREAW: {
    img: { src: "https://beautyfashionsales.vercel.app/static/media/Smashbox.a7d1cb75ff5bffb7c858.jpg" },
    tagLine: "CREATIVITY, COMMUNITY, AND COLLABORATION.",
    desc: '<p class="seti">Everyone has a story. Ours is original and authentic and sets us apart from every other beauty brand. We`re proud of our story, and this is how we tell it: We live for lipstick. We get excited about primers. (No, seriously, we do.) But mostly, we love sharing our makeup secrets with you. Why? Because creativity and collaboration are at the core of our DNA. We are the only brand born out of a legendary photo studio — Smashbox Studios in Los Angeles — where major photographers, celebrities and makeup artists converge to create iconic images every day. Studio-tested, shockingly high-performance. Longwearing and skincaring. Artistry made easy. Hardworking makeup that keeps up with you.</p>'
  },
  a0ORb000000BQ0nMAG: {
    img: { src: "https://beautyfashionsales.vercel.app/static/media/VictoriaBeckhamBeauty.d9fff66659d48dffd704.png" },
    tagLine: "PURE EXCELLENCE IN EVERY WAY. THAT'S THE VICTORIA STANDARD.",
    desc: '<p class="seti">Through the perfume of memory, Victoria Beckham distills the notes of eras and atmospheres into fragrances founded in personal yet universal associations. Drawing on stages of her life and their parallels to a pop culture shared by all, each scent captures her own recollections of distinct times, places, and experiences and mirrors them in our collective and individual reminiscences.</p>'
  },
  a0O3b00000p7zqKEAQ: {
    img: { src: "https://beautyfashionsales.vercel.app/static/media/bobbi-brown-main.d67c6c3e9732a993f1c2.png" },
    tagLine: "BEGIN WITH SKIN. GLOW FROM WITHIN.",
    desc: '<p class="seti">In 1991, Bobbi Brown was founded by a female makeup artist in New York, designed for the world--your world. We offer approachable artistry and create beauty must-haves that look good, work hard, and stay fresh every hour of the day.</p><p class="seti">We remain women-first, champions of individual beauty, original owners of healthy, glowing skin, with the most premium products and effortless artistry, and expanding the brand and line in a way that is even more relevant to today’s consumer.</p>'
  },
  a0O3b00000ffNzbEAE: {
    img: { src: "https://beautyfashionsales.vercel.app/static/media/Maison%20Margiela-main.a172327e11f40992d628.webp" },
    tagLine: "SMELLS LIKE MEMORIES.",
    desc: '<p class="seti">Maison Margiela is a Parisian haute couture house founded on ideas of nonconformity and the subversion of norms. Appointed Creative Director in 2014, the British couturier John Galliano exercises his visual language to expand on the grammar of Maison Margiela, creating a new technical vocabulary that cements the house’s position as a singular and autonomous entity in the realm of luxury.</p><p class="seti">In 1994, Maison Margiela introduced the first "REPLICA" fashion pieces: garments and accessories hand-picked throughout the world and meticulously reproduced, preserving their character and charm. Each piece features a special label inside, describing the source and period of the original item.</p><p class="seti">In 2012, Maison Margiela expanded on this unique concept with a collection of fragrances: the scents your memories are made of. The "REPLICA" collection assembles iconcolast fragrances that have the universal power to trigger personally cherished moments, personal stories lived or to be lived.</p>'
  },
  a0O3b00000p4F4DEAU: {
    img: { src: "https://beautyfashionsales.vercel.app/static/media/estee-launder-main.49ed7ad83e9ca188b827.png" },
    tagLine: "CREATING THE FUTURE OF BEAUTY TOGETHER.",
    desc: '<p class="seti">Estée Lauder is the flagship brand of The Estée Lauder Companies Inc. Founded by Estée Lauder, one of the world’s first female entrepreneurs, the brand today continues her legacy of creating the most innovative, sophisticated, high-performance skin care and makeup products and iconic fragrances — all infused with a deep understanding of women’s needs and desires. Today Estée Lauder engages with women in over 150 countries and territories around the world and at a variety of touch points, in stores and online. And each of these relationships consistently reflects Estée’s powerful and authentic woman-to-woman point of view.</p><p class="seti">In 1946, Mrs. Estée Lauder started with four cremes and a dream. With grit and persistence, she paved her own way in the beauty industry—going from selling her cremes in salons to selling them on the shelves of stores around the world.</p><p class="seti">At a time when the beauty industry was ruled by men, Estée was the original girl boss, breaking glass ceilings and defying expectations at every turn. She was a true influencer, connecting with and giving honest, real-world beauty advice to women around the world.</p><p class="seti">Her life’s passion was to make everyone look and feel their most beautiful, and it’s this same spirit and high-touch experience that we strive to bring to every customer today.</p>'
  },
  a0O1O00000XYBvkUAH: {
    img: { src: "https://beautyfashionsales.vercel.app/static/media/kevy-auc-main.25b5d3519359b521f0ac.png" },
    tagLine: "BEAUTY BELONGS TO THE BRAVE",
    desc: '<p class="seti">Kevyn Aucoin Beauty was founded in 2001 by one of the most iconic and influential makeup artists of all time. In the 90s, Kevyn became the first celebrity makeup artist with clients like Cindy Crawford, Naomi Campbell, Kate Moss, Cher, Whitney Houston, Madonna, Liza Minelli, Barbara Streisand, Tina Turner, and Jennifer Lopez. He perfected and brought fame to many iconic makeup techniques like contouring and the “J.Lo glow” leading him to become the first-ever makeup artist to receive a CFDA Award .</p><p class="seti">Kevyn tragically passed away in 2002, but not before launching his legacy brand– Kevyn Aucoin Beauty, where Kevyn’s spirit lives on today: It’s unapologetic, brave, and rather quite fearless.</p><p class="seti">Kevyn believed that every woman is beautiful within, and makeup was simply his tool for helping her discover that beauty. He was a man and an artist decades ahead of his time, which paved the way for innovative, award-winning products, high-performance formulas, and textures.</p><p class="seti">His luxurious textures and expansive shade ranges have had a broad appeal globally for 20 years, when most brands had a limited shade range. He was a true industry pioneer who championed inclusivity, originality, empowerment and education, which remain pillars of the brand today.</p>'
  },
  a0O1O00000XYBvaUAH: {
    img: { src: "https://beautyfashionsales.vercel.app/static/media/By-terry-main.c479f0be0d3cb5bb50c3.png" },
    tagLine: "PARISIAN-BORN, SKINCARE-INFUSED MAKEUP.",
    desc: '<p class="seti">Terry de Gunzburg is a trailblazing industry legend who over the course of the past 30 years has changed the face of beauty.</p><p class="seti">Trading a career in medicine for a more creative life, Terry studied at the Carita beauty school in Paris and quickly became an in-demand makeup artist working with some of the biggest names in fashion. Her trademark beauty look has always been distinctive: imperceptible foundation, impeccable lips and thick, separated lashes.</p><p class="seti">As International Makeup Designer of YSL Beauté for 15 years, Terry invented the iconic Touché Eclat in 1992 (as well as countless other products and formulas). Radiance and a healthy complexion has always been key to Terry’s approach to make up, and so she decided to launch her own collection of products in 1998, and BY TERRY was born.</p><p class="seti">In 2004 after a mix up in the lab, double the amount of rose butter was added to a lip balm which would soon become BY TERRY’s most successful product: Baume de Rose. Described as the Rolls Royce of lip balms, it symbolizes everything the brand stands for—luxury, indulgence and a timelessness.</p><p class="seti">Almost 10 years ago, before hyaluronic acid was widely known by households worldwide, Terry created the first clean mattifying setting powder, the Hyaluronic Hydra-Powder. This was the start of Terry’s one of a kind Hyaluronic Range. We remain today pioneers of this ingredient and its applications. </p>'
  },

  a0O3b00000p4F4CEAU: {
    img: {},
    tagLine: null,
    desc: null
  },
  a0ORb0000000uwfMAA: {
    img: {},
    tagLine: null,
    desc: null
  },
  a0O3b00000p4F4HEAU: {
    img: {},
    tagLine: null,
    desc: null
  },
  a0ORb000000QzsfMAC: {
    img: {},
    tagLine: null,
    desc: null
  },
  a0ORb000000nDfFMAU: {
    img: {},
    tagLine: null,
    desc: null
  },
  a0ORb000000nDIiMAM: {
    img: {},
    tagLine: null,
    desc: null
  }
}

export const productGuides = {
  productKey1: {
    Categoryname: "Access",
    filename: "How to Access BFSG Retailer Portal Video.mp4",
    OriginalFileName: "how-to-access-bfsg-retailer-portal-video",
    Link: "help/how-to-access-bfsg-retailer-portal-video.mp4",
    Type: "Video",
  },
  productKey2: {

    Categoryname: "Access",
    filename: "How To Access BFSG Retailer Portal.pdf",
    OriginalFileName: "how-to-access-bfsg-retailer-portal",
    Link: "help/how-to-access-bfsg-retailer-portal.pdf",
    Type: "pdf",

    // Direct link to the video file
  },
  productKey3: {
    Categoryname: "Customer Service",

    Link: "help/how-to-report-incorrect-charges.pdf",
    filename: "How To Report Incorrect Charges.pdf",
    OriginalFileName: "how-to-report-incorrect-charges",
    Type: "Pdf",

    // Direct link to the video file
  },
  productKey4: {
    Categoryname: "Customer Service",
    Link: "help/how-to-report-product-damages-video.mp4",
    filename: "How to Report Product Damages Video.mp4",
    OriginalFileName: "how-to-report-product-damages-video",
    Type: "Video",
  },
  productKey5: {
    Categoryname: "Customer Service",
    Link: "help/how-to-report-product-damages.pdf",
    filename: "How To Report Product Damages.pdf",
    OriginalFileName: "how-to-report-product-damages",
    Type: "pdf",

    // Direct link to the video file
  },
  productKey6: {
    Categoryname: "Customer Service",
    Link: "help/how-to-report-product-shortage.pdf",
    filename: "How To Report Product Shortage.pdf",
    OriginalFileName: "how-to-report-product-shortage",
    Type: "pdf",

    // Direct link to the video file
  },
  productKey7: {
    Categoryname: "Customer Service",
    Link: "help/how-to-report-product-shortages-video.mp4",
    filename: "How to Report Product Shortages Video.mp4",
    OriginalFileName: "how-to-report-product-shortages-video",
    Type: "Video",

    // Direct link to the video file
  },
  productKey8: {
    Categoryname: "Customer Service",
    Link: "help/how-to-request-invoice-tracking-number-order-status.pdf",
    filename: "How To Request Invoice Tracking Number Order Status.pdf",
    OriginalFileName: "	how-to-request-invoice-tracking-number-order-status",
    Type: "pdf",

    // Direct link to the video file
  },
  productKey9: {
    Categoryname: "Marketing Calender",
    Link: "help/how-to-marketing-calendar-video.mp4",
    filename: "How To Marketing Calendar Video.mp4",
    OriginalFileName: "how-to-marketing-calendar-video",
    Type: "Video",

    // Direct link to the video file
  },
  productKey10: {
    Categoryname: "Marketing Calender",
    Link: "help/how-to-marketing-calendar.pdf",
    filename: "How To Marketing Calendar.pdf",
    OriginalFileName: "how-to-marketing-calendar",
    Type: "pdf",

    // Direct link to the video file
  },
  productKey11: {
    Categoryname: "Orders",
    Link: "help/how-to-place-an-event-order-for-elc-brand.pdf",
    filename: "How To Place an Event order for ELC brand.pdf",
    OriginalFileName: "how-to-place-an-event-order-for-elc-brand",
    Type: "pdf",

    // Direct link to the video file
  },

  productKey12: {
    Categoryname: "Orders",
    Link: "help/how-to-place-an-event-order-video.mp4",
    filename: "How to Place an Event Order Video.mp4",
    OriginalFileName: "how-to-place-an-event-order-video",
    Type: "Video",

    // Direct link to the video file
  },
  productKey13: {
    Categoryname: "Orders",
    Link: "help/how-to-place-an-order-video.mp4",
    filename: "How To Place an Order Video.mp4",
    OriginalFileName: "how-to-place-an-order-video",
    Type: "Video",

    // Direct link to the video file
  },
  productKey14: {
    Categoryname: "Orders",
    Link: "help/how-to-place-an-order.pdf",
    filename: "How To Place an Order.pdf",
    OriginalFileName: "how-to-place-an-order",
    Type: "pfd",

    // Direct link to the video file
  },
  productKey15: {
    Categoryname: "Orders",
    Link: "help/how-to-place-preorders-video.mp4",
    filename: "How To Place Preorders Video.mp4",
    OriginalFileName: "how-to-place-preorders-video",
    Type: "Video",

    // Direct link to the video file
  },
  productKey16: {
    Categoryname: "Orders",
    Link: "help/how-to-place-preorders.pdf",
    filename: "How to Place Preorders.pdf",
    OriginalFileName: "how-to-place-preorders",
    Type: "pdf",


    // Direct link to the video file
  },


};

export function isDateEqualOrGreaterThanToday(dateString) {
  // Parse the input date string
  const inputDate = new Date(dateString);
  // Get today's date
  const today = new Date();

  // Set time to 00:00:00 to compare only dates
  today.setHours(0, 0, 0, 0);

  // Compare the dates
  return today >= inputDate;
}


export function DateConvert(dateString, timeStamp = false) {
  if (timeStamp) {
    const options = { year: "numeric", month: "long", day: "numeric" }
    dateString = new Date(dateString).toLocaleDateString(undefined, options)
    return dateString
  }
  if (dateString) {
    const [year, month, day] = dateString.split(/[-/]/);
    if (day && month && year) {
      let parsedDate = new Date(`${month}/${day}/${year}`);
      if (!isNaN(parsedDate.getTime())) {
        const options = { day: "numeric", month: "short", year: "numeric" };
        let launchDateFormattedDate = new Intl.DateTimeFormat("en-US", options).format(new Date(parsedDate));
        return launchDateFormattedDate;
      }
    }
    // throw new Error("Invalid date string");
  }
}
