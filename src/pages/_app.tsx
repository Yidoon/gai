import "../styles/global.css";
import { AppProps } from "next/app";
import "antd/dist/reset.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
