import type { TPoolData } from "@/types";
import ApplicationDetail from "@/components/application/ApplicationDetail";
import Container from "@/components/shared/Container";
import { PoolContextProvider } from "@/context/PoolContext";
import { getApplicationData, getPoolData } from "@/utils/request";

export default async function Application({
  params,
}: {
  params: { chainId: string; poolId: string; applicationId: string };
}) {

  const pool: TPoolData = await getPoolData(params.chainId, params.poolId);

  const { application, metadata, bannerImage } = await getApplicationData(
    params.chainId,
    params.poolId,
    params.applicationId,
  );

  return (
    <Container>
      <PoolContextProvider chainId={params.chainId} poolId={params.poolId}>
        <ApplicationDetail
          pool={pool}
          application={application}
          metadata={metadata}
          bannerImage={bannerImage}
        />
      </PoolContextProvider>
    </Container>
  );
}
