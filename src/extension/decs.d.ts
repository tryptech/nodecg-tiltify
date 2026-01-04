/// <reference path="../../../../types/index.d.ts" />

declare module "@ericthelemur/tiltify-api-client";

// Type augmentations for NodeCG types  
// Augment the @nodecg/types module to export the types we need
declare module '@nodecg/types' {
	import type NodeCGBase from '../../../../types';
	
	// Re-export the NodeCG namespace with all its types
	export = NodeCGBase;
	export as namespace NodeCG;
	
	namespace NodeCG {
		export type ServerAPI<C extends Record<string, any> = any> = NodeCGBase.ServerAPI<C>;
		export type ServerReplicantWithSchemaDefault<V, O = any> = NodeCGBase.ServerReplicantWithSchemaDefault<V, O>;
		export type Acknowledgement = NodeCGBase.Acknowledgement;
	}
}