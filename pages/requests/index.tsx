import { NextPage } from "next";
import { getSession } from "next-auth/react";
import RequestsTable from "../../components/requests/RequestsTable";
import Layout from "../../components/shared/_Layout";
import { getInitialServerProps } from "../../lib/initialize-server-props";
import { withSessionSsr } from "../../lib/session";
import { SemestersService } from "../../services/SemestersService";

const RequestsHeaderPage: NextPage = () => {
  return (
    <Layout>
      <RequestsTable />
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, semesters, sessionActiveSemester } =
      await getInitialServerProps(req, getSession, new SemestersService());

    return {
      props: {
        semesters,
        session,
        sessionActiveSemester,
      },
    };
  }
);

export default RequestsHeaderPage;
