/**
 * @generated SignedSource<<341d6c27849304f4c4f9e622d37d37b0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PropertiesDeleteMutation$variables = {
  id: string;
};
export type PropertiesDeleteMutation$data = {
  readonly deletePropertyConfiguration: boolean;
};
export type PropertiesDeleteMutation = {
  response: PropertiesDeleteMutation$data;
  variables: PropertiesDeleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "kind": "ScalarField",
    "name": "deletePropertyConfiguration",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PropertiesDeleteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PropertiesDeleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c2385f120c46a3e04cf2bd5d1faf1ce1",
    "id": null,
    "metadata": {},
    "name": "PropertiesDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation PropertiesDeleteMutation(\n  $id: ID!\n) {\n  deletePropertyConfiguration(id: $id)\n}\n"
  }
};
})();

(node as any).hash = "01e7619c9f892d072ec55d9449288272";

export default node;
