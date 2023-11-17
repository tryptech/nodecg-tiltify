import type NodeCG from '@nodecg/types';
import type { Donation } from '../types/schemas';
import { getNodeCG } from './utils';
import { ModStatus, UNDECIDED } from './utils/mod';
import * as rep from './utils/replicants';

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


function searchAndSet<T>(id: string, prop: string, value: T, ack: NodeCG.Acknowledgement | undefined): Donation | undefined {
    nodecg.log.info("Mark", prop, id, value);
    var elementIndex = rep.donations.value.findIndex((d: Donation) => d.id === id);
    if (elementIndex !== -1) {
        nodecg.log.info("Found", elementIndex, rep.donations.value[elementIndex])
        rep.donations.value[elementIndex][prop] = value;

        if (ack && !ack.handled) {
            ack(null, null);
        }
        return rep.donations.value[elementIndex];
    } else {
        if (ack && !ack.handled) {
            nodecg.log.error('Donation not found to mark as read | id:', id);
            ack(new Error("Donation not found to mark as read"), null);
        }
        return undefined;
    }
}

nodecg.listenFor("set-donation-read", ([dono, readVal], ack) => {
    const d = searchAndSet(dono.id, "read", readVal, ack);
    if (d && readVal && d.modStatus === UNDECIDED) d.modStatus = true;
});

nodecg.listenFor("set-donation-shown", ([dono, shownVal], ack) => {
    searchAndSet(dono.id, "shown", shownVal, ack);
});

nodecg.listenFor("set-donation-modstatus", ([dono, statusVal], ack) => {
    searchAndSet(dono.id, "modStatus", statusVal, ack);
});
