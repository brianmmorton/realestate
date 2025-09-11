/**
 * @generated SignedSource<<5223bbd07e924176330bbf67a423bde6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TaxProfileCard_user$data = {
  readonly annualGrossIncome: number | null | undefined;
  readonly existingItemizedDeductions: number | null | undefined;
  readonly filingStatus: string | null | undefined;
  readonly id: string;
  readonly intends1031Exchange: boolean;
  readonly isRealEstateProfessional: boolean;
  readonly marginalTaxBracket: number | null | undefined;
  readonly otherPassiveIncome: number | null | undefined;
  readonly plannedHoldPeriod: number | null | undefined;
  readonly stateOfResidence: string | null | undefined;
  readonly stateTaxRate: number | null | undefined;
  readonly taxProfileUpdatedAt: any | null | undefined;
  readonly useStandardDeduction: boolean;
  readonly " $fragmentType": "TaxProfileCard_user";
};
export type TaxProfileCard_user$key = {
  readonly " $data"?: TaxProfileCard_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"TaxProfileCard_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TaxProfileCard_user",
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
      "name": "annualGrossIncome",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "filingStatus",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "stateOfResidence",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "marginalTaxBracket",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "stateTaxRate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "useStandardDeduction",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "existingItemizedDeductions",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isRealEstateProfessional",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "otherPassiveIncome",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "plannedHoldPeriod",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "intends1031Exchange",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "taxProfileUpdatedAt",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "4f97b63197458caa1fed7273af064e59";

export default node;
