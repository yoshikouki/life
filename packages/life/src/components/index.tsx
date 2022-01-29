import Switch from "@frontity/components/switch";
import { isArchive, isError, isHome, isPostType } from "@frontity/source";
import { connect, css, Global, Head, styled, useConnect } from "frontity";
import { Packages } from "../../types";
import Header from "./header";
import List from "./list";
import Loading from "./loading";
import PageError from "./page-error";
import Home from "./pages/home";
import Post from "./post";
import gutenbergStyle from "./styles/gutenberg/style.css";
import gutenbergTheme from "./styles/gutenberg/theme.css";
import Title from "./title";

/**
 * Theme is the root React component of our theme. The one we will export
 * in roots.
 *
 * @returns The top-level react component representing the theme.
 */
const Theme = () => {
  const { state } = useConnect<Packages>();
  const data = state.source.get(state.router.link);

  return (
    <>
      {/* Add some metatags to the <head> of the HTML. */}
      <Title />
      <Head>
        <meta name="description" content={state.frontity.description} />
        <html lang="ja" />
      </Head>

      {/* Add some global styles for the whole site, like body or a's.
      Not classes here because we use CSS-in-JS. Only global HTML tags. */}
      <Global styles={globalStyles} />
      <Global styles={css(gutenbergStyle)} />
      <Global styles={css(gutenbergTheme)} />

      {/* Add the header of the site. */}
      <HeadContainer>
        <Header />
      </HeadContainer>

      {/* Add the main section. It renders a different component depending
      on the type of URL we are in. */}
      <Main>
        <Switch>
          <Loading when={data.isFetching} />
          <Home when={isHome(data)}  data={isHome(data) && data} />
          <List when={isArchive(data)} data={isArchive(data) && data} />
          <Post when={isPostType(data)} data={isPostType(data) && data} />
          <PageError when={isError(data)} data={isError(data) && data} />
        </Switch>
      </Main>
    </>
  );
};

export default connect(Theme);

const globalStyles = css`
  :root {
    --brand: #5B3BE8;
    --black: #001f3f;
    --white: #ffffff;
    --bodycolor: #e0e0e0;
    --link-color: #1f7ccc;
  }
  body {
    margin: 0;
    min-height: -webkit-fill-available;
    background-color: var(--bodycolor);
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-feature-settings: "kern";
    -webkit-font-smoothing: antialiased;
    color: var(--black);
  }
  html {
    height: -webkit-fill-available;
  }
  a{
    color: var(--link-color);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
  h1, h2, h3, h4, h5, h6 {
    color:var(--black);
  }
  p {
    line-height: 1.75rem;
    font-size: 1rem;
  }
  ul, ol {
    margin: 1rem 0;
    padding: 0;
    padding-left: 0.5rem;
    li ol, li ul {
      margin: 0.3rem 0 0.5rem;
      padding-left: 0.5rem;
    }
  }
  li {
    padding-left: 1rem;
    margin-bottom: 0.3rem;
  }
  ul li {
    list-style: "-" outside;
  }
  ol {
    margin-left: 1rem;
    list-style-position: outside;
  }
`;

const HeadContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Main = styled.div`
  display: flex;
  justify-content: center;
`;
