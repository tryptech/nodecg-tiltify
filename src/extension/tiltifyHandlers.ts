import TiltifyClient from "@ericthelemur/tiltify-api-client";
import { NextFunction } from 'express';
import { Request, Response } from "express-serve-static-core";
import { createHmac } from "node:crypto";
import { EventEmitter } from 'node:stream';

import type { Alldonations, Basedono, Campaign, Donation, Donations, Donors, Milestones, Polls, Rewards, Schedule, Targets } from '../types/schemas';
import { WEBHOOK_MODE } from './index';
import { getNodeCG } from './utils';
import { convertValue } from './utils/currency';
import * as rep from "./utils/replicants";


const nodecg = getNodeCG();
export const tiltifyEmitter = new EventEmitter();

var client = new TiltifyClient(nodecg.bundleConfig.tiltify_client_id, nodecg.bundleConfig.tiltify_client_secret);
const app = nodecg.Router();

function toBasedono(donation: Donation): Basedono {
    return {
        // Clone amount so it is not shared with the donations replicant proxy.
        amount: {
            value: donation.amount.value,
            currency: donation.amount.currency,
        },
        id: donation.id,
        campaign_id: donation.campaign_id,
        completed_at: donation.completed_at,
        created_at: donation.created_at,
        donor_comment: donation.donor_comment,
        donor_name: donation.donor_name,
        fundraising_event_id: donation.fundraising_event_id,
        legacy_id: donation.legacy_id,
        poll_id: donation.poll_id,
        poll_option_id: donation.poll_option_id,
        reward_id: donation.reward_id,
        sustained: donation.sustained,
        target_id: donation.target_id,
        team_event_id: donation.team_event_id,
    };
}

function pushUniqueDonation(donation: Donation) {
    var found = rep.donations.value.find(function (element: Donation) {
        return element.id === donation.id;
    });
    if (found === undefined) {
        donation.read = false;
        donation.shown = false;
        donation.modStatus = null;
        convertValue(donation);
        tiltifyEmitter.emit("new-donation", donation);
        rep.donations.value.push(donation);

        const alreadyInHistory = rep.allDonations.value.some(
            (element: Basedono) => element.id === donation.id
        );
        if (!alreadyInHistory) {
            rep.allDonations.value = [
                ...rep.allDonations.value,
                toBasedono(donation),
            ];
        }
    }
}

function updateTotal(campaign: Campaign) {
    const campaignChanged = rep.trackedCampaignId.value !== campaign.id;
    // Less than check in case webhooks are sent out-of-order. Only update the total if it's higher!
    // Always sync when the campaign id changes so a prior campaign's total isn't kept.
    if (
        campaignChanged ||
        Number(rep.campaignTotal.value.value) < Number(campaign.amount_raised.value) ||
        rep.campaignTotal.value.currency != campaign.amount_raised.currency
    ) {
        rep.campaignTotal.value = campaign.amount_raised;
    }
    if (campaignChanged) {
        rep.trackedCampaignId.value = campaign.id;
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
        nodecg.log.warn('Tiltify webhook rejected: invalid signature');
        // Close connection (200 code MUST be sent regardless)
        res.sendStatus(200)
    };
}

app.post('/nodecg-tiltify/webhook', validateSignature, (req: Request, res: Response) => {
    const eventType = req.body?.meta?.event_type;
    // Verify this webhook is sending out stuff for the campaign we're working on
    if (eventType === "public:direct:donation_updated") {
        // New donation
        pushUniqueDonation(req.body.data)
        nodecg.log.info(`Tiltify webhook: donation_updated (${req.body.data?.id ?? 'unknown id'})`);
    } else if (eventType === "public:direct:fact_updated") {
        // Updated amount raised
        updateTotal(req.body.data)
        nodecg.log.info(`Tiltify webhook: fact_updated (raised ${req.body.data?.amount_raised?.value ?? '?'} ${req.body.data?.amount_raised?.currency ?? ''})`.trim());
    } else {
        nodecg.log.debug(`Tiltify webhook: ignored event type ${eventType ?? 'unknown'}`);
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
                JSON.stringify(rep.allDonations.value) !== JSON.stringify(alldonations)
            ) {
                rep.allDonations.value = alldonations;
            }
        }
    );
}

async function askTiltifyForPolls() {
    client.Campaigns.getPolls(
        nodecg.bundleConfig.tiltify_campaign_id,
        function (polls: Polls) {
            if (JSON.stringify(rep.polls.value) !== JSON.stringify(polls)) {
                rep.polls.value = polls;
            }
        }
    );
}

async function askTiltifyForSchedule() {
    client.Campaigns.getSchedule(
        nodecg.bundleConfig.tiltify_campaign_id,
        function (schedule: Schedule) {
            if (JSON.stringify(rep.schedule.value) !== JSON.stringify(schedule)) {
                rep.schedule.value = schedule;
            }
        }
    );
}

async function askTiltifyForTargets() {
    client.Campaigns.getTargets(
        nodecg.bundleConfig.tiltify_campaign_id,
        function (targets: Targets) {
            if (
                JSON.stringify(rep.targets.value) !== JSON.stringify(targets)
            ) {
                rep.targets.value = targets;
            }
        }
    );
}

async function askTiltifyForRewards() {
    client.Campaigns.getRewards(
        nodecg.bundleConfig.tiltify_campaign_id,
        function (rewards: Rewards) {
            if (JSON.stringify(rep.rewards.value) !== JSON.stringify(rewards)) {
                rep.rewards.value = rewards;
            }
        }
    );
}

async function askTiltifyForMilestones() {
    client.Campaigns.getMilestones(
        nodecg.bundleConfig.tiltify_campaign_id,
        function (milestones: Milestones) {
            if (JSON.stringify(rep.milestones.value) !== JSON.stringify(milestones)) {
                rep.milestones.value = milestones;
            }
        }
    );
}

async function askTiltifyForDonors() {
    client.Campaigns.getDonors(
        nodecg.bundleConfig.tiltify_campaign_id,
        function (donors: Donors) {
            if (JSON.stringify(rep.donors.value) !== JSON.stringify(donors)) {
                rep.donors.value = donors;
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
    }, WEBHOOK_MODE ? 10000 : 5000);

    setInterval(function () {
        askTiltifyForAllDonations();
    }, 5 * 60000);
}).catch((error) => {
    nodecg.log.error('Failed to initialize Tiltify client.');
    nodecg.log.error(error);
})

nodecg.mount(app);