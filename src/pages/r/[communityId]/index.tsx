import { Community } from "@/src/atoms/communitiesAtom";
import Header from "@/src/components/Community/Header";
import NotFound from "@/src/components/Community/NotFound";
import { firestore } from "@/src/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type CommunitiesPageProps = {
  communityData: Community;
};

const CommunitiesPage: React.FC<CommunitiesPageProps> = ({ communityData }) => {
  console.log("here is data", communityData);

  if (!communityData) {
    return <NotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get community data and pass it to client
  try {
    console.log("query", context.query.communityId);

    const communityDocRef = doc(firestore, "communitites", context.query.communityId as string);
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }))
          : "",
      },
    };
  } catch (error) {
    console.log("getServersideprops error", error);
  }
}

export default CommunitiesPage;
