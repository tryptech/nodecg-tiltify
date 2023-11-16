import type NodeCG from '@nodecg/types';
import type { Donation, Donations, Configschema, Alldonations, Total, Donationpolls, Schedule, Targets, Rewards, Milestones, Donors, Campaign } from '../types/schemas';
import { getNodeCG } from './utils';
import * as rep from "./utils/replicants";

const nodecg = getNodeCG();

nodecg.listenFor("clear-donations", (value, ack) => {
    for (let i = 0; i < rep.donations.value.length; i++) {
        rep.donations.value[i].read = true;
    }

    if (ack && !ack.handled) {
        ack(null, value);
    }
});

nodecg.listenFor("mark-donation-as-read", (value, ack) => {
    nodecg.log.info("Mark read", value.id)
    var isElement = (element: Donation) => element.id === value.id;
    var elementIndex = rep.donations.value.findIndex(isElement);
    if (elementIndex !== -1) {
        nodecg.log.info("Found", elementIndex, rep.donations.value[elementIndex])
        rep.donations.value[elementIndex].read = true;
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
    var elementIndex = rep.donations.value.findIndex(isElement);
    if (elementIndex !== -1) {
        rep.donations.value[elementIndex].shown = true;
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