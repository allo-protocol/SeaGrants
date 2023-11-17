import { TPoolData } from "@/app/types";
import PoolDetail from "@/components/pool/PoolDetail";
import Container from "@/components/shared/Container";
import {
  graphqlEndpoint,
  getMicroGrantsRecipientsQuery,
  getMicroGrantsQuery,
} from "@/utils/query";
import request from "graphql-request";

export default async function Pool({
  params,
}: {
  params: { chainId: string; poolId: string };
}) {
  const response: any = await request(
    graphqlEndpoint,
    getMicroGrantsRecipientsQuery,
    { chainId: params.chainId, poolId: params.poolId },
  );

  const pool: TPoolData = response.microGrant;

  console.log("====response====", response);
  return (
    <Container>
      <PoolDetail pool={pool} />
    </Container>
  );
}
