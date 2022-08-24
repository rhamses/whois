const functions = require("firebase-functions");
const whois = require("whois");
const whoiser = require("whoiser");
const cors = require("cors")({ origin: true });
const { format, parseISO } = require("date-fns");
/**
 * @param {string} rawData
 * @return {string} data
 */
function transformData(rawData) {
  let data = rawData.trim().split(" ")[0];
  data = parseISO(data);
  data = format(data, "dd/MM/yyyy");
  return data;
}
/**
 * @param {object} rawWhois
 * @return {data}
 */
function filterWhois(rawWhois) {
  const arrWhois = rawWhois.split("\n");
  const data = { raw: {} };
  for (let lineWhois of arrWhois) {
    let prop = lineWhois.split(": ")[0].toLowerCase().replaceAll(" ", "_");
    const value = lineWhois.split(": ")[1];
    lineWhois = lineWhois.toLowerCase();
    if (prop.includes("creat") && typeof value === "string") {
      data["createdAt"] = transformData(value);
    } else if (prop.includes("expir") && typeof value === "string") {
      data["expiresIn"] = transformData(value);
    } else if (prop.includes("status") && typeof value === "string") {
      if (value.toLocaleLowerCase().includes("prohibited")) {
        data["status"] = "It's secret";
      } else {
        data["status"] = value.trim().split(" ")[0];
      }
    } else if (prop.includes("updat") && typeof value === "string") {
      data["updatedAt"] = transformData(value);
    } else if (prop.includes("changed") && typeof value === "string") {
      data["updatedAt"] = transformData(value);
    } else {
      if (
        value == "no entries found" ||
        value == "this output has been filtered."
      ) {
        data[prop] = value.trim();
      } else {
        prop = prop.replaceAll("_", " ");
        if (typeof value === "string") data.raw[prop] = value.trim();
      }
    }
  }
  return data;
}
/**
 * @param {string} domain
 * @return {string}
 */
function whoisExec(domain) {
  return new Promise((resolve, reject) => {
    whois.lookup(domain, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(data);
        const filteredData = filterWhois(data);
        resolve(filteredData);
      }
    });
  });
}
/**
 * @param {string} domain
 * @return {string}
 */
async function whoiserExec(domain) {
  const info = await whoiser(domain);
  const result = {};
  const infoKeys = Object.keys(info);
  for (const key of infoKeys) {
    Object.assign(result, info[key]);
  }
  return result;
}

exports.whois = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    if (!request.body.domain) {
      response.status(404).send("Parameter Not Found");
      return;
    }
    const domain = request.body.domain;
    const whois = await whoiserExec(domain);
    response.send(whois);
  });
});
