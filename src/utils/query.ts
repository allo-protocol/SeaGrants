import { gql } from "graphql-request";


export const graphqlEndpoint = process.env.GRAPHQL_URL || "";

/** Returns all the MicroGrants pools */
export const getMicroGrantsQuery = gql`
  {
    microGrants(orderBy: BLOCK_TIMESTAMP_DESC) {
      poolId
      chainId
      strategy
      allocationStartTime
      allocationEndTime
      approvalThreshold
      maxRequestedAmount
      pool {
          tokenMetadata
          token
          amount
          metadataPointer
          profile {
            profileId
            name
          }
      }
    }
  }
`;

/** Returns the recipient information for micro grant strategy */
export const getMicroGrantsRecipientsQuery = gql`
  query getMicroGrantsRecipientsQuery($chainId: String!, $strategyId: String!) {
    microGrant(chainId: $chainId, strategy: $strategyId) {
      microGrantRecipients {
        recipientAddress
        recipientAddress
        requestedAmount
        metadataPointer
        blockTimestamp
        isUsingRegistryAnchor
        status
      }
    }
  }
`;

// TODO: add query for getting allocations to track approvals/rejecte