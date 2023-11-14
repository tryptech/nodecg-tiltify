import type NodeCG from '@nodecg/types';
import type { Donations } from '../types/schemas';

module.exports = function (nodecg: NodeCG.ServerAPI) {
	const donations = nodecg.Replicant('donations', "nodecg-tiltify") as unknown as NodeCG.ServerReplicantWithSchemaDefault<Donations>;
	donations.on("change", (nv) => console.log(nv));
};
