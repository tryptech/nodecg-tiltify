import type NodeCG from '@nodecg/types';
import type { Donation, Donations, Configschema, Alldonations, Total, Donationpolls, Schedule, Targets, Rewards, Milestones, Donors, Campaign } from '../types/schemas';
import { APPROVED, getNodeCG, ModStatus, UNDECIDED } from './utils';
import * as rep from "./utils/replicants";

const nodecg = getNodeCG();

function setAll<T>(prop: string, value: T, ack: NodeCG.Acknowledgement | undefined) {
    for (let i = 0; i < rep.donations.value.length; i++) {
        rep.donations.value[i][prop] = value;
    }

    if (ack && !ack.handled) {
        ack(null, value);
    }
}

nodecg.listenFor("clear-donations", (value, ack) => {
    setAll("read", true, ack);
});

nodecg.listenFor("approve-all-donations", (value, ack) => {
    setAll("modStatus", value, ack);
});

function searchAndSet<T>(id: string, prop: string, value: T, ack: NodeCG.Acknowledgement | undefined) {
    nodecg.log.info("Mark", prop, id, value);
    var elementIndex = rep.donations.value.findIndex((d: Donation) => d.id === id);
    if (elementIndex !== -1) {
        nodecg.log.info("Found", elementIndex, rep.donations.value[elementIndex])
        rep.donations.value[elementIndex][prop] = value;

        if (ack && !ack.handled) {
            ack(null, null);
        }
    } else {
        if (ack && !ack.handled) {
            nodecg.log.error('Donation not found to mark as read | id:', id);
            ack(new Error("Donation not found to mark as read"), null);
        }
    }
}

nodecg.listenFor("set-donation-read", ([dono, readVal], ack) => {
    searchAndSet<boolean>(dono.id, "read", readVal, ack);
});

nodecg.listenFor("set-donation-shown", ([dono, shownVal], ack) => {
    searchAndSet<boolean>(dono.id, "shown", shownVal, ack);
});

nodecg.listenFor("set-donation-modstatus", ([dono, statusVal], ack) => {
    searchAndSet<ModStatus>(dono.id, "modStatus", statusVal, ack);
});
