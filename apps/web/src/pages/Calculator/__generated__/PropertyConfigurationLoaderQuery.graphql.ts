/**
 * @generated SignedSource<<6b65f9ce51aae34ac52f50d08f530142>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PropertyConfigurationLoaderQuery$variables = {
  id: string;
};
export type PropertyConfigurationLoaderQuery$data = {
  readonly propertyConfiguration: {
    readonly advertisingCosts: number;
    readonly annualAppreciation: number;
    readonly annualOperatingCosts: number;
    readonly annualRentIncrease: number;
    readonly depreciableBasis: number | null | undefined;
    readonly downPayment: number;
    readonly downPaymentSource: string | null | undefined;
    readonly hasSellerFinancing: boolean;
    readonly homeOfficeExpenses: number;
    readonly id: string;
    readonly insurance: number;
    readonly interestRate: number;
    readonly isHistoricProperty: boolean;
    readonly isOpportunityZone: boolean;
    readonly landValue: number | null | undefined;
    readonly loanTermYears: number;
    readonly maintenance: number;
    readonly name: string;
    readonly otherExpenses: number;
    readonly placedInServiceDate: any | null | undefined;
    readonly priorDepreciation: number | null | undefined;
    readonly professionalFees: number;
    readonly projectionYears: number;
    readonly propertyAddress: string;
    readonly propertyManagement: number;
    readonly propertyPrice: number;
    readonly propertyTaxes: number;
    readonly qualifiesForEnergyCredits: boolean;
    readonly rehabEnabled: boolean;
    readonly rehabItems: ReadonlyArray<{
      readonly category: string;
      readonly cost: number;
      readonly id: string;
    }>;
    readonly rehabRentIncreasePercentage: number;
    readonly travelExpenses: number;
    readonly units: ReadonlyArray<{
      readonly id: string;
      readonly monthlyRent: number;
      readonly quantity: number;
      readonly type: string;
    }>;
    readonly utilities: number;
    readonly vacancyRate: number;
  } | null | undefined;
};
export type PropertyConfigurationLoaderQuery = {
  response: PropertyConfigurationLoaderQuery$data;
  variables: PropertyConfigurationLoaderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "PropertyConfiguration",
    "kind": "LinkedField",
    "name": "propertyConfiguration",
    "plural": false,
    "selections": [
      (v1/*: any*/),
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
        "name": "propertyPrice",
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
        "name": "downPayment",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "interestRate",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "loanTermYears",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "annualOperatingCosts",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "vacancyRate",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "propertyTaxes",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "insurance",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "propertyManagement",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "maintenance",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "utilities",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "otherExpenses",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "annualAppreciation",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "annualRentIncrease",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "projectionYears",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "rehabEnabled",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "rehabRentIncreasePercentage",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "landValue",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "depreciableBasis",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "placedInServiceDate",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "priorDepreciation",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "professionalFees",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "advertisingCosts",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "travelExpenses",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "homeOfficeExpenses",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isOpportunityZone",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isHistoricProperty",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "qualifiesForEnergyCredits",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "downPaymentSource",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "hasSellerFinancing",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "UnitEntity",
        "kind": "LinkedField",
        "name": "units",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "type",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "quantity",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "monthlyRent",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "RehabItemEntity",
        "kind": "LinkedField",
        "name": "rehabItems",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "category",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cost",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PropertyConfigurationLoaderQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PropertyConfigurationLoaderQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "c7b9219759f379cae4b5a33964b4d8be",
    "id": null,
    "metadata": {},
    "name": "PropertyConfigurationLoaderQuery",
    "operationKind": "query",
    "text": "query PropertyConfigurationLoaderQuery(\n  $id: ID!\n) {\n  propertyConfiguration(id: $id) {\n    id\n    name\n    propertyPrice\n    propertyAddress\n    downPayment\n    interestRate\n    loanTermYears\n    annualOperatingCosts\n    vacancyRate\n    propertyTaxes\n    insurance\n    propertyManagement\n    maintenance\n    utilities\n    otherExpenses\n    annualAppreciation\n    annualRentIncrease\n    projectionYears\n    rehabEnabled\n    rehabRentIncreasePercentage\n    landValue\n    depreciableBasis\n    placedInServiceDate\n    priorDepreciation\n    professionalFees\n    advertisingCosts\n    travelExpenses\n    homeOfficeExpenses\n    isOpportunityZone\n    isHistoricProperty\n    qualifiesForEnergyCredits\n    downPaymentSource\n    hasSellerFinancing\n    units {\n      id\n      type\n      quantity\n      monthlyRent\n    }\n    rehabItems {\n      id\n      category\n      cost\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6c92cafe22aaaf8aaa99f70158c7632f";

export default node;
