/**
 * @generated SignedSource<<6ae67c067a645c8f9c2f0240c0ef5412>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PropertyConfigurationCard_configuration$data = {
  readonly createdAt: any;
  readonly id: string;
  readonly name: string;
  readonly propertyAddress: string;
  readonly propertyPrice: number;
  readonly " $fragmentType": "PropertyConfigurationCard_configuration";
};
export type PropertyConfigurationCard_configuration$key = {
  readonly " $data"?: PropertyConfigurationCard_configuration$data;
  readonly " $fragmentSpreads": FragmentRefs<"PropertyConfigurationCard_configuration">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PropertyConfigurationCard_configuration",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
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
  "type": "PropertyConfiguration",
  "abstractKey": null
};

(node as any).hash = "3ffa09a9f9cc0c5c54fbab00b23877c0";

export default node;
