/**
 * @generated SignedSource<<cbe3ce1f1f34ad23aa51ee59d46e2416>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Properties_PropertyConfiguration$data = {
  readonly createdAt: any;
  readonly id: string;
  readonly name: string;
  readonly propertyAddress: string;
  readonly propertyPrice: number;
  readonly " $fragmentType": "Properties_PropertyConfiguration";
};
export type Properties_PropertyConfiguration$key = {
  readonly " $data"?: Properties_PropertyConfiguration$data;
  readonly " $fragmentSpreads": FragmentRefs<"Properties_PropertyConfiguration">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Properties_PropertyConfiguration",
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

(node as any).hash = "7a03b2b9f05ba968d90363780cc19f28";

export default node;
