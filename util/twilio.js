const accountSid = "ACd349a28375eba4390a900582cb445104";
const authToken = "39da592500ddd331877bc5aa82add448";
const verifySid = "VAe0975db36cfc398539e785fc2699e52b";
const client = require("twilio")(accountSid, authToken);
const express = require('express')

module.exports = {
  sentotp: (number) => {
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: `+91 ${number} `, channel: "sms" })
  },
  check: async (otpCode, number) => {
    try {
      const status = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: `+91 ${number}`, code: otpCode });
      return status
    } catch (err) {
      console.log(err);
    }
  }
}
