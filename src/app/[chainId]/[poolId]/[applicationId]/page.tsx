import ApplicationDetail from "@/components/application/ApplicationDetail";
import Container from "@/components/shared/Container";
import { graphqlEndpoint, getMicroGrantRecipientQuery } from "@/utils/query";
import request from "graphql-request";

export default async function Application({
  params,
}: {
  params: { chainId: string; poolId: string; applicationId: string };
}) {
  let recipient;
  let isError = false;

  try {
    const response: any = await request(
      graphqlEndpoint,
      getMicroGrantRecipientQuery,
      {
        chainId: params.chainId,
        poolId: params.poolId,
        recipientId: params.applicationId,
      }
    );
    recipient = response?.microGrantRecipient;
    // console.log("recipient", recipient);
  } catch (error) {
    isError = true;
    console.error(error);
  }

  return (
    <Container>
      <ApplicationDetail application={recipient} isError={isError} />
    </Container>
  );
}
