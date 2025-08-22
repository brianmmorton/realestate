/**
 * @generated SignedSource<<eb4b6c39bb40bacbe6c57460df8181e6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PropertiesQuery$variables = Record<PropertyKey, never>;
export type PropertiesQuery$data = {
  readonly propertyConfigurations: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"PropertyConfigurationCard_configuration">;
  }>;
};
export type PropertiesQuery = {
  response: PropertiesQuery$data;
  variables: PropertiesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PropertiesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "PropertyConfiguration",
        "kind": "LinkedField",
        "name": "propertyConfigurations",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "PropertyConfigurationCard_configuration"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PropertiesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "PropertyConfiguration",
        "kind": "LinkedField",
        "name": "propertyConfigurations",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "propertyAddress",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "propertyPrice",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a2848f3ff61cc04791116e91b86a5cce",
    "id": null,
    "metadata": {},
    "name": "PropertiesQuery",
    "operationKind": "query",
    "text": "query PropertiesQuery {\n  propertyConfigurations {\n    id\n    ...PropertyConfigurationCard_configuration\n  }\n}\n\nfragment PropertyConfigurationCard_configuration on PropertyConfiguration {\n  id\n  name\n  propertyAddress\n  propertyPrice\n  createdAt\n}\n"
  }
};
})();

(node as any).hash = "8c281415455270745a7cf1eb932d2c64";

export default node;
