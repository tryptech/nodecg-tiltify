import type NodeCG from '@nodecg/types';
import type { Donation, Donations, Configschema, Alldonations, Total, Donationpolls, Schedule, Targets, Rewards, Milestones, Donors, Campaign } from '../types/schemas';
import { createHmac } from "node:crypto";
import { EventEmitter } from 'node:events';
import TiltifyClient from "@ericthelemur/tiltify-api-client";
import { NextFunction } from 'express';
import { Request, Response } from "express-serve-static-core";

let WEBHOOK_MODE = true
declare var nodecg: NodeCG.ServerAPI;


module.exports = function (nodecg: NodeCG.ServerAPI<Configschema>) {
	const tiltifyEmitter = new EventEmitter();

	const donations = nodecg.Replicant('donations', "nodecg-tiltify") as unknown as NodeCG.ServerReplicantWithSchemaDefault<Donations>;
	donations.on("change", (nv) => console.log(nv));

	const app = nodecg.Router();
	tiltifyEmitter.on("new-donation", (d: Donation) => {
		d.shown = false;
		d.read = false;
	});

	var donationsRep = nodecg.Replicant("donations", { defaultValue: [] }) as unknown as NodeCG.ServerReplicantWithSchemaDefault<Donations>;
	var allDonationsRep = nodecg.Replicant("alldonations", { defaultValue: [] }) as unknown as NodeCG.ServerReplicantWithSchemaDefault<Alldonations>;
	var campaignTotalRep = nodecg.Replicant("total", { defaultValue: 0 }) as unknown as NodeCG.ServerReplicantWithSchemaDefault<Total>;
	var pollsRep = nodecg.Replicant("donationpolls", { defaultValue: [] }) as unknown as NodeCG.ServerReplicantWithSchemaDefault<Donationpolls>;
	var scheduleRep = nodecg.Replicant("schedule", { defaultValue: [] }) as unknown as NodeCG.ServerReplicantWithSchemaDefault<Schedule>;
	var targetsRep = nodecg.Replicant("targets", { defaultValue: [] }) as unknown as NodeCG.ServerReplicantWithSchemaDefault<Targets>;
	var rewardsRep = nodecg.Replicant("rewards", { defaultValue: [] }) as unknown as NodeCG.ServerReplicantWithSchemaDefault<Rewards>;
	var milestonesRep = nodecg.Replicant("milestones", { defaultValue: [] }) as unknown as NodeCG.ServerReplicantWithSchemaDefault<Milestones>;
	var donorsRep = nodecg.Replicant("donors", { defaultValue: [] }) as unknown as NodeCG.ServerReplicantWithSchemaDefault<Donors>;

	function isEmpty(string: string | undefined | null) {
		return string === undefined || string === null || string === ""
	}

	if (isEmpty(nodecg.bundleConfig.tiltify_webhook_secret) || isEmpty(nodecg.bundleConfig.tiltify_webhook_id)) {
		WEBHOOK_MODE = false
		nodecg.log.info("Running without webhooks!! Please set webhook secret, and webhook id in cfg/nodecg-tiltify.json [See README]");
		return;
	}

	if (isEmpty(nodecg.bundleConfig.tiltify_client_id)) {
		nodecg.log.info("Please set tiltify_client_id in cfg/nodecg-tiltify.json");
		return;
	}

	if (isEmpty(nodecg.bundleConfig.tiltify_client_secret)) {
		nodecg.log.info("Please set tiltify_client_secret in cfg/nodecg-tiltify.json");
		return;
	}

	if (isEmpty(nodecg.bundleConfig.tiltify_campaign_id)) {
		nodecg.log.info(
			"Please set tiltify_campaign_id in cfg/nodecg-tiltify.json"
		);
		return;
	}

	var client = new TiltifyClient(nodecg.bundleConfig.tiltify_client_id, nodecg.bundleConfig.tiltify_client_secret);

	function pushUniqueDonation(donation: Donation) {
		var found = donationsRep.value.find(function (element: Donation) {
			return element.id === donation.id;
		});
		if (found === undefined) {
			tiltifyEmitter.emit("new-donation", donation);
			donationsRep.value.push(donation);
		}
	}

	function updateTotal(campaign: Campaign) {
		// Less than check in case webhooks are sent out-of-order. Only update the total if it's higher!
		if (campaignTotalRep.value < parseFloat(campaign.amount_raised.value)
		) {
			campaignTotalRep.value = parseFloat(campaign.amount_raised.value);
		}
	}

	/**
	 * Verifies that the payload delivered matches the signature provided, using sha256 algorithm and the webhook secret
	 * Acts as middleware, use in route chain
	 */
	function validateSignature(req: Request, res: Response, next: NextFunction) {
		const signatureIn = req.get('X-Tiltify-Signature')
		const timestamp = req.get('X-Tiltify-Timestamp')
		const signedPayload = `${timestamp}.${JSON.stringify(req.body)}`
		const hmac = createHmac('sha256', nodecg.bundleConfig.tiltify_webhook_secret as string);
		hmac.update(signedPayload);
		const signature = hmac.digest('base64');
		if (signatureIn === signature) {
			next()
		} else {
			// Close connection (200 code MUST be sent regardless)
			res.sendStatus(200)
		};
	}

	app.post('/nodecg-tiltify/webhook', validateSignature, (req: Request, res: Response) => {
		// Verify this webhook is sending out stuff for the campaign we're working on
		if (
			req.body?.meta.event_type === "public:direct:donation_updated" // &&
			// req.body.data.campaign_id === nodecg.bundleConfig.tiltify_campaign_id
		) {
			// New donation
			pushUniqueDonation(req.body.data)
		} else if (
			req.body.meta.event_type === "public:direct:fact_updated" // &&
			// req.body.data.id === nodecg.bundleConfig.tiltify_campaign_id
		) {
			// Updated amount raised
			updateTotal(req.body.data)
		}
		// Send ack
		res.sendStatus(200)
	})

	async function askTiltifyForDonations() {
		client.Campaigns.getRecentDonations(
			nodecg.bundleConfig.tiltify_campaign_id,
			function (donations: Donations) {
				for (let i = 0; i < donations.length; i++) {
					pushUniqueDonation(donations[i])
				}
			}
		);
	}

	async function askTiltifyForAllDonations() {
		client.Campaigns.getDonations(
			nodecg.bundleConfig.tiltify_campaign_id,
			function (alldonations: Alldonations) {
				if (
					JSON.stringify(allDonationsRep.value) !== JSON.stringify(alldonations)
				) {
					allDonationsRep.value = alldonations;
				}
			}
		);
	}

	async function askTiltifyForPolls() {
		client.Campaigns.getPolls(
			nodecg.bundleConfig.tiltify_campaign_id,
			function (polls: Donationpolls) {
				if (JSON.stringify(pollsRep.value) !== JSON.stringify(polls)) {
					pollsRep.value = polls;
				}
			}
		);
	}

	async function askTiltifyForSchedule() {
		client.Campaigns.getSchedule(
			nodecg.bundleConfig.tiltify_campaign_id,
			function (schedule: Schedule) {
				if (JSON.stringify(scheduleRep.value) !== JSON.stringify(schedule)) {
					scheduleRep.value = schedule;
				}
			}
		);
	}

	async function askTiltifyForTargets() {
		client.Campaigns.getTargets(
			nodecg.bundleConfig.tiltify_campaign_id,
			function (targets: Targets) {
				if (
					JSON.stringify(targetsRep.value) !== JSON.stringify(targets)
				) {
					targetsRep.value = targets;
				}
			}
		);
	}

	async function askTiltifyForRewards() {
		client.Campaigns.getRewards(
			nodecg.bundleConfig.tiltify_campaign_id,
			function (rewards: Rewards) {
				if (JSON.stringify(rewardsRep.value) !== JSON.stringify(rewards)) {
					rewardsRep.value = rewards;
				}
			}
		);
	}

	async function askTiltifyForMilestones() {
		client.Campaigns.getMilestones(
			nodecg.bundleConfig.tiltify_campaign_id,
			function (milestones: Milestones) {
				if (JSON.stringify(milestonesRep.value) !== JSON.stringify(milestones)) {
					milestonesRep.value = milestones;
				}
			}
		);
	}

	async function askTiltifyForDonors() {
		client.Campaigns.getDonors(
			nodecg.bundleConfig.tiltify_campaign_id,
			function (donors: Donors) {
				if (JSON.stringify(donorsRep.value) !== JSON.stringify(donors)) {
					donorsRep.value = donors;
				}
			}
		);
	}

	async function askTiltifyForTotal() {
		client.Campaigns.get(nodecg.bundleConfig.tiltify_campaign_id, function (
			campaign: Campaign
		) {
			updateTotal(campaign)
		});
	}

	function askTiltify() {
		// Donations and total are handled by websocket normally, only ask if not using websockets
		if (!WEBHOOK_MODE) {
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

	client.initialize().then(() => {
		if (WEBHOOK_MODE) {
			client.Webhook.activate(nodecg.bundleConfig.tiltify_webhook_id, () => {
				nodecg.log.info('Webhooks staged!')
			})
			const events = { "event_types": ["public:direct:fact_updated", "public:direct:donation_updated"] }
			client.Webhook.subscribe(nodecg.bundleConfig.tiltify_webhook_id, nodecg.bundleConfig.tiltify_campaign_id, events, () => {
				nodecg.log.info('Webhooks activated!')
			})
		}

		askTiltifyForTotal();
		askTiltify();
		askTiltifyForAllDonations();

		setInterval(function () {
			askTiltify();
		}, WEBHOOK_MODE ? 120000 : 5000);

		setInterval(function () {
			askTiltifyForAllDonations();
		}, 5 * 60000);
	})

	nodecg.listenFor("clear-donations", (value, ack) => {
		for (let i = 0; i < donationsRep.value.length; i++) {
			donationsRep.value[i].read = true;
		}

		if (ack && !ack.handled) {
			ack(null, value);
		}
	});

	nodecg.listenFor("mark-donation-as-read", (value, ack) => {
		nodecg.log.info("Mark read", value.id)
		var isElement = (element: Donation) => element.id === value.id;
		var elementIndex = donationsRep.value.findIndex(isElement);
		if (elementIndex !== -1) {
			nodecg.log.info("Found", elementIndex, donationsRep.value[elementIndex])
			donationsRep.value[elementIndex].read = true;
			if (ack && !ack.handled) {
				ack(null, null);
			}
		} else {
			if (ack && !ack.handled) {
				nodecg.log.error('Donation not found to mark as read | id:', value.id);
				ack(new Error("Donation not found to mark as read"), null);
			}
		}
	});

	nodecg.listenFor("mark-donation-as-shown", (value, ack) => {
		var isElement = (element: Donation) => element.id === value.id;
		var elementIndex = donationsRep.value.findIndex(isElement);
		if (elementIndex !== -1) {
			donationsRep.value[elementIndex].shown = true;
			if (ack && !ack.handled) {
				ack(null, null);
			}
		} else {
			if (ack && !ack.handled) {
				nodecg.log.error('Donation not found to mark as shown | id:', value.id);
				ack(new Error("Donation not found to mark as shown"), null);
			}
		}
	});

	nodecg.mount(app);
	return tiltifyEmitter;
};
