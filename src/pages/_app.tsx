import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Layout from "~/components/layout";
import Contexts from "~/components/contexts";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import { Toaster } from "sonner";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Contexts>
        <Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: 0,
                border: "1px",
                borderStyle: "solid",
                borderColor: "hsl(var(--border))",
                fontFamily: "Neue Montreal",
                backgroundColor: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
              },
            }}
          />
          <Component {...pageProps} />
        </Layout>
      </Contexts>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
