/**
 * @generated SignedSource<<e4e615da721791934183e427b8eda5c7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PropertiesListQuery$variables = Record<PropertyKey, never>;
export type PropertiesListQuery$data = {
  readonly propertyConfigurations: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"PropertyConfigurationCard_configuration">;
  }>;
};
export type PropertiesListQuery = {
  response: PropertiesListQuery$data;
  variables: PropertiesListQuery$variables;
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
    "name": "PropertiesListQuery",
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
    "name": "PropertiesListQuery",
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
    "cacheID": "35f1be72fb05ccfce476b334dfe9ec8b",
    "id": null,
    "metadata": {},
    "name": "PropertiesListQuery",
    "operationKind": "query",
    "text": "query PropertiesListQuery {\n  propertyConfigurations {\n    id\n    ...PropertyConfigurationCard_configuration\n  }\n}\n\nfragment PropertyConfigurationCard_configuration on PropertyConfiguration {\n  id\n  name\n  propertyAddress\n  propertyPrice\n  createdAt\n}\n"
  }
};
})();

(node as any).hash = "2148ee523aed44803f3736dbce13944a";

export default node;
