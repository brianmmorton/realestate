/**
 * @generated SignedSource<<c768e2bc8821b2f956cfa20e4eccbafc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TaxProfileCardQuery$variables = Record<PropertyKey, never>;
export type TaxProfileCardQuery$data = {
  readonly me: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"TaxProfileCard_user">;
  } | null | undefined;
};
export type TaxProfileCardQuery = {
  response: TaxProfileCardQuery$data;
  variables: TaxProfileCardQuery$variables;
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
    "name": "TaxProfileCardQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "TaxProfileCard_user"
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
    "name": "TaxProfileCardQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v0/*: any*/),
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "45a2143cc26894ed2a7b2724ec27a0ae",
    "id": null,
    "metadata": {},
    "name": "TaxProfileCardQuery",
    "operationKind": "query",
    "text": "query TaxProfileCardQuery {\n  me {\n    id\n    ...TaxProfileCard_user\n  }\n}\n\nfragment TaxProfileCard_user on User {\n  id\n  annualGrossIncome\n  filingStatus\n  stateOfResidence\n  marginalTaxBracket\n  stateTaxRate\n  useStandardDeduction\n  existingItemizedDeductions\n  isRealEstateProfessional\n  otherPassiveIncome\n  plannedHoldPeriod\n  intends1031Exchange\n  taxProfileUpdatedAt\n}\n"
  }
};
})();

(node as any).hash = "85b0872ee69bb10523b4a80a871dd360";

export default node;
