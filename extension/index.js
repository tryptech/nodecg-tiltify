// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"eGA2g":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "WEBHOOK_MODE", ()=>WEBHOOK_MODE);
var _utils = require("./utils");
let WEBHOOK_MODE = true;
module.exports = function(nodecg) {
    if ((0, _utils.isEmpty)(nodecg.bundleConfig.tiltify_webhook_secret) || (0, _utils.isEmpty)(nodecg.bundleConfig.tiltify_webhook_id)) {
        WEBHOOK_MODE = false;
        nodecg.log.info("Running without webhooks!! Please set webhook secret, and webhook id in cfg/nodecg-tiltify.json [See README]");
        return;
    }
    if ((0, _utils.isEmpty)(nodecg.bundleConfig.tiltify_client_id)) {
        nodecg.log.info("Please set tiltify_client_id in cfg/nodecg-tiltify.json");
        return;
    }
    if ((0, _utils.isEmpty)(nodecg.bundleConfig.tiltify_client_secret)) {
        nodecg.log.info("Please set tiltify_client_secret in cfg/nodecg-tiltify.json");
        return;
    }
    if ((0, _utils.isEmpty)(nodecg.bundleConfig.tiltify_campaign_id)) {
        nodecg.log.info("Please set tiltify_campaign_id in cfg/nodecg-tiltify.json");
        return;
    }
    // Store nodecg for retrieval elsewhere
    (0, _utils.storeNodeCG)(nodecg);
    // Then load replicants
    require("15fdd44a8f855e3c");
    // Then load everything else
    require("46530f9395d93196");
    require("ca2eb03e7996e1ed");
    require("f618f68817b826df");
};

},{"./utils":"lWrRP","15fdd44a8f855e3c":"b5GEq","46530f9395d93196":"fs7Xx","ca2eb03e7996e1ed":"6cgjI","f618f68817b826df":"fkvZo","@parcel/transformer-js/src/esmodule-helpers.js":"9VN6q"}],"lWrRP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "storeNodeCG", ()=>storeNodeCG);
parcelHelpers.export(exports, "getNodeCG", ()=>getNodeCG);
parcelHelpers.export(exports, "isEmpty", ()=>isEmpty);
let nodecg;
function storeNodeCG(ncg) {
    nodecg = ncg;
}
function getNodeCG() {
    return nodecg;
}
function isEmpty(string) {
    return string === undefined || string === null || string === "";
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"9VN6q"}],"9VN6q":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"b5GEq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "donations", ()=>donations);
parcelHelpers.export(exports, "allDonations", ()=>allDonations);
parcelHelpers.export(exports, "campaignTotal", ()=>campaignTotal);
parcelHelpers.export(exports, "polls", ()=>polls);
parcelHelpers.export(exports, "schedule", ()=>schedule);
parcelHelpers.export(exports, "targets", ()=>targets);
parcelHelpers.export(exports, "rewards", ()=>rewards);
parcelHelpers.export(exports, "milestones", ()=>milestones);
parcelHelpers.export(exports, "donors", ()=>donors);
var _ = require(".");
const nodecg = (0, _.getNodeCG)();
const donations = nodecg.Replicant("donations");
const allDonations = nodecg.Replicant("alldonations");
const campaignTotal = nodecg.Replicant("total");
const polls = nodecg.Replicant("polls");
const schedule = nodecg.Replicant("schedule");
const targets = nodecg.Replicant("targets");
const rewards = nodecg.Replicant("rewards");
const milestones = nodecg.Replicant("milestones");
const donors = nodecg.Replicant("donors");

},{".":"lWrRP","@parcel/transformer-js/src/esmodule-helpers.js":"9VN6q"}],"fs7Xx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "tiltifyEmitter", ()=>tiltifyEmitter);
var _tiltifyApiClient = require("@ericthelemur/tiltify-api-client");
var _tiltifyApiClientDefault = parcelHelpers.interopDefault(_tiltifyApiClient);
var _nodeCrypto = require("crypto");
var _nodeStream = require("stream");
var _indexExtension = require("./index.extension");
var _utils = require("./utils");
var _currency = require("./utils/currency");
var _replicants = require("./utils/replicants");
const nodecg = (0, _utils.getNodeCG)();
const tiltifyEmitter = new (0, _nodeStream.EventEmitter)();
var client = new (0, _tiltifyApiClientDefault.default)(nodecg.bundleConfig.tiltify_client_id, nodecg.bundleConfig.tiltify_client_secret);
const app = nodecg.Router();
function pushUniqueDonation(donation) {
    var found = _replicants.donations.value.find(function(element) {
        return element.id === donation.id;
    });
    if (found === undefined) {
        donation.read = false;
        donation.shown = false;
        donation.modStatus = null;
        (0, _currency.convertValue)(donation);
        tiltifyEmitter.emit("new-donation", donation);
        _replicants.donations.value.push(donation);
    }
}
function updateTotal(campaign) {
    // Less than check in case webhooks are sent out-of-order. Only update the total if it's higher!
    if (Number(_replicants.campaignTotal.value.value) < Number(campaign.amount_raised.value) || _replicants.campaignTotal.value.currency != campaign.amount_raised.currency) _replicants.campaignTotal.value = campaign.amount_raised;
}
/**
 * Verifies that the payload delivered matches the signature provided, using sha256 algorithm and the webhook secret
 * Acts as middleware, use in route chain
 */ function validateSignature(req, res, next) {
    const signatureIn = req.get("X-Tiltify-Signature");
    const timestamp = req.get("X-Tiltify-Timestamp");
    const signedPayload = `${timestamp}.${JSON.stringify(req.body)}`;
    const hmac = (0, _nodeCrypto.createHmac)("sha256", nodecg.bundleConfig.tiltify_webhook_secret);
    hmac.update(signedPayload);
    const signature = hmac.digest("base64");
    if (signatureIn === signature) next();
    else // Close connection (200 code MUST be sent regardless)
    res.sendStatus(200);
}
app.post("/nodecg-tiltify/webhook", validateSignature, (req, res)=>{
    var _req_body;
    // Verify this webhook is sending out stuff for the campaign we're working on
    if (((_req_body = req.body) === null || _req_body === void 0 ? void 0 : _req_body.meta.event_type) === "public:direct:donation_updated" // &&
    ) // New donation
    pushUniqueDonation(req.body.data);
    else if (req.body.meta.event_type === "public:direct:fact_updated" // &&
    ) // Updated amount raised
    updateTotal(req.body.data);
    // Send ack
    res.sendStatus(200);
});
async function askTiltifyForDonations() {
    client.Campaigns.getRecentDonations(nodecg.bundleConfig.tiltify_campaign_id, function(donations) {
        for(let i = 0; i < donations.length; i++)pushUniqueDonation(donations[i]);
    });
}
async function askTiltifyForAllDonations() {
    client.Campaigns.getDonations(nodecg.bundleConfig.tiltify_campaign_id, function(alldonations) {
        if (JSON.stringify(_replicants.allDonations.value) !== JSON.stringify(alldonations)) _replicants.allDonations.value = alldonations;
    });
}
async function askTiltifyForPolls() {
    client.Campaigns.getPolls(nodecg.bundleConfig.tiltify_campaign_id, function(polls) {
        if (JSON.stringify(_replicants.polls.value) !== JSON.stringify(polls)) _replicants.polls.value = polls;
    });
}
async function askTiltifyForSchedule() {
    client.Campaigns.getSchedule(nodecg.bundleConfig.tiltify_campaign_id, function(schedule) {
        if (JSON.stringify(_replicants.schedule.value) !== JSON.stringify(schedule)) _replicants.schedule.value = schedule;
    });
}
async function askTiltifyForTargets() {
    client.Campaigns.getTargets(nodecg.bundleConfig.tiltify_campaign_id, function(targets) {
        if (JSON.stringify(_replicants.targets.value) !== JSON.stringify(targets)) _replicants.targets.value = targets;
    });
}
async function askTiltifyForRewards() {
    client.Campaigns.getRewards(nodecg.bundleConfig.tiltify_campaign_id, function(rewards) {
        if (JSON.stringify(_replicants.rewards.value) !== JSON.stringify(rewards)) _replicants.rewards.value = rewards;
    });
}
async function askTiltifyForMilestones() {
    client.Campaigns.getMilestones(nodecg.bundleConfig.tiltify_campaign_id, function(milestones) {
        if (JSON.stringify(_replicants.milestones.value) !== JSON.stringify(milestones)) _replicants.milestones.value = milestones;
    });
}
async function askTiltifyForDonors() {
    client.Campaigns.getDonors(nodecg.bundleConfig.tiltify_campaign_id, function(donors) {
        if (JSON.stringify(_replicants.donors.value) !== JSON.stringify(donors)) _replicants.donors.value = donors;
    });
}
async function askTiltifyForTotal() {
    client.Campaigns.get(nodecg.bundleConfig.tiltify_campaign_id, function(campaign) {
        updateTotal(campaign);
    });
}
function askTiltify() {
    // Donations and total are handled by websocket normally, only ask if not using websockets
    if (!(0, _indexExtension.WEBHOOK_MODE)) {
        askTiltifyForDonations();
        askTiltifyForTotal();
    }
    askTiltifyForPolls();
    askTiltifyForTargets();
    askTiltifyForSchedule();
    askTiltifyForRewards();
    askTiltifyForMilestones();
    askTiltifyForDonors();
}
client.initialize().then(()=>{
    if (0, _indexExtension.WEBHOOK_MODE) {
        client.Webhook.activate(nodecg.bundleConfig.tiltify_webhook_id, ()=>{
            nodecg.log.info("Webhooks staged!");
        });
        const events = {
            "event_types": [
                "public:direct:fact_updated",
                "public:direct:donation_updated"
            ]
        };
        client.Webhook.subscribe(nodecg.bundleConfig.tiltify_webhook_id, nodecg.bundleConfig.tiltify_campaign_id, events, ()=>{
            nodecg.log.info("Webhooks activated!");
        });
    }
    askTiltifyForTotal();
    askTiltify();
    askTiltifyForAllDonations();
    setInterval(function() {
        askTiltify();
    }, (0, _indexExtension.WEBHOOK_MODE) ? 10000 : 5000);
    setInterval(function() {
        askTiltifyForAllDonations();
    }, 300000);
});
nodecg.mount(app);

},{"@ericthelemur/tiltify-api-client":"@ericthelemur/tiltify-api-client","node:crypto":"node:crypto","node:stream":"node:stream","./index.extension":"eGA2g","./utils":"lWrRP","./utils/currency":"fkvZo","./utils/replicants":"b5GEq","@parcel/transformer-js/src/esmodule-helpers.js":"9VN6q"}],"fkvZo":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "conversionRates", ()=>conversionRates);
parcelHelpers.export(exports, "convertValue", ()=>convertValue);
var _ = require(".");
var _replicants = require("./replicants");
const nodecg = (0, _.getNodeCG)();
var conversionRates = {
    USD: 1.2461833299,
    AUD: 1.9125802417,
    BRL: 6.1138013225,
    CAD: 1.7095394992,
    DKK: 8.5156950429,
    EUR: 1.1418281377,
    GBP: 1.0,
    JPY: 186.4645194486,
    MXN: 21.4624577112,
    NOK: 13.4646396158,
    NZD: 2.079581301,
    PLN: 5.0062181164
};
if (nodecg.bundleConfig.freecurrencyapi_key) fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${nodecg.bundleConfig.freecurrencyapi_key}&base_currency=${nodecg.bundleConfig.display_currency}`).then((r)=>r.json()).then((j)=>{
    conversionRates = j.data;
    nodecg.log.info("Conversion rates loaded, refreshing all conversions");
    convertAll();
});
else convertAll();
function convertAll() {
    console.log("Converting all currencies");
    (0, _replicants.donations).value.forEach(convertValue);
}
function convertValue(dono) {
    const disp = nodecg.bundleConfig.display_currency;
    if (disp === undefined) return;
    var val;
    if (dono.amount.currency == disp) val = Number(dono.amount.value);
    else if (dono.amount.currency in conversionRates) val = Number(dono.amount.value) / conversionRates[dono.amount.currency];
    else return;
    if (!dono.displayAmount || dono.displayAmount.value !== val) dono.displayAmount = {
        currency: disp,
        value: val.toString()
    };
}

},{".":"lWrRP","./replicants":"b5GEq","@parcel/transformer-js/src/esmodule-helpers.js":"9VN6q"}],"6cgjI":[function(require,module,exports) {
var _utils = require("./utils");
var _mod = require("./utils/mod");
var _replicants = require("./utils/replicants");
const nodecg = (0, _utils.getNodeCG)();
function setAll(prop, value, ack) {
    for(let i = 0; i < _replicants.donations.value.length; i++)_replicants.donations.value[i][prop] = value;
    if (ack && !ack.handled) ack(null, value);
}
nodecg.listenFor("clear-donations", (value, ack)=>{
    setAll("read", true, ack);
});
nodecg.listenFor("approve-all-donations", (value, ack)=>{
    setAll("modStatus", value, ack);
});
function searchAndSet(id, prop, value, ack) {
    nodecg.log.info("Mark", prop, id, value);
    var elementIndex = _replicants.donations.value.findIndex((d)=>d.id === id);
    if (elementIndex !== -1) {
        const elem = _replicants.donations.value[elementIndex];
        if (elem[prop] != value) elem[prop] = value;
        if (ack && !ack.handled) ack(null, null);
        return _replicants.donations.value[elementIndex];
    } else {
        if (ack && !ack.handled) {
            nodecg.log.error("Donation not found to mark as read | id:", id);
            ack(new Error("Donation not found to mark as read"), null);
        }
        return undefined;
    }
}
nodecg.listenFor("set-donation-read", ([dono, readVal], ack)=>{
    const d = searchAndSet(dono.id, "read", readVal, ack);
    if (d && readVal && d.modStatus === (0, _mod.UNDECIDED)) d.modStatus = (0, _mod.APPROVED);
});
nodecg.listenFor("set-donation-shown", ([dono, shownVal], ack)=>{
    searchAndSet(dono.id, "shown", shownVal, ack);
});
nodecg.listenFor("set-donation-modstatus", ([dono, statusVal], ack)=>{
    const d = searchAndSet(dono.id, "modStatus", statusVal, ack);
    if (d && !d.shown && statusVal === (0, _mod.APPROVED)) nodecg.sendMessage("show-dono", dono);
    if (d && d.shown && statusVal !== (0, _mod.APPROVED)) nodecg.sendMessage("revoke-dono", dono);
});

},{"./utils":"lWrRP","./utils/mod":"8q1g9","./utils/replicants":"b5GEq"}],"8q1g9":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "APPROVED", ()=>APPROVED);
parcelHelpers.export(exports, "UNDECIDED", ()=>UNDECIDED);
parcelHelpers.export(exports, "CENSORED", ()=>CENSORED);
parcelHelpers.export(exports, "tripleState", ()=>tripleState);
const APPROVED = true, UNDECIDED = null, CENSORED = false;
function tripleState(v, appVal, undecVal, cenVal) {
    // Shorthand for setting a value for each of the 3 mod states
    return v === APPROVED ? appVal : v === CENSORED ? cenVal : undecVal;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"9VN6q"}]},["eGA2g"], "eGA2g", "parcelRequirebf45")

//# sourceMappingURL=index.js.map
