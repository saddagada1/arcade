import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Layout from "~/components/layout";
import Contexts from "~/components/contexts";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Contexts>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Contexts>
  );
};

export default api.withTRPC(MyApp);
