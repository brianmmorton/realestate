/**
 * @generated SignedSource<<67b46dccbcbcaf8031cc711a0f84690c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UpdateUserTaxProfileInput = {
  annualGrossIncome?: number | null | undefined;
  existingItemizedDeductions?: number | null | undefined;
  filingStatus?: string | null | undefined;
  intends1031Exchange?: boolean | null | undefined;
  isRealEstateProfessional?: boolean | null | undefined;
  marginalTaxBracket?: number | null | undefined;
  otherPassiveIncome?: number | null | undefined;
  plannedHoldPeriod?: number | null | undefined;
  stateOfResidence?: string | null | undefined;
  stateTaxRate?: number | null | undefined;
  useStandardDeduction?: boolean | null | undefined;
};
export type TaxProfileCardUpdateMutation$variables = {
  input: UpdateUserTaxProfileInput;
};
export type TaxProfileCardUpdateMutation$data = {
  readonly updateUserTaxProfile: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"TaxProfileCard_user">;
  };
};
export type TaxProfileCardUpdateMutation = {
  response: TaxProfileCardUpdateMutation$data;
  variables: TaxProfileCardUpdateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TaxProfileCardUpdateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "updateUserTaxProfile",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "TaxProfileCard_user"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TaxProfileCardUpdateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "updateUserTaxProfile",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
    "cacheID": "f656c91625029728a449ec59d2c7648b",
    "id": null,
    "metadata": {},
    "name": "TaxProfileCardUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation TaxProfileCardUpdateMutation(\n  $input: UpdateUserTaxProfileInput!\n) {\n  updateUserTaxProfile(input: $input) {\n    id\n    ...TaxProfileCard_user\n  }\n}\n\nfragment TaxProfileCard_user on User {\n  id\n  annualGrossIncome\n  filingStatus\n  stateOfResidence\n  marginalTaxBracket\n  stateTaxRate\n  useStandardDeduction\n  existingItemizedDeductions\n  isRealEstateProfessional\n  otherPassiveIncome\n  plannedHoldPeriod\n  intends1031Exchange\n  taxProfileUpdatedAt\n}\n"
  }
};
})();

(node as any).hash = "d1547d5eaba6aa5ab4d2a7e2568014f0";

export default node;
